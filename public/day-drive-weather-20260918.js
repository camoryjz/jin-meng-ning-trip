(() => {
  "use strict";

  // Approximate total rental-car mileage for the current 15-day route.
  // Values are intentionally rounded because exact navigation mileage changes
  // with hotel entrances, temporary traffic control and the final route chosen.
  const DAY_DRIVE_KM = {
    1: 65,
    2: 105,
    3: 250,
    4: 100,
    5: 60,
    6: 350,
    7: 105,
    8: 410,
    9: 190,
    10: 340,
    11: 140,
    12: 260,
    13: 150,
    14: 230,
    15: 30
  };

  const DAY_DRIVE_TIME = {
    1: "1小时40分",
    2: "1小时40分",
    3: "3小时30分",
    4: "2小时",
    5: "1小时40分",
    6: "4小时",
    7: "1小时50分",
    8: "4小时20分",
    9: "2小时50分",
    10: "4小时",
    11: "2小时15分",
    12: "3小时40分",
    13: "3小时50分",
    14: "3小时30分",
    15: "35分"
  };

  const DAY_DRIVE_NOTE = {
    10: "仅计租赁车辆公路段；腾格里五湖/六湖穿越的营地越野车里程与越野体验时间不计入。"
  };

  // One representative weather point per travel day. All points use WGS84.
  const WEATHER_TARGETS = {
    1:  { name: "太原", lat: 37.8695, lng: 112.5205 },
    2:  { name: "忻州", lat: 38.4097, lng: 112.7337 },
    3:  { name: "浑源", lat: 39.6992, lng: 113.6907 },
    4:  { name: "大同", lat: 40.0900, lng: 113.2960 },
    5:  { name: "大同", lat: 40.0900, lng: 113.2960 },
    6:  { name: "呼和浩特", lat: 40.8365, lng: 111.7710 },
    7:  { name: "希拉穆仁", lat: 41.3190, lng: 111.1860 },
    8:  { name: "巴彦淖尔", lat: 40.7445, lng: 107.3908 },
    9:  { name: "乌海", lat: 39.6745, lng: 106.8210 },
    10: { name: "腾格里沙漠", lat: 38.5200, lng: 105.0800 },
    11: { name: "银川西线", lat: 38.5900, lng: 105.9600 },
    12: { name: "中卫", lat: 37.5140, lng: 105.1872 },
    13: { name: "沙坡头", lat: 37.531873, lng: 104.991480 },
    14: { name: "银川", lat: 38.4770, lng: 106.2740 },
    15: { name: "银川", lat: 38.4770, lng: 106.2740 }
  };

  const WEATHER_CACHE_PREFIX = "jmn-weather-v2:";
  const WEATHER_CACHE_MS = 30 * 60 * 1000;
  const weatherRequests = new Map();

  const weatherText = (code) => {
    const c = Number(code);
    if (c === 0) return ["晴", "☀️"];
    if (c === 1) return ["大部晴朗", "🌤️"];
    if (c === 2) return ["多云", "⛅"];
    if (c === 3) return ["阴", "☁️"];
    if ([45, 48].includes(c)) return ["有雾", "🌫️"];
    if ([51, 53, 55, 56, 57].includes(c)) return ["毛毛雨", "🌦️"];
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(c)) return ["有雨", "🌧️"];
    if ([71, 73, 75, 77, 85, 86].includes(c)) return ["有雪", "🌨️"];
    if ([95, 96, 99].includes(c)) return ["雷雨", "⛈️"];
    return ["天气变化", "🌤️"];
  };

  const getDayDate = (dayNumber) => {
    const data = window.TRAVEL_PLAN_DATA;
    return data?.days?.find((item) => Number(item.day) === Number(dayNumber))?.date || "";
  };

  function weatherChip(dayNumber) {
    const target = WEATHER_TARGETS[dayNumber];
    if (!target) return "";
    return `<span class="day-weather-chip is-loading" data-day-weather="${dayNumber}" title="天气每次打开页面自动更新">
      <span class="day-weather-chip__icon">🌤️</span>
      <span class="day-weather-chip__text"><b>${target.name}</b><i>天气加载中</i></span>
    </span>`;
  }

  function mileageChip(dayNumber) {
    const km = DAY_DRIVE_KM[dayNumber];
    const driveTime = DAY_DRIVE_TIME[dayNumber];
    if (!km || !driveTime) return "";
    const note = DAY_DRIVE_NOTE[dayNumber] || "按当前行程节点估算；实际导航里程与驾驶时间以当天高德/百度路线和实时路况为准。";
    return `<span class="day-drive-chip" title="${note.replace(/"/g, "&quot;")}">
      <span aria-hidden="true">🚗</span><b>约${km}km｜约${driveTime}驾驶</b>
    </span>`;
  }

  function decorateDayCards() {
    document.querySelectorAll(".day-card[data-day]").forEach((card) => {
      const dayNumber = Number(card.dataset.day);
      const copy = card.querySelector(":scope > .day-toggle > span:first-child");
      if (!copy) return;

      let row = copy.querySelector(":scope > .day-route-weather");
      if (!row) {
        row = document.createElement("span");
        row.className = "day-route-weather";
        row.innerHTML = mileageChip(dayNumber) + weatherChip(dayNumber);
        const ticket = copy.querySelector(":scope > .day-ticket-summary");
        if (ticket) copy.insertBefore(row, ticket);
        else copy.append(row);
      } else {
        // Never replace an existing weather chip after it has loaded.
        // Repeated itinerary decorators used to reset every card back to "天气加载中".
        if (!row.querySelector(".day-drive-chip")) row.insertAdjacentHTML("afterbegin", mileageChip(dayNumber));
        if (!row.querySelector("[data-day-weather]")) row.insertAdjacentHTML("beforeend", weatherChip(dayNumber));
      }
    });
  }

  function decorateTripModeSummary(dayNumber = null) {
    document.querySelectorAll("[data-tm-day-summary]").forEach((host) => {
      const currentDay = Number(dayNumber || host.dataset.tmDaySummary);
      if (!currentDay || Number(host.dataset.tmDaySummary) !== currentDay) return;

      const source = document.querySelector(`.day-card[data-day="${currentDay}"] .day-route-weather`);
      if (source) {
        host.innerHTML = "";
        const clone = source.cloneNode(true);
        clone.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
        host.append(clone);
      } else if (!host.querySelector(".day-route-weather")) {
        const row = document.createElement("span");
        row.className = "day-route-weather";
        row.innerHTML = mileageChip(currentDay) + weatherChip(currentDay);
        host.append(row);
      }
    });
  }

  function readCache(target) {
    try {
      const key = WEATHER_CACHE_PREFIX + target.lat.toFixed(4) + "," + target.lng.toFixed(4);
      const parsed = JSON.parse(sessionStorage.getItem(key) || "null");
      if (parsed && Date.now() - parsed.savedAt < WEATHER_CACHE_MS) return parsed.data;
    } catch {}
    return null;
  }

  function writeCache(target, data) {
    try {
      const key = WEATHER_CACHE_PREFIX + target.lat.toFixed(4) + "," + target.lng.toFixed(4);
      sessionStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data }));
    } catch {}
  }

  async function fetchWeather(target) {
    const cached = readCache(target);
    if (cached) return cached;

    const requestKey = target.lat.toFixed(4) + "," + target.lng.toFixed(4);
    if (weatherRequests.has(requestKey)) return weatherRequests.get(requestKey);

    const task = (async () => {
      const params = new URLSearchParams({
        lat: String(target.lat),
        lng: String(target.lng)
      });

      // Use the same-origin Cloudflare function first so mobile browsers do not
      // depend on cross-origin weather requests. Fall back to Open-Meteo direct.
      let response;
      try {
        response = await fetch("/api/weather?" + params.toString(), {
          cache: "no-store",
          credentials: "same-origin"
        });
      } catch {}

      if (!response || !response.ok) {
        const direct = new URLSearchParams({
          latitude: String(target.lat),
          longitude: String(target.lng),
          daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_gusts_10m_max",
          timezone: "Asia/Shanghai",
          forecast_days: "16"
        });
        response = await fetch("https://api.open-meteo.com/v1/forecast?" + direct.toString(), {
          cache: "no-store",
          mode: "cors"
        });
      }

      if (!response.ok) throw new Error("Weather API " + response.status);
      const data = await response.json();
      writeCache(target, data);
      return data;
    })();

    weatherRequests.set(requestKey, task);
    try {
      return await task;
    } finally {
      weatherRequests.delete(requestKey);
    }
  }

  function dailyWeather(data, date) {
    const daily = data?.daily;
    if (!daily || !Array.isArray(daily.time)) return null;
    const index = daily.time.indexOf(date);
    if (index < 0) return null;
    return {
      code: daily.weather_code?.[index],
      max: daily.temperature_2m_max?.[index],
      min: daily.temperature_2m_min?.[index],
      rain: daily.precipitation_probability_max?.[index],
      gust: daily.wind_gusts_10m_max?.[index]
    };
  }

  function renderWeather(dayNumber, result, status = "ok") {
    document.querySelectorAll(`[data-day-weather="${dayNumber}"]`).forEach((chip) => {
      const target = WEATHER_TARGETS[dayNumber];
      if (!target) return;
      chip.classList.remove("is-loading", "is-unavailable", "is-error");

      const icon = chip.querySelector(".day-weather-chip__icon");
      const text = chip.querySelector(".day-weather-chip__text");

      if (status === "unavailable") {
        chip.classList.add("is-unavailable");
        icon.textContent = "🗓️";
        text.innerHTML = `<b>${target.name}</b><i>超出16日预报范围 · 临近自动更新</i>`;
        chip.title = "Open-Meteo 最长提供16天预报；临近该日期重新打开页面后会自动显示。";
        return;
      }

      if (status === "error" || !result) {
        chip.classList.add("is-error");
        icon.textContent = "↻";
        text.innerHTML = `<b>${target.name}</b><i>天气暂未获取</i>`;
        chip.title = "天气数据暂时无法加载，稍后重新打开页面即可重试。";
        return;
      }

      const [desc, emoji] = weatherText(result.code);
      const min = Number.isFinite(Number(result.min)) ? Math.round(Number(result.min)) : null;
      const max = Number.isFinite(Number(result.max)) ? Math.round(Number(result.max)) : null;
      const rain = Number.isFinite(Number(result.rain)) ? Math.round(Number(result.rain)) : null;
      const gust = Number.isFinite(Number(result.gust)) ? Math.round(Number(result.gust)) : null;

      icon.textContent = emoji;
      const temp = min !== null && max !== null ? `${min}~${max}℃` : "温度待更新";
      const rainText = rain !== null ? ` · 降水${rain}%` : "";
      text.innerHTML = `<b>${target.name} · ${desc}</b><i>${temp}${rainText}</i>`;
      chip.title = `${target.name}：${desc}，${temp}${rain !== null ? `，最高降水概率${rain}%` : ""}${gust !== null ? `，阵风最高约${gust}km/h` : ""}。天气来源：Open-Meteo，打开页面自动更新。`;
    });
  }

  async function loadDayWeather(dayNumber) {
    const target = WEATHER_TARGETS[dayNumber];
    const date = getDayDate(dayNumber);
    if (!target || !date) {
      renderWeather(dayNumber, null, "error");
      return;
    }

    const failSafe = window.setTimeout(() => {
      const chip = document.querySelector(`[data-day-weather="${dayNumber}"].is-loading`);
      if (chip) renderWeather(dayNumber, null, "error");
    }, 9000);

    try {
      const data = await fetchWeather(target);
      const result = dailyWeather(data, date);
      renderWeather(dayNumber, result, result ? "ok" : "unavailable");
    } catch (error) {
      console.warn("Daily weather unavailable", dayNumber, error);
      renderWeather(dayNumber, null, "error");
    } finally {
      window.clearTimeout(failSafe);
    }
  }

  function refresh() {
    decorateDayCards();
    decorateTripModeSummary();
    Object.keys(WEATHER_TARGETS).map(Number).forEach((dayNumber, index) => {
      window.setTimeout(() => loadDayWeather(dayNumber), index * 70);
    });
  }

  document.addEventListener("travel-data-ready", () => window.setTimeout(refresh, 80));
  window.addEventListener("travel-view:shown", () => window.setTimeout(refresh, 50));
  window.addEventListener("trip-mode:rendered", (event) => {
    const dayNumber = Number(event.detail?.day || 0);
    window.setTimeout(() => {
      decorateTripModeSummary(dayNumber);
      if (dayNumber) loadDayWeather(dayNumber);
    }, 0);
  });
  window.addEventListener("load", () => window.setTimeout(refresh, 220), { once: true });
  [250, 900, 2200].forEach((delay) => window.setTimeout(() => {
    decorateDayCards();
    decorateTripModeSummary();
  }, delay));
})();
