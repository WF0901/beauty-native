import { createRequire } from "node:module";
import module from "node:module";

process.env.NODE_PATH = "C:/Users/WF/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
module.Module._initPaths();

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const baseUrl = process.env.PROTOTYPE_URL || "http://127.0.0.1:4174";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const errors = [];
const listenForErrors = (page) => {
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
};

const admin = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
listenForErrors(admin);
await admin.goto(`${baseUrl}/admin`, { waitUntil: "domcontentloaded" });
const loginVisible = await admin.getByRole("heading", { name: "用账号进入对应工作台" }).count();
await admin.getByRole("button", { name: "有赞测试美容店长" }).click();
await admin.getByRole("button", { name: "进入商户管理员工作台" }).click();
await admin.waitForSelector(".merchant-hero");
const roleSwitchCount = await admin.locator("select[aria-label='切换演示身份']").count();
const platformMerchantSwitcher = await admin.locator("select[aria-label='平台查看商户']").count();
await admin.getByRole("button", { name: "体验微信小程序" }).click();
const customerUrl = await admin.getByRole("textbox", { name: "顾客端地址" }).inputValue();
const customerPersonaInAdmin = await admin.getByRole("option", { name: "顾客小程序", exact: true }).count();

await admin.locator("#customerDemoModal .icon-button").click();
await admin.getByRole("button", { name: "退出登录" }).click();
await admin.getByRole("button", { name: "清颜皮肤管理店长" }).click();
await admin.getByRole("button", { name: "进入商户管理员工作台" }).click();
await admin.waitForSelector(".merchant-hero");
const secondMerchantTitle = await admin.locator(".sidebar-account strong").innerText();
const secondMerchantItems = await admin.locator(".service-item h4").allTextContents();

const customer = await browser.newPage({ viewport: { width: 390, height: 844 } });
listenForErrors(customer);
await customer.goto(`${baseUrl}/customer?merchant=2&store=2&customer=3`, { waitUntil: "domcontentloaded" });
const standaloneChrome = {
  sidebar: await customer.locator(".sidebar").count(),
  topbar: await customer.locator(".topbar").count(),
  contextBar: await customer.locator(".mini-context-bar").count(),
};
const storeName = await customer.locator(".mini-hero span").innerText();
const itemNames = await customer.locator(".mini-item h4").allTextContents();
await customer.getByRole("button", { name: /AI顾问/ }).click();
await customer.locator(".quick-question-list button").first().click();
const recommendationCount = await customer.locator(".chat-service-card").count();
await customer.getByRole("button", { name: /预约/ }).last().click();
await customer.locator("[data-mini-book]").first().click();
await customer.getByRole("button", { name: /订单/ }).click();
const orderCount = await customer.locator(".mini-order").count();
const layout = await customer.evaluate(() => ({
  bodyWidth: document.body.scrollWidth,
  viewportWidth: window.innerWidth,
  navBottom: Math.round(document.querySelector(".mini-tabbar").getBoundingClientRect().bottom),
  viewportHeight: window.innerHeight,
}));

await browser.close();
console.log(JSON.stringify({
  customerUrl,
  loginVisible,
  roleSwitchCount,
  platformMerchantSwitcher,
  customerPersonaInAdmin,
  secondMerchantTitle,
  secondMerchantItems,
  standaloneChrome,
  storeName,
  itemNames,
  recommendationCount,
  orderCount,
  layout,
  errors,
}, null, 2));
