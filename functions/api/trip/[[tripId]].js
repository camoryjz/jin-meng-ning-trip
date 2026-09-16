const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
});

const collectionSpec = {
  bills: { table: "ledger_bills", prefix: "" },
  travelers: { table: "ledger_travelers", prefix: "" },
  todos: { table: "trip_todos", prefix: "", excludePrefix: "__checkin__:" },
  tickets: { table: "trip_tickets", prefix: "", excludePrefix: "__attachment__:" },
  checkins: { table: "trip_todos", prefix: "__checkin__:" },
  attachments: { table: "trip_tickets", prefix: "__attachment__:" }
};

const safeId = (value) => String(value || "").trim().slice(0, 200);

async function readCollection(db, tripId, collection) {
  const spec = collectionSpec[collection];
  let sql = `SELECT payload FROM ${spec.table} WHERE trip_id = ?`;
  const bindings = [tripId];
  if (spec.prefix) {
    sql += " AND id LIKE ?";
    bindings.push(`${spec.prefix}%`);
  } else if (spec.excludePrefix) {
    sql += " AND id NOT LIKE ?";
    bindings.push(`${spec.excludePrefix}%`);
  }
  sql += " ORDER BY created_at, id";
  const statement = db.prepare(sql).bind(...bindings);
  const result = await statement.all();
  return result.results.map((row) => JSON.parse(row.payload));
}

async function readSnapshot(db, tripId, collections) {
  const snapshot = {
    version: 2,
    settings: null,
    bills: [],
    travelers: [],
    todos: [],
    tickets: [],
    checkins: [],
    attachments: [],
    updatedAt: new Date().toISOString()
  };
  await Promise.all(collections.map(async (collection) => {
    snapshot[collection] = await readCollection(db, tripId, collection);
  }));
  return snapshot;
}

export async function onRequest(context) {
  const tripId = safeId(context.params.tripId);
  if (!tripId) return json({ error: "trip_id is required" }, 400);
  if (!context.env.DB) return json({ error: "D1 binding DB is missing" }, 500);
  const requested = new URL(context.request.url).searchParams.get("collections");
  const collections = [...new Set(String(requested || Object.keys(collectionSpec).join(",")).split(",").filter((name) => collectionSpec[name]))];
  if (!collections.length) return json({ error: "at least one valid collection is required" }, 400);

  try {
    if (context.request.method === "GET") return json(await readSnapshot(context.env.DB, tripId, collections));
    if (context.request.method !== "POST") return json({ error: "method not allowed" }, 405);
    if (!context.env.EDIT_PIN) return json({ error: "EDIT_PIN_NOT_CONFIGURED" }, 500);

    const providedPin = context.request.headers.get("x-edit-pin") || "";
    if (providedPin !== context.env.EDIT_PIN) return json({ error: "UNAUTHORIZED" }, 401);

    const body = await context.request.json();
    if (!Array.isArray(body.changes)) return json({ error: "changes must be an array" }, 400);

    const statements = [];
    for (const change of body.changes) {
      const spec = collectionSpec[change.collection];
      const baseId = safeId(change.id);
      if (!spec || !collections.includes(change.collection) || !baseId || !["upsert", "delete"].includes(change.op)) {
        return json({ error: "invalid change" }, 400);
      }
      const id = `${spec.prefix}${baseId}`;
      if (change.op === "delete") {
        statements.push(context.env.DB.prepare(`DELETE FROM ${spec.table} WHERE trip_id = ? AND id = ?`).bind(tripId, id));
        continue;
      }

      const payload = JSON.stringify(change.value || {});
      const now = new Date().toISOString();
      if (change.collection === "bills") {
        const value = change.value || {};
        statements.push(context.env.DB.prepare(`INSERT INTO ledger_bills (id, trip_id, payer, amount, currency, category, note, participants, created_at, updated_at, payload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(trip_id, id) DO UPDATE SET payer=excluded.payer, amount=excluded.amount, currency=excluded.currency, category=excluded.category, note=excluded.note, participants=excluded.participants, updated_at=excluded.updated_at, payload=excluded.payload`).bind(id, tripId, value.payerId || value.payer || "", Number(value.baseAmountCents ?? value.amount ?? 0), value.currency || "CNY", value.category || "其他", typeof value.note === "string" ? value.note.trim().slice(0, 160) : "", JSON.stringify(value.participantIds || value.participants || []), value.createdAt || now, value.updatedAt || now, payload));
      } else {
        statements.push(context.env.DB.prepare(`INSERT INTO ${spec.table} (id, trip_id, created_at, updated_at, payload) VALUES (?, ?, ?, ?, ?) ON CONFLICT(trip_id, id) DO UPDATE SET updated_at=excluded.updated_at, payload=excluded.payload`).bind(id, tripId, change.value?.createdAt || now, change.value?.updatedAt || now, payload));
      }
    }

    if (statements.length) await context.env.DB.batch(statements);
    return json(await readSnapshot(context.env.DB, tripId, collections));
  } catch (error) {
    return json({ error: "database operation failed", detail: error.message }, 500);
  }
}
