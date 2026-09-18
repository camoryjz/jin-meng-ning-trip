const json = (body, status = 200, extraHeaders = {}) => new Response(JSON.stringify(body), {
  status,
  headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "private, max-age=600",
    ...extraHeaders
  }
});

function validCoordinate(value, min, max) {
  const number = Number(value);
  return Number.isFinite(number) && number >= min && number <= max ? number : null;
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const lat = validCoordinate(url.searchParams.get("lat"), -90, 90);
  const lng = validCoordinate(url.searchParams.get("lng"), -180, 180);
  if (lat === null || lng === null) return json({ error: "invalid coordinates" }, 400);

  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_gusts_10m_max",
    timezone: "Asia/Shanghai",
    forecast_days: "16"
  });

  try {
    const response = await fetch("https://api.open-meteo.com/v1/forecast?" + params.toString(), {
      headers: { "accept": "application/json" }
    });
    if (!response.ok) return json({ error: "weather upstream failed", status: response.status }, 502);
    const data = await response.json();
    return json(data, 200, { "x-weather-source": "open-meteo" });
  } catch (error) {
    return json({ error: "weather request failed", detail: error.message }, 502);
  }
}
