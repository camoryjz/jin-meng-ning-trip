(() => {
  "use strict";

  document.addEventListener("travel-data-ready", (event) => {
    const data = event.detail;
    if (!data) return;

    data.ticketPlanning = data.ticketPlanning || { items: [] };
    const items = data.ticketPlanning.items || (data.ticketPlanning.items = []);
    const ticket = {
      id: "ticket-xinzhou-iron-flower",
      day: 2,
      name: "忻州古城打铁花门票",
      title: "忻州古城打铁花门票",
      requirement: "required",
      guidance: "需要提前购买门票并锁定场次；当前行程优先20:30场。演出时间、观看区域、实名/换票要求及退改规则以购票页和当天官方公告为准。"
    };
    const index = items.findIndex((item) => item.id === ticket.id);
    if (index >= 0) items[index] = { ...items[index], ...ticket };
    else items.splice(0, 0, ticket);

    const day2 = data.days?.find((day) => day.day === 2);
    const show = day2?.schedule?.find((item) => item.id === "d2-iron-flower");
    if (show && !String(show.text).includes("提前购票")) {
      show.text += "【需提前购票并锁定场次】";
    }
  }, { once: true });
})();
