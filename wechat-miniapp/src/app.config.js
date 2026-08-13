export default defineAppConfig({
  pages: [
    "pages/home/index",
    "pages/advisor/index",
    "pages/booking/index",
    "pages/orders/index",
    "pages/cards/index",
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#ffffff",
    navigationBarTitleText: "到店服务",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    color: "#7a8582",
    selectedColor: "#087d6f",
    backgroundColor: "#ffffff",
    borderStyle: "white",
    list: [
      { pagePath: "pages/home/index", text: "首页" },
      { pagePath: "pages/advisor/index", text: "AI顾问" },
      { pagePath: "pages/booking/index", text: "预约" },
      { pagePath: "pages/orders/index", text: "订单" },
      { pagePath: "pages/cards/index", text: "卡包" }
    ]
  }
});
