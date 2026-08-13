import React, { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

const today = "2026-08-14";

const yuan = (fen) =>
  `¥${(fen / 100).toLocaleString("zh-CN", {
    minimumFractionDigits: fen % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;

const initialState = {
  currentAccountId: "merchant_admin_1",
  currentView: "merchant",
  activePage: "dashboard",
  industry: "beauty",
  activeMerchantId: 1,
  activeStoreId: 1,
  activeCustomerId: 1,
  editingItemId: null,
  editingStoreId: null,
  editingStaffId: null,
  editingCustomerId: null,
  calendarStatus: "all",
  calendarView: "today",
  technicianFilter: "all",
  activeModal: null,
  verifyOrderId: null,
  merchants: [
    {
      id: 1,
      name: "有赞测试美容",
      contactName: "张三",
      contactPhone: "13800001111",
      packageEnd: "2026-12-31",
      status: "active",
      industry: "beauty",
    },
    {
      id: 2,
      name: "清颜皮肤管理",
      contactName: "陈总",
      contactPhone: "13800005555",
      packageEnd: "2026-09-30",
      status: "trial",
      industry: "massage",
    },
  ],
  stores: [
    {
      id: 1,
      merchantId: 1,
      name: "杭州西湖店",
      address: "杭州市西湖区文三路100号",
      phone: "0571-88881234",
      businessHours: "09:00-21:00",
      isActive: true,
    },
    {
      id: 2,
      merchantId: 2,
      name: "上海静安店",
      address: "上海市静安区南京西路88号",
      phone: "021-68881234",
      businessHours: "10:00-22:00",
      isActive: true,
    },
  ],
  staff: [
    { id: 1, merchantId: 1, storeId: 1, name: "李店长", phone: "13900002222", role: "admin", isActive: true },
    { id: 2, merchantId: 1, storeId: 1, name: "王技师", phone: "13700003333", role: "technician", isActive: true },
    { id: 3, merchantId: 1, storeId: 1, name: "周技师", phone: "13500006666", role: "technician", isActive: true },
    { id: 4, merchantId: 1, storeId: 1, name: "前台小林", phone: "13400007777", role: "receptionist", isActive: true },
    { id: 5, merchantId: 2, storeId: 2, name: "陈技师", phone: "13600009998", role: "technician", isActive: true },
    { id: 6, merchantId: 2, storeId: 2, name: "陈店长", phone: "13800005555", role: "admin", isActive: true },
  ],
  customers: [
    { id: 1, merchantId: 1, homeStoreId: 1, name: "赵女士", phone: "13600004444", gender: "female", totalSpent: 0, remark: "偏好安静房间" },
    { id: 2, merchantId: 1, homeStoreId: 1, name: "王女士", phone: "13600008821", gender: "female", totalSpent: 12800, remark: "敏感肌，避免刺激性产品" },
    { id: 3, merchantId: 2, homeStoreId: 2, name: "林女士", phone: "13600009987", gender: "female", totalSpent: 0, remark: "首次到店，偏好轻柔服务" },
  ],
  serviceItems: [
    {
      id: 1,
      merchantId: 1,
      storeId: 1,
      name: "面部深层清洁",
      price: 12800,
      durationMinutes: 60,
      isOnline: true,
      tags: ["深层清洁", "毛孔护理"],
    },
    {
      id: 2,
      merchantId: 1,
      storeId: 1,
      name: "敏感舒缓修护",
      price: 16800,
      durationMinutes: 90,
      isOnline: true,
      tags: ["深层补水", "敏感修护"],
    },
    {
      id: 3,
      merchantId: 1,
      storeId: 1,
      name: "水光修护护理",
      price: 19800,
      durationMinutes: 75,
      isOnline: true,
      tags: ["深层补水", "敏感修护"],
    },
    {
      id: 4,
      merchantId: 2,
      storeId: 2,
      name: "肩颈舒缓放松",
      price: 19800,
      durationMinutes: 60,
      isOnline: true,
      tags: ["肩颈酸痛", "肌肉僵硬", "全身放松"],
    },
    {
      id: 5,
      merchantId: 2,
      storeId: 2,
      name: "全身经络舒压",
      price: 26800,
      durationMinutes: 90,
      isOnline: true,
      tags: ["疲劳乏力", "全身放松", "腰背不适"],
    },
  ],
  orders: [
    {
      id: 1,
      merchantId: 1,
      storeId: 1,
      customerId: 1,
      serviceItemId: 1,
      technicianId: 2,
      appointmentStartAt: "2026-08-14 10:00:00",
      appointmentEndAt: "2026-08-14 11:00:00",
      status: "pending",
      paymentStatus: "unpaid",
      source: "mini_program",
      paymentMethod: "offline",
      totalAmount: 12800,
      paidAmount: 0,
      discountAmount: 0,
      remark: "顾客对酒精过敏，请使用无酒精产品",
    },
    {
      id: 2,
      merchantId: 1,
      storeId: 1,
      customerId: 2,
      serviceItemId: 2,
      technicianId: 3,
      appointmentStartAt: "2026-08-14 14:00:00",
      appointmentEndAt: "2026-08-14 15:30:00",
      status: "completed",
      paymentStatus: "paid",
      source: "admin_manual",
      paymentMethod: "offline",
      totalAmount: 16800,
      paidAmount: 16800,
      discountAmount: 0,
      remark: "重点放松肩颈",
      verifiedAt: "2026-08-14 15:25:00",
      verifiedBy: 1,
    },
    {
      id: 3,
      merchantId: 1,
      storeId: 1,
      customerId: 2,
      serviceItemId: 3,
      technicianId: 2,
      appointmentStartAt: "2026-08-14 13:30:00",
      appointmentEndAt: "2026-08-14 14:45:00",
      status: "pending",
      paymentStatus: "deposit_paid",
      source: "mini_program",
      paymentMethod: "wechat",
      totalAmount: 19800,
      paidAmount: 5000,
      discountAmount: 0,
      remark: "首次到店，希望先沟通皮肤状态",
    },
    {
      id: 4,
      merchantId: 1,
      storeId: 1,
      customerId: 1,
      serviceItemId: 2,
      technicianId: 2,
      appointmentStartAt: "2026-08-13 16:00:00",
      appointmentEndAt: "2026-08-13 17:30:00",
      status: "completed",
      paymentStatus: "paid",
      source: "admin_manual",
      paymentMethod: "wechat",
      totalAmount: 16800,
      paidAmount: 15800,
      discountAmount: 1000,
      remark: "服务后泛红明显缓解，下次继续使用温和产品",
      verifiedAt: "2026-08-13 17:28:00",
      verifiedBy: 1,
    },
    {
      id: 5,
      merchantId: 1,
      storeId: 1,
      customerId: 2,
      serviceItemId: 1,
      technicianId: 2,
      appointmentStartAt: "2026-08-08 11:00:00",
      appointmentEndAt: "2026-08-08 12:00:00",
      status: "completed",
      paymentStatus: "paid",
      source: "mini_program",
      paymentMethod: "balance",
      totalAmount: 12800,
      paidAmount: 12800,
      discountAmount: 0,
      remark: "重点清洁鼻翼和下巴，已建议一周后复查",
      verifiedAt: "2026-08-08 12:02:00",
      verifiedBy: 1,
    },
  ],
  operationLogs: [
    { id: 1, orderId: 1, action: "create", operatorStaffId: 1, createdAt: "2026-08-13 12:20:00" },
  ],
  advisorSessions: {
    "1:1:1": {
      messages: [
        {
          id: 1,
          role: "assistant",
          text: "你好，我是门店的 AI 服务顾问。可以告诉我哪里不舒服，或者你想达到什么效果，我会先了解情况，再从本店项目里为你推荐。如果情况不适合门店服务，我会建议你先做正规医疗评估，也可以随时转人工客服。",
        },
      ],
      humanSupport: {
        status: "idle",
        requestedAt: null,
      },
    },
  },
};

const STATE_STORAGE_KEY = "beauty-saas-mvp-state-v1";

function readPersistedState() {
  if (typeof window === "undefined") return structuredClone(initialState);
  try {
    const stored = window.localStorage.getItem(STATE_STORAGE_KEY);
    if (!stored) return structuredClone(initialState);
    const parsed = JSON.parse(stored);
    return {
      ...structuredClone(initialState),
      ...parsed,
      activeModal: null,
      verifyOrderId: null,
      editingItemId: null,
      editingStoreId: null,
      editingStaffId: null,
      editingCustomerId: null,
    };
  } catch {
    return structuredClone(initialState);
  }
}

function getInitialStateForRoute() {
  const baseState = readPersistedState();
  if (!window.location.pathname.startsWith("/customer")) return baseState;

  const params = new URLSearchParams(window.location.search);
  const requestedMerchantId = Number(params.get("merchant")) || baseState.activeMerchantId;
  const merchant = baseState.merchants.find((item) => item.id === requestedMerchantId) ?? baseState.merchants[0];
  const merchantStores = baseState.stores.filter((store) => store.merchantId === merchant.id);
  const requestedStoreId = Number(params.get("store"));
  const store = merchantStores.find((item) => item.id === requestedStoreId)
    ?? merchantStores.find((item) => item.isActive !== false)
    ?? merchantStores[0];
  const merchantCustomers = baseState.customers.filter((customer) => customer.merchantId === merchant.id);
  const requestedCustomerId = Number(params.get("customer"));
  const customer = merchantCustomers.find((item) => item.id === requestedCustomerId) ?? merchantCustomers[0];
  const requestedPage = params.get("page");
  const customerPages = new Set(["home", "advisor", "bookings", "my_orders", "cards"]);

  return {
    ...baseState,
    currentView: "customer",
    activePage: customerPages.has(requestedPage) ? requestedPage : "home",
    activeMerchantId: merchant.id,
    activeStoreId: store?.id ?? null,
    activeCustomerId: customer?.id ?? null,
    industry: merchant.industry,
  };
}

function applyAccountContext(state, accountId) {
  const account = mockAccounts.find((item) => item.id === accountId) ?? mockAccounts[0];
  const merchant = account.merchantId
    ? state.merchants.find((item) => item.id === account.merchantId)
    : state.merchants.find((item) => item.id === state.activeMerchantId) ?? state.merchants[0];
  const merchantStores = merchant ? state.stores.filter((store) => store.merchantId === merchant.id) : [];
  const store =
    account.storeId
      ? merchantStores.find((item) => item.id === account.storeId)
      : merchantStores.find((item) => item.id === state.activeStoreId) ?? merchantStores.find((item) => item.isActive !== false) ?? merchantStores[0];
  const merchantCustomers = merchant ? state.customers.filter((customer) => customer.merchantId === merchant.id) : [];
  const customer =
    account.customerId
      ? merchantCustomers.find((item) => item.id === account.customerId)
      : merchantCustomers.find((item) => item.id === state.activeCustomerId) ?? merchantCustomers[0];

  return {
    ...state,
    currentAccountId: account.id,
    currentView: account.role,
    activePage: roleProfiles[account.role].nav[0].id,
    activeMerchantId: merchant?.id ?? null,
    activeStoreId: store?.id ?? null,
    activeCustomerId: customer?.id ?? null,
    industry: merchant?.industry || state.industry,
    activeModal: null,
    editingItemId: null,
    editingStoreId: null,
    editingStaffId: null,
    editingCustomerId: null,
    verifyOrderId: null,
  };
}

const industryTemplates = {
  massage: {
    name: "按摩推拿",
    tags: ["肩颈酸痛", "腰背不适", "肌肉僵硬", "疲劳乏力", "全身放松", "睡眠困扰", "足部护理"],
    quickQuestions: ["久坐肩颈很僵，适合什么？", "最近腰背酸胀，可以按摩吗？", "想放松一下，推荐哪个项目？"],
  },
  beauty: {
    name: "美容护理",
    tags: ["深层清洁", "深层补水", "敏感修护", "提亮肤色", "紧致抗衰", "毛孔护理", "眼部护理"],
    quickQuestions: ["皮肤干而且泛红，适合什么？", "毛孔比较明显怎么护理？", "想做温和的补水项目"],
  },
  hair: {
    name: "美发造型",
    tags: ["剪发设计", "染发", "烫发", "深度护发", "头皮养护", "头发修复"],
    quickQuestions: ["头发干枯，适合做什么护理？", "第一次染发怎么选择？", "想换发型但还没想好"],
  },
};

const mockAccounts = [
  {
    id: "platform_ops",
    role: "platform",
    title: "平台运营王敏",
    subtitle: "平台管理员 · 可管理全部商户",
    merchantId: null,
    storeId: null,
    customerId: null,
    password: "123456",
  },
  {
    id: "merchant_admin_1",
    role: "merchant",
    title: "有赞测试美容店长",
    subtitle: "商户管理员 · 有赞测试美容",
    merchantId: 1,
    storeId: 1,
    customerId: null,
    password: "123456",
  },
  {
    id: "merchant_admin_2",
    role: "merchant",
    title: "清颜皮肤管理店长",
    subtitle: "商户管理员 · 清颜皮肤管理",
    merchantId: 2,
    storeId: 2,
    customerId: null,
    password: "123456",
  },
  {
    id: "receptionist_2",
    role: "receptionist",
    title: "清颜前台",
    subtitle: "门店前台 · 上海静安店",
    merchantId: 2,
    storeId: 2,
    staffId: 6,
    customerId: null,
    password: "123456",
  },
  {
    id: "receptionist_1",
    role: "receptionist",
    title: "前台小林",
    subtitle: "门店前台 · 杭州西湖店",
    merchantId: 1,
    storeId: 1,
    staffId: 4,
    customerId: null,
    password: "123456",
  },
  {
    id: "technician_1",
    role: "technician",
    title: "王技师",
    subtitle: "服务技师 · 杭州西湖店",
    merchantId: 1,
    storeId: 1,
    staffId: 2,
    customerId: null,
    password: "123456",
  },
  {
    id: "customer_1",
    role: "customer",
    title: "赵女士",
    subtitle: "顾客会员 · 杭州西湖店",
    merchantId: 1,
    storeId: 1,
    customerId: 1,
    password: "123456",
  },
];

const roleProfiles = {
  platform: {
    label: "平台管理员",
    workspace: "平台运营后台",
    account: "平台运营 · 王敏",
    note: "管理所有商户和平台数据",
    nav: [
      { id: "dashboard", label: "平台概览", icon: "▦" },
      { id: "merchants", label: "商户管理", icon: "◇" },
      { id: "billing", label: "套餐与计费", icon: "¥" },
      { id: "industry_templates", label: "行业模板", icon: "✦" },
      { id: "logs", label: "工单与日志", icon: "≡" },
    ],
  },
  merchant: {
    label: "商户管理员",
    workspace: "商家管理端",
    account: "李店长 · 管理员",
    note: "有赞测试美容 · 全部门店",
    nav: [
      { id: "dashboard", label: "工作台", icon: "▦" },
      { id: "stores", label: "门店管理", icon: "⌂" },
      { id: "staff", label: "员工管理", icon: "♧" },
      { id: "items", label: "服务项目", icon: "✦" },
      { id: "customers", label: "会员管理", icon: "◎" },
      { id: "reports", label: "经营报表", icon: "▥" },
    ],
  },
  receptionist: {
    label: "门店前台",
    workspace: "门店员工端",
    account: "前台小林 · 收银/前台",
    note: "杭州西湖店 · 日常接待",
    nav: [
      { id: "appointments", label: "预约日历", icon: "▦" },
      { id: "orders", label: "订单核销", icon: "✓" },
      { id: "customers", label: "会员档案", icon: "◎" },
    ],
  },
  technician: {
    label: "服务技师",
    workspace: "门店员工端",
    account: "王技师 · 服务技师",
    note: "杭州西湖店 · 只看本人预约",
    nav: [
      { id: "my_schedule", label: "工作日程", icon: "▦" },
      { id: "service_history", label: "服务台账", icon: "✓" },
      { id: "profile", label: "个人资料", icon: "○" },
    ],
  },
  customer: {
    label: "顾客",
    workspace: "微信小程序",
    account: "赵女士 · 会员",
    note: "杭州西湖店",
    nav: [
      { id: "home", label: "首页", icon: "⌂" },
      { id: "advisor", label: "AI 服务顾问", icon: "✦" },
      { id: "bookings", label: "预约服务", icon: "＋" },
      { id: "my_orders", label: "我的订单", icon: "▤" },
      { id: "cards", label: "我的卡包", icon: "◇" },
    ],
  },
};

const pageMeta = {
  platform: {
    dashboard: { eyebrow: "平台运营后台", title: "管理全平台商户和经营数据", action: "创建商户", modal: "merchant" },
    merchants: { eyebrow: "平台运营后台 / 商户管理", title: "管理入驻商户和租户状态", action: "创建商户", modal: "merchant" },
    billing: { eyebrow: "平台运营后台 / 套餐与计费", title: "维护套餐、到期时间和平台收入", action: "" },
    industry_templates: { eyebrow: "平台运营后台 / 行业模板", title: "维护各行业的诉求标签和推荐规则", action: "" },
    logs: { eyebrow: "平台运营后台 / 工单与日志", title: "追踪商户反馈和关键操作", action: "" },
  },
  merchant: {
    dashboard: { eyebrow: "商家管理端 / 工作台", title: "杭州西湖店今日经营概览", action: "新增项目", modal: "item" },
    stores: { eyebrow: "商家管理端 / 门店管理", title: "维护门店信息和营业状态", action: "新增门店", modal: "store" },
    staff: { eyebrow: "商家管理端 / 员工管理", title: "管理员工账号、岗位和门店归属", action: "新增员工", modal: "staff" },
    items: { eyebrow: "商家管理端 / 服务项目", title: "配置顾客可预约的服务项目", action: "新增项目", modal: "item" },
    customers: { eyebrow: "商家管理端 / 会员管理", title: "查看商户级会员档案和消费历史", action: "" },
    reports: { eyebrow: "商家管理端 / 经营报表", title: "用数据看清门店经营表现", action: "" },
  },
  receptionist: {
    appointments: { eyebrow: "门店员工端 / 预约日历", title: "杭州西湖店预约与排班", action: "新增预约", modal: "order" },
    orders: { eyebrow: "门店员工端 / 订单核销", title: "快速完成到店订单核销", action: "" },
    customers: { eyebrow: "门店员工端 / 会员档案", title: "查询顾客信息和到店记录", action: "" },
  },
  technician: {
    my_schedule: { eyebrow: "门店员工端 / 工作日程", title: "今天先做什么，一眼看清", action: "" },
    service_history: { eyebrow: "门店员工端 / 服务台账", title: "复盘服务、顾客与个人业绩", action: "" },
    profile: { eyebrow: "门店员工端 / 个人资料", title: "维护个人服务信息", action: "" },
  },
  customer: {
    home: { eyebrow: "微信小程序", title: "顾客预约、下单和查看订单", action: "" },
    advisor: { eyebrow: "微信小程序 / AI 服务顾问", title: "用对话找到更适合的门店服务", action: "" },
    bookings: { eyebrow: "微信小程序 / 预约服务", title: "选择项目并预约到店", action: "" },
    my_orders: { eyebrow: "微信小程序 / 我的订单", title: "查看预约状态和服务记录", action: "" },
    cards: { eyebrow: "微信小程序 / 我的卡包", title: "查看余额、次卡和优惠券", action: "" },
  },
};

const statusText = {
  active: "正式",
  trial: "试用",
  expired: "过期",
  pending: "待到店",
  completed: "已完成",
  cancelled: "已取消",
  unpaid: "未支付",
  deposit_paid: "已付定金",
  paid: "已付全款",
};

const roleText = {
  admin: "商户管理员",
  receptionist: "收银/前台",
  technician: "技师",
};

function nextId(collection) {
  return Math.max(0, ...collection.map((item) => item.id)) + 1;
}

function addMinutes(dateText, minutes) {
  const date = new Date(dateText.replace(" ", "T"));
  date.setMinutes(date.getMinutes() + minutes);
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
}

function createAdvisorSession(store) {
  return {
    messages: [
      {
        id: 1,
        role: "assistant",
        text: `你好，我是${store?.name || "当前门店"}的 AI 服务顾问。可以告诉我哪里不舒服，或者你想达到什么效果，我会先了解情况，再从当前门店的在售项目里为你推荐。如果情况不适合门店服务，我会建议你先做正规医疗评估，也可以随时转人工客服。`,
      },
    ],
    humanSupport: {
      status: "idle",
      requestedAt: null,
    },
  };
}

function buildAdvisorReply(query, serviceItems) {
  const riskWords = ["突然剧痛", "剧烈疼痛", "骨折", "发热", "麻木", "感染", "出血", "急性损伤"];
  if (riskWords.some((word) => query.includes(word))) {
    return {
      text: "你描述的情况可能不适合直接接受门店服务。为了安全，建议先到正规医疗机构检查；我不会在这种情况下推荐按摩或护理项目。需要的话，可以帮你联系门店人工客服。",
      recommendationIds: [],
      risk: true,
    };
  }

  const intentRules = [
    { words: ["肩膀", "肩部", "肩颈", "脖子僵", "久坐", "颈椎"], tags: ["肩颈酸痛", "肌肉僵硬"] },
    { words: ["疲劳", "放松", "没劲", "压力大"], tags: ["疲劳乏力", "全身放松"] },
    { words: ["腰", "腰背", "后背"], tags: ["腰背不适", "肌肉僵硬"] },
    { words: ["皮肤干", "补水", "泛红", "敏感"], tags: ["深层补水", "敏感修护"] },
    { words: ["毛孔", "清洁", "黑头", "出油"], tags: ["深层清洁", "毛孔护理"] },
    { words: ["头发干", "发质", "受损"], tags: ["深度护发", "头发修复"] },
  ];
  const matchedTags = intentRules.filter((rule) => rule.words.some((word) => query.includes(word))).flatMap((rule) => rule.tags);

  if (!matchedTags.length) {
    return {
      text: "我还需要多了解一点：你主要想改善什么问题，持续多久了？也可以告诉我服务部位、预算和可接受时长。若你不确定怎么描述，直接说“想放松”“皮肤干”或“毛孔明显”也可以，我会继续帮你判断。",
      recommendationIds: [],
    };
  }

  const ranked = serviceItems
    .filter((item) => item.isOnline)
    .map((item) => ({ item, score: (item.tags || []).filter((tag) => matchedTags.includes(tag)).length }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (!ranked.length) {
    return {
      text: `我识别到你的主要诉求是“${[...new Set(matchedTags)].join("、")}”，但当前门店暂时没有匹配且已上架的服务项目。我不会用其他商户或无关项目代替推荐；如果你愿意，我可以帮你转接当前门店人工客服确认是否有合适安排。`,
      recommendationIds: [],
      noMatch: true,
    };
  }

  return {
    text: `根据你提到的情况，我优先匹配了“${[...new Set(matchedTags)].join("、")}”。下面这些项目来自本店真实在售服务，你可以先查看推荐理由，再决定是否预约。`,
    recommendationIds: ranked.map(({ item }) => item.id),
  };
}

function App() {
  const isStandaloneCustomer = window.location.pathname.startsWith("/customer");
  const [state, setState] = useState(getInitialStateForRoute);
  const [isLoggedIn, setIsLoggedIn] = useState(isStandaloneCustomer);
  const [toast, setToast] = useState("");
  const [showCustomerDemo, setShowCustomerDemo] = useState(false);
  const [customerDemoUrlOverride, setCustomerDemoUrlOverride] = useState("");
  const activeAccount = mockAccounts.find((account) => account.id === state.currentAccountId) ?? mockAccounts[1];

  useEffect(() => {
    try {
      const {
        activeModal,
        verifyOrderId,
        editingItemId,
        editingStoreId,
        editingStaffId,
        editingCustomerId,
        ...persistableState
      } = state;
      window.localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(persistableState));
    } catch {
      // Local storage is optional in restricted browser previews.
    }
  }, [state]);

  const activeMerchant = state.merchants.find((merchant) => merchant.id === state.activeMerchantId) ?? state.merchants[0];
  const merchantStores = state.stores.filter((store) => store.merchantId === activeMerchant?.id);
  const activeStore =
    merchantStores.find((store) => store.id === state.activeStoreId) ??
    merchantStores.find((store) => store.isActive !== false) ??
    merchantStores[0] ??
    null;
  const activeCustomer =
    state.customers.find(
      (customer) =>
        customer.id === state.activeCustomerId &&
        customer.merchantId === activeMerchant?.id,
    ) ??
    state.customers.find((customer) => customer.merchantId === activeMerchant?.id) ??
    null;
  const currentStoreItems = state.serviceItems.filter(
    (item) =>
      item.merchantId === activeMerchant?.id &&
      item.storeId === activeStore?.id,
  );
  const currentOnlineItems =
    activeStore?.isActive === false
      ? []
      : currentStoreItems.filter((item) => item.isOnline);
  const currentStoreStaff = state.staff.filter(
    (staffer) =>
      staffer.merchantId === activeMerchant?.id &&
      staffer.storeId === activeStore?.id,
  );
  const currentStoreTechnicians = currentStoreStaff.filter(
    (staffer) => staffer.role === "technician" && staffer.isActive !== false,
  );
  const currentAccountStaff =
    state.staff.find(
      (staffer) =>
        staffer.id === activeAccount.staffId &&
        staffer.merchantId === activeMerchant?.id &&
        staffer.storeId === activeStore?.id,
    ) ?? null;
  const currentStoreCustomers = state.customers.filter(
    (customer) =>
      customer.merchantId === activeMerchant?.id &&
      (
        customer.homeStoreId === activeStore?.id ||
        state.orders.some(
          (order) =>
            order.customerId === customer.id &&
            order.merchantId === activeMerchant?.id &&
            order.storeId === activeStore?.id,
        )
      ),
  );
  const sessionKey = `${activeMerchant?.id ?? "none"}:${activeStore?.id ?? "none"}:${activeCustomer?.id ?? "none"}`;
  const activeSession = state.advisorSessions?.[sessionKey] ?? createAdvisorSession(activeStore);
  const technicians = useMemo(
    () => currentStoreTechnicians,
    [activeStore?.id, activeMerchant?.id, state.staff],
  );

  const helpers = useMemo(
    () => ({
      merchant: activeMerchant,
      store: activeStore,
      merchantStores,
      customer: activeCustomer,
      merchantCustomers: state.customers.filter((customer) => customer.merchantId === activeMerchant?.id),
      merchantItems: state.serviceItems.filter((item) => item.merchantId === activeMerchant?.id),
      merchantStaff: state.staff.filter((staffer) => staffer.merchantId === activeMerchant?.id),
      storeItems: currentStoreItems,
      onlineItems: currentOnlineItems,
      storeStaff: currentStoreStaff,
      visibleCustomers: activeAccount.role === "merchant" || activeAccount.role === "platform"
        ? state.customers.filter((customer) => customer.merchantId === activeMerchant?.id)
        : currentStoreCustomers,
      currentAccountStaff,
      technicians,
      getCustomer: (id) => state.customers.find((customer) => customer.id === id && customer.merchantId === activeMerchant?.id),
      getItem: (id) => state.serviceItems.find((item) => item.id === id && item.merchantId === activeMerchant?.id),
      getStaff: (id) => state.staff.find((staffer) => staffer.id === id && staffer.merchantId === activeMerchant?.id),
      currentMerchantOrders: () => state.orders.filter((order) => order.merchantId === activeMerchant?.id),
      currentStoreOrders: () =>
        state.orders.filter(
          (order) =>
            order.merchantId === activeMerchant?.id &&
            order.storeId === activeStore?.id,
        ),
    }),
    [
      activeMerchant,
      activeStore,
      activeCustomer,
      merchantStores,
      state.customers,
      state.serviceItems,
      state.staff,
      currentStoreItems,
      currentOnlineItems,
      currentStoreStaff,
      currentStoreCustomers,
      currentAccountStaff,
      activeAccount,
      state.customers,
      state.orders,
      state.serviceItems,
      state.staff,
      technicians,
    ],
  );

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 1800);
  }

  function patchState(updater) {
    setState((current) => {
      const draft = structuredClone(current);
      updater(draft);
      return draft;
    });
  }

  function openModal(modalName) {
    setState((current) => ({
      ...current,
      activeModal: modalName,
      editingItemId: modalName === "item" ? null : current.editingItemId,
      editingStoreId: modalName === "store" ? null : current.editingStoreId,
      editingStaffId: modalName === "staff" ? null : current.editingStaffId,
      editingCustomerId: modalName === "customer" ? null : current.editingCustomerId,
    }));
  }

  function closeModal() {
    setState((current) => ({
      ...current,
      activeModal: null,
      verifyOrderId: null,
      editingItemId: null,
      editingStoreId: null,
      editingStaffId: null,
      editingCustomerId: null,
    }));
  }

  function openItemEditor(itemId) {
    setState((current) => ({ ...current, activeModal: "item", editingItemId: itemId }));
  }

  function openStoreEditor(storeId) {
    setState((current) => ({ ...current, activeModal: "store", editingStoreId: storeId }));
  }

  function openStaffEditor(staffId) {
    setState((current) => ({ ...current, activeModal: "staff", editingStaffId: staffId }));
  }

  function openCustomerEditor(customerId) {
    setState((current) => ({ ...current, activeModal: "customer", editingCustomerId: customerId }));
  }

  function login(accountId, password) {
    const account = mockAccounts.find((item) => item.id === accountId);
    if (!account || account.password !== password) {
      notify("账号或密码错误，演示账号密码为 123456");
      return;
    }
    setState((current) => applyAccountContext(current, accountId));
    setIsLoggedIn(true);
    notify("登录成功");
  }

  function logout() {
    setIsLoggedIn(false);
    setToast("");
  }

  function setPage(page) {
    setState((current) => ({ ...current, activePage: page }));
  }

  function setCustomerContext({ merchantId, storeId, customerId }) {
    setState((current) => {
      const merchant = current.merchants.find((item) => item.id === Number(merchantId));
      if (!merchant) return current;
      const stores = current.stores.filter((store) => store.merchantId === merchant.id);
      const store = stores.find((item) => item.id === Number(storeId)) ?? stores.find((item) => item.isActive !== false) ?? stores[0];
      const customers = current.customers.filter((customer) => customer.merchantId === merchant.id);
      const customer = customers.find((item) => item.id === Number(customerId)) ?? customers[0];
      return {
        ...current,
        activeMerchantId: merchant.id,
        activeStoreId: store?.id ?? null,
        activeCustomerId: customer?.id ?? null,
        industry: merchant.industry,
      };
    });
  }

  function switchMerchant(merchantId) {
    if (activeAccount.role !== "platform") return;
    setState((current) => {
      const merchant = current.merchants.find((item) => item.id === Number(merchantId));
      if (!merchant) return current;
      const store = current.stores.find((item) => item.merchantId === merchant.id && item.isActive !== false)
        ?? current.stores.find((item) => item.merchantId === merchant.id);
      const customer = current.customers.find((item) => item.merchantId === merchant.id);
      return {
        ...current,
        activeMerchantId: merchant.id,
        activeStoreId: store?.id ?? null,
        activeCustomerId: customer?.id ?? null,
        industry: merchant.industry,
      };
    });
  }

  function resetData() {
    setState(applyAccountContext(initialState, activeAccount.id));
    notify("Mock 数据已重置");
  }

  function createOrder(draft, { merchantId, storeId, customerId, serviceItemId, technicianId, appointmentStartAt, remark, source }) {
    const item = draft.serviceItems.find((serviceItem) => serviceItem.id === serviceItemId);
    const store = draft.stores.find((candidate) => candidate.id === storeId && candidate.merchantId === merchantId);
    if (!item || !store || item.merchantId !== merchantId || item.storeId !== storeId || !item.isOnline || store.isActive === false) {
      return false;
    }
    const order = {
      id: nextId(draft.orders),
      merchantId,
      storeId,
      customerId,
      serviceItemId,
      technicianId,
      appointmentStartAt,
      appointmentEndAt: addMinutes(appointmentStartAt, item.durationMinutes),
      status: "pending",
      paymentStatus: "unpaid",
      source,
      paymentMethod: "offline",
      totalAmount: item.price,
      paidAmount: 0,
      discountAmount: 0,
      remark,
    };
    draft.orders.push(order);
    draft.operationLogs.push({
      id: nextId(draft.operationLogs),
      orderId: order.id,
      action: "create",
      operatorStaffId: 1,
      createdAt: new Date().toISOString(),
    });
    return true;
  }

  function findOrCreateCustomer(draft, name, phone, merchantId, storeId) {
    const existing = draft.customers.find((customer) => customer.phone === phone && customer.merchantId === merchantId);
    if (existing) return existing;
    const customer = {
      id: nextId(draft.customers),
      merchantId,
      homeStoreId: storeId,
      name,
      phone,
      gender: "unknown",
      totalSpent: 0,
    };
    draft.customers.push(customer);
    return customer;
  }

  function handleCreateMerchant(formData) {
    patchState((draft) => {
      const merchantId = nextId(draft.merchants);
      const storeId = nextId(draft.stores);
      draft.merchants.push({
        id: merchantId,
        name: formData.get("name"),
        contactName: formData.get("contactName"),
        contactPhone: formData.get("contactPhone"),
        packageEnd: formData.get("packageEnd"),
        status: "trial",
        industry: formData.get("industry") || "beauty",
      });
      draft.stores.push({
        id: storeId,
        merchantId,
        name: `${formData.get("name")}首店`,
        address: "请补充门店地址",
        phone: formData.get("contactPhone"),
        businessHours: "09:00-21:00",
        isActive: true,
      });
      draft.activeMerchantId = merchantId;
      draft.activeStoreId = storeId;
      draft.activeCustomerId = null;
      draft.activeModal = null;
    });
    notify("商户已创建");
  }

  function handleSaveItem(formData) {
    patchState((draft) => {
      const itemId = Number(formData.get("itemId"));
      const itemData = {
        name: formData.get("name"),
        price: Number(formData.get("price")) * 100,
        durationMinutes: Number(formData.get("duration")),
        isOnline: formData.get("isOnline") === "true",
        tags: formData.getAll("tags"),
      };

      if (itemId) {
        const item = draft.serviceItems.find((serviceItem) => serviceItem.id === itemId);
        Object.assign(item, itemData);
      } else {
        draft.serviceItems.push({
          id: nextId(draft.serviceItems),
          merchantId: activeMerchant.id,
          storeId: activeStore.id,
          ...itemData,
        });
      }
      draft.activeModal = null;
      draft.editingItemId = null;
    });
    notify(formData.get("itemId") ? "服务项目已更新" : "服务项目已创建");
  }

  function toggleItemOnline(itemId) {
    let nextStatus = false;
    patchState((draft) => {
      const item = draft.serviceItems.find(
        (serviceItem) =>
          serviceItem.id === itemId &&
          serviceItem.merchantId === activeMerchant.id &&
          serviceItem.storeId === activeStore.id,
      );
      if (!item) return;
      item.isOnline = !item.isOnline;
      nextStatus = item.isOnline;
    });
    notify(nextStatus ? "服务项目已上架" : "服务项目已下架");
  }

  function handleSaveStore(formData) {
    patchState((draft) => {
      const storeId = Number(formData.get("storeId"));
      const storeData = {
        name: formData.get("name"),
        address: formData.get("address"),
        phone: formData.get("phone"),
        businessHours: `${formData.get("openAt")}-${formData.get("closeAt")}`,
        isActive: formData.get("isActive") === "true",
      };
      if (storeId) {
        const store = draft.stores.find((candidate) => candidate.id === storeId && candidate.merchantId === activeMerchant.id);
        if (store) Object.assign(store, storeData);
      } else {
        draft.stores.push({ id: nextId(draft.stores), merchantId: activeMerchant.id, ...storeData });
      }
      draft.activeModal = null;
      draft.editingStoreId = null;
    });
    notify(formData.get("storeId") ? "门店资料已更新" : "门店已创建");
  }

  function handleSaveStaff(formData) {
    patchState((draft) => {
      const staffId = Number(formData.get("staffId"));
      const staffData = {
        storeId: Number(formData.get("storeId")),
        name: formData.get("name"),
        phone: formData.get("phone"),
        role: formData.get("role"),
        isActive: formData.get("isActive") === "true",
      };
      if (staffId) {
        const staffer = draft.staff.find((candidate) => candidate.id === staffId && candidate.merchantId === activeMerchant.id);
        if (staffer) Object.assign(staffer, staffData);
      } else {
        draft.staff.push({ id: nextId(draft.staff), merchantId: activeMerchant.id, ...staffData });
      }
      draft.activeModal = null;
      draft.editingStaffId = null;
    });
    notify(formData.get("staffId") ? "员工资料已更新" : "员工账号已创建");
  }

  function handleSaveCustomer(formData) {
    patchState((draft) => {
      const customer = draft.customers.find((item) => item.id === Number(formData.get("customerId")));
      Object.assign(customer, {
        name: formData.get("name"),
        phone: formData.get("phone"),
        gender: formData.get("gender"),
        homeStoreId: Number(formData.get("homeStoreId")),
        remark: formData.get("remark"),
      });
      draft.activeModal = null;
      draft.editingCustomerId = null;
    });
    notify("会员资料已更新");
  }

  function handleCreateStaffOrder(formData) {
    let created = false;
    patchState((draft) => {
      const customer = findOrCreateCustomer(
        draft,
        formData.get("customerName"),
        formData.get("phone"),
        activeMerchant.id,
        activeStore.id,
      );
      created = createOrder(draft, {
        merchantId: activeMerchant.id,
        storeId: activeStore.id,
        customerId: customer.id,
        serviceItemId: Number(formData.get("serviceItemId")),
        technicianId: Number(formData.get("technicianId")),
        appointmentStartAt: `${formData.get("date")} ${formData.get("time")}:00`,
        remark: formData.get("remark"),
        source: "admin_manual",
      });
      if (!created) return;
      draft.activeModal = null;
      draft.currentView = "receptionist";
      draft.activePage = "appointments";
    });
    notify(created ? "预约已创建" : "当前门店暂无可预约项目，请先上架项目");
  }

  function handleVerifyOrder(formData) {
    patchState((draft) => {
      const order = draft.orders.find((item) => item.id === Number(formData.get("orderId")));
      if (!order || order.status !== "pending") return;
      const paidAmount = Math.round(Number(formData.get("paidAmount")) * 100);
      order.status = "completed";
      order.paymentStatus = "paid";
      order.paidAmount = paidAmount;
      order.discountAmount = Math.round(Number(formData.get("discountAmount") || 0) * 100);
      order.paymentMethod = formData.get("paymentMethod");
      order.verifiedAt = "2026-08-14 16:30:00";
      order.verifiedBy = 1;
      const customer = draft.customers.find((item) => item.id === order.customerId);
      customer.totalSpent += paidAmount;
      draft.operationLogs.push({
        id: nextId(draft.operationLogs),
        orderId: order.id,
        action: "verify",
        operatorStaffId: 1,
        createdAt: new Date().toISOString(),
      });
      draft.activeModal = null;
      draft.verifyOrderId = null;
    });
    notify("订单已核销");
  }

  function startVerify(orderId) {
    setState((current) => ({ ...current, activeModal: "verify", verifyOrderId: orderId }));
  }

  function cancelOrder(orderId) {
    patchState((draft) => {
      const order = draft.orders.find((item) => item.id === orderId);
      order.status = "cancelled";
      order.cancelledReason = "门店员工手动取消";
    });
    notify("预约已取消");
  }

  function miniBook(serviceItemId) {
    if (!activeStore || activeStore.isActive === false || !activeCustomer) {
      notify("请先选择营业中的门店和顾客");
      return;
    }
    if (!currentOnlineItems.some((item) => item.id === serviceItemId)) {
      notify("这个项目不属于当前门店或已暂停售卖");
      return;
    }
    let created = false;
    patchState((draft) => {
      created = createOrder(draft, {
        merchantId: activeMerchant.id,
        storeId: activeStore.id,
        customerId: activeCustomer.id,
        serviceItemId,
        technicianId: currentStoreTechnicians[0]?.id ?? null,
        appointmentStartAt: "2026-08-14 17:00:00",
        remark: "小程序顾客自助预约",
        source: "mini_program",
      });
    });
    notify(created ? "小程序预约成功" : "当前项目暂不可预约，请转人工确认");
  }

  function sendAdvisorMessage(message) {
    const cleanMessage = message.trim();
    if (!cleanMessage) return;
    patchState((draft) => {
      const session = draft.advisorSessions[sessionKey] ?? createAdvisorSession(activeStore);
      session.messages.push({ id: nextId(session.messages), role: "user", text: cleanMessage });
      const reply = !activeStore
        ? {
            text: "当前商户还没有可用门店。请先选择或创建门店，再让我为你推荐可预约项目；如果你需要确认营业安排，也可以联系平台或商户工作人员。",
            recommendationIds: [],
            noStore: true,
          }
        : buildAdvisorReply(
            cleanMessage,
            draft.serviceItems.filter(
              (item) =>
                item.merchantId === activeMerchant.id &&
                item.storeId === activeStore.id &&
                item.isOnline === true &&
                activeStore.isActive !== false,
            ),
          );
      session.messages.push({ id: nextId(session.messages), role: "assistant", ...reply });
      draft.advisorSessions[sessionKey] = session;
    });
  }

  function requestHumanSupport() {
    patchState((draft) => {
      const session = draft.advisorSessions[sessionKey] ?? createAdvisorSession(activeStore);
      if (session.humanSupport.status === "connected") return;
      session.humanSupport = {
        status: "connected",
        requestedAt: new Date().toISOString(),
      };
      session.messages.push({
        id: nextId(session.messages),
        role: "assistant",
        text: `已为你转接${activeStore?.name || "当前门店"}人工客服。客服会先看到你刚才描述的问题和 AI 推荐记录，预计 1 分钟内回复；如果情况比较急，也可以直接拨打门店电话 ${activeStore?.phone || "门店公开电话"}。`,
        handoff: true,
      });
      draft.advisorSessions[sessionKey] = session;
    });
    notify("已为你转接门店人工客服");
  }

  const suggestedDemoHost = ["127.0.0.1", "localhost"].includes(window.location.hostname)
    ? "192.168.0.230"
    : window.location.hostname;
  const suggestedDemoOrigin = `${window.location.protocol}//${suggestedDemoHost}${window.location.port ? `:${window.location.port}` : ""}`;
  const suggestedCustomerDemoUrl = `${suggestedDemoOrigin}/customer?merchant=${activeMerchant?.id ?? ""}&store=${activeStore?.id ?? ""}&customer=${activeCustomer?.id ?? ""}`;
  const customerDemoUrl = customerDemoUrlOverride || suggestedCustomerDemoUrl;

  async function copyCustomerDemoUrl() {
    try {
      await navigator.clipboard.writeText(customerDemoUrl);
      notify("顾客端链接已复制");
    } catch {
      notify("请长按或选中链接复制");
    }
  }

  if (isStandaloneCustomer) {
    return (
      <>
        <main className="standalone-customer-shell">
          <CustomerView
            state={state}
            helpers={helpers}
            miniBook={miniBook}
            page={state.activePage}
            setPage={setPage}
            sendAdvisorMessage={sendAdvisorMessage}
            requestHumanSupport={requestHumanSupport}
            activeSession={activeSession}
            standalone
          />
        </main>
        <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>
      </>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
        <LoginView accounts={mockAccounts} onLogin={login} />
        <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>
      </>
    );
  }

  const profile = roleProfiles[state.currentView];
  const meta = pageMeta[state.currentView][state.activePage] ?? pageMeta[state.currentView][profile.nav[0].id];
  const sidebarEntity =
    state.currentView === "platform"
      ? { name: "平台控制台", note: "全局运营管理", mark: "台" }
      : state.currentView === "merchant"
        ? { name: activeMerchant.name, note: "商户管理中心", mark: "店" }
      : state.currentView === "customer"
          ? { name: activeStore?.name || activeMerchant.name, note: "顾客服务入口", mark: "客" }
          : { name: activeStore?.name || activeMerchant.name, note: activeAccount.subtitle, mark: "店" };

  return (
    <>
      <div className={`app-shell ${state.currentView === "customer" ? "customer-shell" : ""}`}>
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-mark">服</div>
            <div>
              <h1>到店服务 SaaS</h1>
              <p>多行业经营平台</p>
            </div>
          </div>

          <div className="sidebar-account">
            <span className="sidebar-account-mark">{sidebarEntity.mark}</span>
            <div>
              <strong>{sidebarEntity.name}</strong>
              <small>{sidebarEntity.note}</small>
            </div>
            <span className="account-chevron">⌄</span>
          </div>

          <span className="nav-section-label">{state.currentView === "platform" ? "平台管理" : state.currentView === "customer" ? "顾客服务" : "经营管理"}</span>
          <nav className="persona-nav" aria-label={`${profile.label}导航`}>
            {profile.nav.map((item) => (
              <NavButton key={item.id} active={state.activePage === item.id} page={item.id} onClick={setPage} icon={item.icon}>
                {item.label}
              </NavButton>
            ))}
          </nav>

          <div className="sidebar-utilities">
            <button onClick={() => notify("帮助中心正在准备中")}><span>?</span>帮助中心</button>
            <button onClick={() => notify("已为你联系平台客服")}><span>◌</span>平台客服</button>
            <button onClick={() => notify("系统设置将在下一版开放")}><span>⚙</span>系统设置</button>
          </div>

          <div className="sidebar-footer">
            <span className="footer-avatar">{activeAccount.title.slice(0, 1)}</span>
            <div><strong>{activeAccount.title}</strong><small>{activeAccount.subtitle}</small></div>
          </div>
        </aside>

        <main className="workspace">
          <header className="topbar">
            <div>
              <p className="eyebrow">{meta.eyebrow}</p>
              <h2 id="viewTitle">{meta.title}</h2>
            </div>
            <div className="topbar-actions">
              {state.currentView === "platform" && (
                <label className="context-switch">
                  <span>查看商户</span>
                  <select
                    aria-label="平台查看商户"
                    value={activeMerchant?.id ?? ""}
                    onChange={(event) => switchMerchant(event.target.value)}
                  >
                    {state.merchants.map((merchant) => (
                      <option value={merchant.id} key={merchant.id}>{merchant.name}</option>
                    ))}
                  </select>
                </label>
              )}
              {state.currentView === "merchant" && (
                <label className="context-switch">
                  <span>当前门店</span>
                  <select
                    aria-label="切换当前门店"
                    value={activeStore?.id ?? ""}
                    onChange={(event) => setCustomerContext({ merchantId: activeMerchant.id, storeId: event.target.value, customerId: activeCustomer?.id })}
                    disabled={!merchantStores.length}
                  >
                    {!merchantStores.length && <option value="">暂无门店</option>}
                    {merchantStores.map((store) => (
                      <option value={store.id} key={store.id}>{store.name}</option>
                    ))}
                  </select>
                </label>
              )}
              <div className="account-chip">
                <span>{roleProfiles[state.currentView].label}</span>
                <strong>{activeAccount.title}</strong>
              </div>
              <button className="ghost-button" onClick={logout}>退出登录</button>
              <button className="ghost-button" onClick={resetData}>
                重置 Mock
              </button>
              {meta.modal && (
                <button className="primary-button" onClick={() => openModal(meta.modal)}>
                  {meta.action}
                </button>
              )}
            </div>
          </header>

          {state.currentView === "platform" && <PlatformView state={state} helpers={helpers} openModal={openModal} page={state.activePage} />}
          {state.currentView === "merchant" && (
            <MerchantView
              state={state}
              helpers={helpers}
              openModal={openModal}
              openItemEditor={openItemEditor}
              openStoreEditor={openStoreEditor}
              openStaffEditor={openStaffEditor}
              openCustomerEditor={openCustomerEditor}
              toggleItemOnline={toggleItemOnline}
              openCustomerDemo={() => {
                setCustomerDemoUrlOverride("");
                setShowCustomerDemo(true);
              }}
              page={state.activePage}
            />
          )}
          {state.currentView === "receptionist" && (
            <StaffView
              state={state}
              helpers={helpers}
              openModal={openModal}
              setState={setState}
              startVerify={startVerify}
              cancelOrder={cancelOrder}
              page={state.activePage}
            />
          )}
          {state.currentView === "technician" && <TechnicianView state={state} helpers={helpers} page={state.activePage} />}
          {state.currentView === "customer" && (
            <CustomerView
              state={state}
              helpers={helpers}
              miniBook={miniBook}
              page={state.activePage}
              setPage={setPage}
              sendAdvisorMessage={sendAdvisorMessage}
              requestHumanSupport={requestHumanSupport}
              setCustomerContext={setCustomerContext}
              activeSession={activeSession}
            />
          )}
        </main>
      </div>

      <MerchantModal active={state.activeModal === "merchant"} onClose={closeModal} onSubmit={handleCreateMerchant} />
      <StoreModal
        active={state.activeModal === "store"}
        onClose={closeModal}
        onSubmit={handleSaveStore}
        store={state.stores.find((store) => store.id === state.editingStoreId && store.merchantId === activeMerchant.id)}
      />
      <StaffModal
        active={state.activeModal === "staff"}
        onClose={closeModal}
        onSubmit={handleSaveStaff}
        stores={merchantStores}
        staffer={state.staff.find((staffer) => staffer.id === state.editingStaffId && staffer.merchantId === activeMerchant.id)}
      />
      <CustomerModal
        active={state.activeModal === "customer"}
        onClose={closeModal}
        onSubmit={handleSaveCustomer}
        stores={merchantStores}
        customer={state.customers.find((customer) => customer.id === state.editingCustomerId && customer.merchantId === activeMerchant.id)}
      />
      <ItemModal
        active={state.activeModal === "item"}
        onClose={closeModal}
        onSubmit={handleSaveItem}
        industry={state.industry}
        item={state.serviceItems.find((serviceItem) => serviceItem.id === state.editingItemId && serviceItem.merchantId === activeMerchant.id)}
      />
      <OrderModal
        active={state.activeModal === "order"}
        onClose={closeModal}
        onSubmit={handleCreateStaffOrder}
        items={currentStoreItems.filter((item) => item.isOnline)}
        technicians={technicians}
      />
      <VerifyModal
        active={state.activeModal === "verify"}
        onClose={closeModal}
        onSubmit={handleVerifyOrder}
        order={state.orders.find((order) => order.id === state.verifyOrderId)}
        helpers={helpers}
      />
      <CustomerDemoModal
        active={showCustomerDemo}
        onClose={() => setShowCustomerDemo(false)}
        url={customerDemoUrl}
        onUrlChange={setCustomerDemoUrlOverride}
        onCopy={copyCustomerDemoUrl}
        storeName={activeStore?.name}
      />

      <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>
      {state.currentView === "merchant" && state.activePage === "dashboard" && <SupportDock notify={notify} />}
    </>
  );
}

function SupportDock({ notify }) {
  return (
    <aside className="support-dock" aria-label="咨询服务">
      <img
        src="/images/support-consultant.jpg"
        alt="客户顾问头像"
      />
      <span className="support-online">在线</span>
      <div className="support-actions">
        <button title="微信咨询" onClick={() => notify("微信咨询二维码已发送给当前账号")}><span>◉</span>微信咨询</button>
        <button title="电话咨询" onClick={() => notify("客服热线：400-800-2026")}><span>☎</span>电话咨询</button>
      </div>
    </aside>
  );
}

function LoginView({ accounts, onLogin }) {
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[1]?.id || accounts[0]?.id);
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId) ?? accounts[0];

  return (
    <main className="login-shell">
      <section className="login-panel">
        <div className="login-copy">
          <span className="brand-mark">服</span>
          <p className="eyebrow">Mock 登录入口</p>
          <h1>用账号进入对应工作台</h1>
          <p>不同账号绑定不同角色和商户/门店归属。登录后不再在后台切换身份，避免商户账号看到平台或其他商户内容。</p>
        </div>

        <div className="login-card">
          <div className="panel-header">
            <div>
              <h3>选择演示账号</h3>
              <p>密码统一为 123456，仅用于原型演示。</p>
            </div>
          </div>
          <div className="account-grid" role="list">
            {accounts.map((account) => (
              <button
                type="button"
                className={`account-card ${selectedAccountId === account.id ? "active" : ""}`}
                key={account.id}
                onClick={() => setSelectedAccountId(account.id)}
              >
                <span>{roleProfiles[account.role].label}</span>
                <strong>{account.title}</strong>
                <small>{account.subtitle}</small>
              </button>
            ))}
          </div>
          <form className="login-form" onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            onLogin(selectedAccount.id, formData.get("password"));
          }}>
            <label>
              登录账号
              <input value={selectedAccount.id} readOnly aria-label="登录账号" />
            </label>
            <label>
              密码
              <input name="password" type="password" defaultValue={selectedAccount.password} aria-label="密码" />
            </label>
            <button className="primary-button" type="submit">
              进入{roleProfiles[selectedAccount.role].label}工作台
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

function NavButton({ active, page, icon, onClick, children }) {
  return (
    <button className={`persona-button ${active ? "active" : ""}`} data-page={page} onClick={() => onClick(page)}>
      <span className="nav-icon">{icon}</span>
      {children}
    </button>
  );
}

function MetricCard({ label, value, note }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}

function EmptyState({ icon = "○", title, description, actionLabel, onAction }) {
  return (
    <div className="empty-state empty-state-guided">
      <span className="empty-state-icon" aria-hidden="true">{icon}</span>
      <strong>{title}</strong>
      {description && <p>{description}</p>}
      {actionLabel && <button className="secondary-button" onClick={onAction}>{actionLabel}</button>}
    </div>
  );
}

function PlatformView({ state, helpers, openModal, page }) {
  if (page === "billing") return <PlatformBillingView state={state} />;
  if (page === "industry_templates") return <IndustryTemplateView />;
  if (page === "logs") return <PlatformLogsView state={state} />;
  if (page === "merchants") return <PlatformMerchantsView state={state} openModal={openModal} />;

  const orders = helpers.currentMerchantOrders();
  const completedRevenue = orders.filter((order) => order.status === "completed").reduce((sum, order) => sum + order.paidAmount, 0);
  const activeMerchantCount = state.merchants.filter((merchant) => ["active", "trial"].includes(merchant.status)).length;
  const pendingOrderCount = state.orders.filter((order) => order.status === "pending").length;

  return (
    <section className="view active">
      <section className="insight-band">
        <div>
          <p className="eyebrow">平台概览</p>
          <h3>从入驻商户到服务核销，平台能看到完整经营链路</h3>
        </div>
        <div className="sparkline" aria-hidden="true">
          {[34, 56, 42, 72, 64, 86, 76].map((height) => (
            <span key={height} style={{ height: `${height}%` }} />
          ))}
        </div>
      </section>

      <div className="metric-grid">
        <MetricCard label="平台 GMV" value={yuan(completedRevenue)} note="来自已核销服务订单" />
        <MetricCard label="活跃商户" value={activeMerchantCount} note="试用和正式商户" />
        <MetricCard label="待服务订单" value={pendingOrderCount} note="全平台今日及未来预约" />
        <MetricCard label="本月平台收入" value="¥12,800" note="套餐手动开通" />
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>商户管理</h3>
            <p>平台方创建商户、开通套餐、查看商户状态。</p>
          </div>
          <button className="secondary-button" onClick={() => openModal("merchant")}>
            新增商户
          </button>
        </div>
        {state.merchants.length ? <div className="table-wrap">
          <table className="responsive-table platform-overview-table">
            <thead>
              <tr>
                <th>商户</th>
                <th>联系人</th>
                <th>门店数</th>
                <th>套餐到期</th>
                <th>状态</th>
                <th>GMV</th>
              </tr>
            </thead>
            <tbody>
              {state.merchants.map((merchant) => {
                const merchantOrders = state.orders.filter((order) => order.merchantId === merchant.id);
                const gmv = merchantOrders.filter((order) => order.status === "completed").reduce((sum, order) => sum + order.paidAmount, 0);
                const storeCount = state.stores.filter((store) => store.merchantId === merchant.id).length;
                const tagClass = merchant.status === "active" ? "green" : merchant.status === "trial" ? "gold" : "red";
                return (
                  <tr key={merchant.id}>
                    <td data-label="商户">
                      <strong>{merchant.name}</strong>
                      <br />
                      <span className="muted">{merchant.contactPhone}</span>
                    </td>
                    <td data-label="联系人">{merchant.contactName}</td>
                    <td data-label="门店数">{storeCount}</td>
                    <td data-label="套餐到期">{merchant.packageEnd}</td>
                    <td data-label="状态">
                      <span className={`tag ${tagClass}`}>{statusText[merchant.status]}</span>
                    </td>
                    <td data-label="GMV">{yuan(gmv)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div> : <EmptyState icon="◇" title="还没有商户数据" description="创建商户后，平台 GMV、套餐和订单数据会在这里汇总。" actionLabel="创建第一个商户" onAction={() => openModal("merchant")} />}
      </section>
    </section>
  );
}

function PlatformMerchantsView({ state, openModal }) {
  return (
    <section className="view active panel">
      <div className="panel-header">
        <div>
          <h3>全部商户</h3>
          <p>平台账号可跨租户管理入驻、试用和套餐状态。</p>
        </div>
        <button className="secondary-button" onClick={() => openModal("merchant")}>新增商户</button>
      </div>
      {!state.merchants.length ? (
          <EmptyState icon="◇" title="还没有入驻商户" description="先创建一个商户，配置套餐后即可开始经营。" actionLabel="创建第一个商户" onAction={() => openModal("merchant")} />
      ) : (
        <div className="table-wrap">
          <table className="responsive-table merchant-tenant-table">
            <thead><tr><th>商户</th><th>联系人</th><th>套餐到期</th><th>状态</th><th>平台操作</th></tr></thead>
            <tbody>
              {state.merchants.map((merchant) => (
                <tr key={merchant.id}>
                  <td data-label="商户"><strong>{merchant.name}</strong><br /><span className="muted">{merchant.contactPhone}</span></td>
                  <td data-label="联系人">{merchant.contactName}</td>
                  <td data-label="套餐到期">{merchant.packageEnd}</td>
                  <td data-label="状态"><span className={`tag ${merchant.status === "active" ? "green" : "gold"}`}>{statusText[merchant.status]}</span></td>
                  <td data-label="平台操作"><button className="text-button">管理套餐</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function PlatformBillingView({ state }) {
  return (
    <section className="view active">
      <div className="metric-grid">
        <MetricCard label="本月套餐收入" value="¥12,800" note="手动开通套餐" />
        <MetricCard label="正式商户" value={state.merchants.filter((item) => item.status === "active").length} note="套餐有效期内" />
        <MetricCard label="试用商户" value={state.merchants.filter((item) => item.status === "trial").length} note="等待转正式" />
        <MetricCard label="30 天内到期" value="1" note="需跟进续费" />
      </div>
      <section className="panel">
        <div className="panel-header"><div><h3>套餐方案</h3><p>MVP 阶段由平台人员手动开通和续期。</p></div></div>
        <div className="plan-grid">
          <article className="plan-card"><span>基础版</span><strong>¥3,800 / 年</strong><p>单门店、预约、核销和基础报表</p></article>
          <article className="plan-card featured"><span>专业版</span><strong>¥6,800 / 年</strong><p>多门店、会员共享和完整经营报表</p></article>
        </div>
      </section>
    </section>
  );
}

function IndustryTemplateView() {
  return (
    <section className="view active">
      <div className="template-grid">
        {Object.entries(industryTemplates).map(([id, template]) => (
          <article className="panel industry-card" key={id}>
            <div className="industry-card-header"><span className="entity-icon">{template.name.slice(0, 1)}</span><div><h3>{template.name}</h3><p>{template.tags.length} 个平台预置标签</p></div><span className="tag green">已启用</span></div>
            <div className="tag-cloud">{template.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <div className="template-rule"><strong>顾客诉求识别</strong><p>自然语言 → 诉求标签 → 风险校验 → 商户项目排序</p></div>
            <button className="ghost-button">查看推荐规则</button>
          </article>
        ))}
      </div>
      <aside className="template-note"><strong>平台负责模板，商户只需维护项目</strong><span>运营人员维护可理解的行业标签和风险提示，不要求商户搭建知识库或编写 AI 话术。</span></aside>
    </section>
  );
}

function PlatformLogsView({ state }) {
  const actions = { create: "创建预约", reschedule: "预约改期", cancel: "取消预约", verify: "订单核销" };
  return (
    <section className="view active panel">
      <div className="panel-header"><div><h3>关键操作日志</h3><p>平台侧追踪跨商户的关键业务动作。</p></div></div>
      <div className="activity-list">
        {state.operationLogs.map((log) => (
          <article className="activity-row" key={log.id}>
            <span className="activity-icon">✓</span>
            <div><strong>{actions[log.action] || log.action}</strong><p>订单 #{String(log.orderId).padStart(4, "0")} · 操作员工 #{log.operatorStaffId}</p></div>
            <time>{String(log.createdAt).slice(0, 16).replace("T", " ")}</time>
          </article>
        ))}
      </div>
    </section>
  );
}

function MerchantView({
  state,
  helpers,
  openModal,
  openItemEditor,
  openStoreEditor,
  openStaffEditor,
  openCustomerEditor,
  toggleItemOnline,
  openCustomerDemo,
  page,
}) {
  if (page !== "dashboard") {
    return (
      <MerchantModuleView
        state={state}
        helpers={helpers}
        openModal={openModal}
        openItemEditor={openItemEditor}
        openStoreEditor={openStoreEditor}
        openStaffEditor={openStaffEditor}
        openCustomerEditor={openCustomerEditor}
        toggleItemOnline={toggleItemOnline}
        page={page}
      />
    );
  }
  const orders = helpers.currentMerchantOrders();
  const todayRevenue = orders
    .filter((order) => order.status === "completed" && order.appointmentStartAt.startsWith(today))
    .reduce((sum, order) => sum + order.paidAmount, 0);

  return (
    <section className="view active">
      <section className="merchant-hero">
        <div className="merchant-hero-copy">
          <span className="hero-status">今日营业中</span>
          <p className="eyebrow">商家工作台</p>
          <h3>{helpers.store?.name || "当前门店"}今日运营</h3>
          <p>项目、员工、会员和订单都在同一个后台维护。</p>
          <div className="hero-quick-actions">
            <button onClick={() => openModal("item")}>新增服务项目</button>
            <button className="customer-demo-button" onClick={openCustomerDemo}>体验微信小程序</button>
            <span>营业时间 09:00-21:00</span>
          </div>
        </div>
        <div className="merchant-hero-media">
          <img src="/images/beauty-service.jpg" alt="美容护理服务场景" />
          <div className="hero-media-caption"><strong>今日服务 2 单</strong><span>顾客满意度 4.9</span></div>
        </div>
      </section>

      <div className="metric-grid">
        <MetricCard label="今日实收" value={yuan(todayRevenue)} note="已核销订单" />
        <MetricCard label="待核销" value={orders.filter((order) => order.status === "pending").length} note="预约待到店" />
        <MetricCard label="上线项目" value={helpers.merchantItems.filter((item) => item.isOnline).length} note="小程序可预约" />
        <MetricCard label="会员数" value={helpers.merchantCustomers.length} note="商户级会员池" />
      </div>

      <div className="split-layout">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>项目管理</h3>
              <p>商家总部维护服务项目，顾客端直接展示。</p>
            </div>
            <button className="secondary-button" onClick={() => openModal("item")}>
              新增项目
            </button>
          </div>
          <div className="item-list">
            {helpers.merchantItems.map((item) => (
              <article className="service-item" key={item.id}>
                <div className="item-thumb" aria-hidden="true" />
                <div>
                  <h4>{item.name}</h4>
                  <span className="muted">
                    {item.durationMinutes} 分钟 · {item.isOnline ? "小程序可预约" : "已下架"}
                  </span>
                </div>
                <strong className="price">{yuan(item.price)}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>门店与员工</h3>
              <p>首版员工归属单门店，用角色区分菜单。</p>
            </div>
          </div>
          <div className="store-card">
            <h4>{helpers.store.name}</h4>
            <p className="muted">{helpers.store.address}</p>
            <p className="muted">
              {helpers.store.phone} · {helpers.store.businessHours}
            </p>
          </div>
          <div className="staff-list">
            {helpers.merchantStaff.filter((staffer) => staffer.storeId === helpers.store?.id).map((staffer) => (
              <article className="staff-row" key={staffer.id}>
                <div>
                  <h4>{staffer.name}</h4>
                  <span className="muted">{staffer.phone}</span>
                </div>
                <span className="tag">{roleText[staffer.role]}</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

function MerchantModuleView({
  state,
  helpers,
  openModal,
  openItemEditor,
  openStoreEditor,
  openStaffEditor,
  openCustomerEditor,
  toggleItemOnline,
  page,
}) {
  if (page === "stores") {
    return (
      <section className="view active panel">
        <div className="panel-header"><div><h3>门店列表</h3><p>每个门店独立维护地址、电话与营业时间。</p></div><button className="secondary-button" onClick={() => openModal("store")}>新增门店</button></div>
        {helpers.merchantStores.length ? <div className="entity-grid">
          {helpers.merchantStores.map((store) => <article className="entity-card" key={store.id}><span className="entity-icon">店</span><div><h4>{store.name}</h4><p>{store.address}</p><small>{store.phone} · {store.businessHours}</small></div><div className="entity-actions"><span className={`tag ${store.isActive !== false ? "green" : ""}`}>{store.isActive !== false ? "营业中" : "已停业"}</span><button className="icon-action" title="编辑门店" aria-label={`编辑${store.name}`} onClick={() => openStoreEditor(store.id)}>✎</button></div></article>)}
        </div> : <EmptyState icon="⌂" title="还没有门店" description="先添加门店地址和营业时间，顾客端才能展示和预约。" actionLabel="添加第一家门店" onAction={() => openModal("store")} />}
      </section>
    );
  }

  if (page === "staff") {
    return (
      <section className="view active panel">
        <div className="panel-header"><div><h3>员工账号</h3><p>岗位决定可见菜单，员工数据限制在所属门店。</p></div><button className="secondary-button" onClick={() => openModal("staff")}>新增员工</button></div>
        {helpers.merchantStaff.length ? (
          <div className="table-wrap">
            <table className="responsive-table staff-table">
              <thead><tr><th>员工</th><th>所属门店</th><th>岗位</th><th>手机号</th><th>状态</th><th>操作</th></tr></thead>
              <tbody>
                {helpers.merchantStaff.map((staffer) => (
                  <tr key={staffer.id}>
                    <td data-label="员工"><strong>{staffer.name}</strong></td>
                    <td data-label="所属门店">{state.stores.find((store) => store.id === staffer.storeId)?.name}</td>
                    <td data-label="岗位">{roleText[staffer.role]}</td>
                    <td data-label="手机号">{staffer.phone}</td>
                    <td data-label="状态"><span className={`tag ${staffer.isActive !== false ? "green" : ""}`}>{staffer.isActive !== false ? "启用" : "停用"}</span></td>
                    <td data-label="操作"><button className="text-button" onClick={() => openStaffEditor(staffer.id)}>编辑</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <EmptyState icon="♧" title="还没有员工账号" description="添加店长、前台或技师后，才能安排预约和核销。" actionLabel="添加第一个员工" onAction={() => openModal("staff")} />}
      </section>
    );
  }

  if (page === "items") {
    return (
      <section className="view active panel">
        <div className="panel-header"><div><h3>服务项目</h3><p>控制小程序展示内容、价格和服务时长。</p></div><button className="secondary-button" onClick={() => openModal("item")}>新增项目</button></div>
        <aside className="industry-applied"><span>已应用行业模板</span><strong>{industryTemplates[state.industry].name}</strong><small>新增项目时只需勾选平台预置标签</small></aside>
        {helpers.merchantItems.length ? <div className="catalog-grid">
          {helpers.merchantItems.map((item) => (
            <article className={`catalog-card ${item.isOnline ? "" : "offline"}`} key={item.id}>
              <div className="catalog-image" />
              <div>
                <div className="catalog-status-row">
                  <span className={`tag ${item.isOnline ? "green" : ""}`}>{item.isOnline ? "已上架" : "已下架"}</span>
                  <button className="icon-action" title="编辑项目" aria-label={`编辑${item.name}`} onClick={() => openItemEditor(item.id)}>✎</button>
                </div>
                <h4>{item.name}</h4>
                <p>{item.durationMinutes} 分钟 · {helpers.store.name}</p>
                <div className="item-tags">{(item.tags || []).map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="catalog-footer">
                  <strong>{yuan(item.price)}</strong>
                  <button className="text-button" onClick={() => toggleItemOnline(item.id)}>{item.isOnline ? "下架" : "重新上架"}</button>
                </div>
              </div>
            </article>
          ))}
        </div> : <EmptyState icon="✦" title="还没有服务项目" description="先上架一个服务项目，顾客端才有内容可以浏览和预约。" actionLabel="创建第一个项目" onAction={() => openModal("item")} />}
      </section>
    );
  }

  if (page === "customers") return <CustomerDirectoryView state={state} helpers={helpers} onEdit={openCustomerEditor} />;

  const completed = helpers.currentMerchantOrders().filter((order) => order.status === "completed");
  return (
    <section className="view active">
      <div className="metric-grid"><MetricCard label="本月营收" value={yuan(completed.reduce((sum, order) => sum + order.paidAmount, 0))} note="已完成订单" /><MetricCard label="服务单量" value={completed.length} note="已核销服务" /><MetricCard label="平均客单" value={completed.length ? yuan(completed.reduce((sum, order) => sum + order.paidAmount, 0) / completed.length) : "¥0"} note="实收 / 单量" /><MetricCard label="复购率" value="38%" note="近 30 天" /></div>
      <section className="panel report-panel"><div className="panel-header"><div><h3>近 7 日营收趋势</h3><p>用于快速判断门店经营走势。</p></div></div><div className="bar-chart">{[42, 56, 48, 72, 64, 82, 68].map((height, index) => <div key={index}><span style={{ height: `${height}%` }} /><small>{8 + index}日</small></div>)}</div></section>
    </section>
  );
}

function CustomerDirectoryView({ state, helpers, compact = false, onEdit }) {
  const customers = helpers.visibleCustomers || helpers.merchantCustomers;
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredCustomers = customers.filter((customer) =>
    !normalizedQuery || customer.name.toLowerCase().includes(normalizedQuery) || customer.phone.includes(normalizedQuery),
  );
  return (
    <section className="view active panel">
      <div className="panel-header">
        <div><h3>{compact ? "会员档案查询" : "会员管理"}</h3><p>顾客归属于商户，可跨门店累积消费记录。</p></div>
        <input className="search-input" aria-label="搜索会员" placeholder="搜索姓名或手机号" value={query} onChange={(event) => setQuery(event.target.value)} />
      </div>
      {!customers.length ? (
        <EmptyState icon="◎" title="还没有会员档案" description="顾客完成首次预约后会自动进入会员池，也可以从预约流程中快速创建。" />
      ) : !filteredCustomers.length ? (
        <EmptyState icon="⌕" title="没有找到匹配会员" description="可以换一个姓名或手机号重新搜索。" actionLabel="清除搜索" onAction={() => setQuery("")} />
      ) : (
        <div className="table-wrap">
          <table className="responsive-table customer-table">
            <thead><tr><th>会员</th><th>常用门店</th><th>累计消费</th><th>订单数</th><th>最近到店</th>{onEdit && <th>操作</th>}</tr></thead>
            <tbody>
              {filteredCustomers.map((customer) => {
                const orders = state.orders.filter((order) => order.merchantId === helpers.merchant?.id && order.customerId === customer.id && (helpers.currentAccountStaff?.role !== "receptionist" || order.storeId === helpers.store?.id));
                return (
                  <tr key={customer.id}>
                    <td data-label="会员"><strong>{customer.name}</strong><br /><span className="muted">{customer.phone}</span></td>
                    <td data-label="常用门店">{state.stores.find((store) => store.id === customer.homeStoreId)?.name}</td>
                    <td data-label="累计消费">{yuan(customer.totalSpent)}</td>
                    <td data-label="订单数">{orders.length}</td>
                    <td data-label="最近到店">{orders.at(-1)?.appointmentStartAt.slice(0, 10) || "暂无"}</td>
                    {onEdit && <td data-label="操作"><button className="text-button" onClick={() => onEdit(customer.id)}>编辑档案</button></td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function StaffView({ state, helpers, openModal, setState, startVerify, cancelOrder, page }) {
  if (page === "orders") {
    return <OrderVerificationView state={state} helpers={helpers} startVerify={startVerify} />;
  }
  if (page === "customers") {
    return <CustomerDirectoryView state={state} helpers={helpers} compact />;
  }

  const hours = Array.from({ length: 13 }, (_, index) => 9 + index);
  const filteredOrders = helpers.currentStoreOrders().filter((order) => {
    if (state.calendarStatus !== "all" && order.status !== state.calendarStatus) return false;
    if (state.technicianFilter !== "all" && order.technicianId !== Number(state.technicianFilter)) return false;
    if (state.calendarView === "today") return order.appointmentStartAt.startsWith(today);
    return order.appointmentStartAt.slice(0, 10) >= today;
  });

  function setCalendarField(field, value) {
    setState((current) => ({ ...current, [field]: value }));
  }

  return (
    <section className="view active">
      <section className="panel">
        <div className="panel-header calendar-header">
          <div>
            <h3>预约日历</h3>
            <p>门店员工查看预约、手动新增、到店核销。</p>
          </div>
          <button className="secondary-button" onClick={() => openModal("order")}>
            新增预约
          </button>
        </div>

        <div className="filters">
          <label>
            视图
            <select value={state.calendarView} onChange={(event) => setCalendarField("calendarView", event.target.value)}>
              <option value="today">今日</option>
              <option value="week">本周</option>
            </select>
          </label>
          <label>
            技师
            <select value={state.technicianFilter} onChange={(event) => setCalendarField("technicianFilter", event.target.value)}>
              <option value="all">全部技师</option>
              {helpers.technicians.map((staffer) => (
                <option value={staffer.id} key={staffer.id}>
                  {staffer.name}
                </option>
              ))}
            </select>
          </label>
          <div className="status-tabs">
            {[
              ["all", "全部"],
              ["pending", "待到店"],
              ["completed", "已完成"],
              ["cancelled", "已取消"],
            ].map(([status, label]) => (
              <button
                key={status}
                className={state.calendarStatus === status ? "active" : ""}
                onClick={() => setCalendarField("calendarStatus", status)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="calendar-grid">
          <div className="time-rail">
            {hours.map((hour) => (
              <div className="time-slot" key={hour}>
                {String(hour).padStart(2, "0")}:00
              </div>
            ))}
          </div>
          <div className="timeline">
            {hours.map((hour) => {
              const hourOrders = filteredOrders.filter((order) => Number(order.appointmentStartAt.slice(11, 13)) === hour);
              return (
                <div className="timeline-row" key={hour}>
                  {hourOrders.length ? (
                    hourOrders.map((order) => (
                      <AppointmentCard
                        key={order.id}
                        order={order}
                        helpers={helpers}
                        startVerify={startVerify}
                        cancelOrder={cancelOrder}
                      />
                    ))
                  ) : (
                    <span className="empty-slot">该时段暂无预约</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </section>
  );
}

function OrderVerificationView({ state, helpers, startVerify }) {
  const pending = helpers.currentMerchantOrders().filter((order) => order.status === "pending");
  return (
    <section className="view active panel">
      <div className="panel-header">
        <div><h3>待核销订单</h3><p>输入订单号或手机号，快速定位到店顾客。</p></div>
        <input className="search-input" placeholder="搜索订单号 / 手机号" />
      </div>
      <div className="verification-list">
        {pending.map((order) => {
          const customer = helpers.getCustomer(order.customerId);
          const item = helpers.getItem(order.serviceItemId);
          return (
            <article className="verification-card" key={order.id}>
              <div className="order-number"><span>订单号</span><strong>SO{String(order.id).padStart(6, "0")}</strong></div>
              <div><strong>{customer.name} · {customer.phone}</strong><p>{item.name} · {order.appointmentStartAt.slice(5, 16)}</p></div>
              <div className="verification-amount"><span>应收</span><strong>{yuan(order.totalAmount)}</strong></div>
              <button className="primary-button" data-verify-order={order.id} onClick={() => startVerify(order.id)}>核销订单</button>
            </article>
          );
        })}
        {!pending.length && <EmptyState icon="✓" title="暂时没有待核销订单" description="顾客完成预约后，待到店订单会自动出现在这里。" />}
      </div>
    </section>
  );
}

function TechnicianView({ state, helpers, page }) {
  const technician = helpers.currentAccountStaff?.role === "technician"
    ? helpers.currentAccountStaff
    : helpers.technicians[0] || helpers.storeStaff.find((staffer) => staffer.role === "technician");
  const myOrders = technician
    ? helpers.currentStoreOrders().filter((order) => order.technicianId === technician.id)
    : [];

  if (page === "profile") {
    return (
      <section className="view active profile-layout">
        <article className="panel profile-card"><div className="profile-avatar">{technician?.name?.slice(0, 1) || "技"}</div><h3>{technician?.name || "暂无技师"}</h3><p>{technician ? `${roleText[technician.role]} · ${helpers.store?.name || "未选择门店"}` : "当前门店暂无技师"}</p><span className="tag green">{technician ? "在职" : "待配置"}</span></article>
        <article className="panel profile-details"><div className="panel-header"><div><h3>个人资料</h3><p>技师只能维护自己的公开服务信息。</p></div></div><dl><div><dt>手机号</dt><dd>{technician?.phone || "待配置"}</dd></div><div><dt>擅长项目</dt><dd>面部清洁、肩颈舒缓</dd></div><div><dt>本月服务</dt><dd>{myOrders.filter((order) => order.status === "completed").length} 单</dd></div></dl></article>
      </section>
    );
  }

  if (page === "service_history") {
    return <ServiceLedgerView orders={myOrders} helpers={helpers} />;
  }

  return <TechnicianScheduleView orders={myOrders} helpers={helpers} />;
}

function TechnicianScheduleView({ orders, helpers }) {
  const days = [
    { date: "2026-08-12", week: "周三", day: "12" },
    { date: "2026-08-13", week: "周四", day: "13" },
    { date: "2026-08-14", week: "今天", day: "14" },
    { date: "2026-08-15", week: "周六", day: "15" },
    { date: "2026-08-16", week: "周日", day: "16" },
    { date: "2026-08-17", week: "周一", day: "17" },
    { date: "2026-08-18", week: "周二", day: "18" },
  ];
  const [selectedDate, setSelectedDate] = useState(today);
  const dayOrders = orders
    .filter((order) => order.appointmentStartAt.startsWith(selectedDate) && order.status !== "cancelled")
    .sort((a, b) => a.appointmentStartAt.localeCompare(b.appointmentStartAt));
  const bookedMinutes = dayOrders.reduce((sum, order) => {
    const item = helpers.getItem(order.serviceItemId);
    return sum + item.durationMinutes;
  }, 0);
  const nextOrder = dayOrders.find((order) => order.status === "pending");
  const scheduleBlocks = [];
  let cursor = 9 * 60;

  dayOrders.forEach((order) => {
    const start = Number(order.appointmentStartAt.slice(11, 13)) * 60 + Number(order.appointmentStartAt.slice(14, 16));
    const end = Number(order.appointmentEndAt.slice(11, 13)) * 60 + Number(order.appointmentEndAt.slice(14, 16));
    if (start > cursor) scheduleBlocks.push({ type: "free", start: cursor, end: start });
    scheduleBlocks.push({ type: "booking", start, end, order });
    cursor = Math.max(cursor, end);
  });
  if (cursor < 18 * 60) scheduleBlocks.push({ type: "free", start: cursor, end: 18 * 60 });

  const timeText = (minutes) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

  return (
    <section className="view active technician-day-view">
      <section className="date-strip" aria-label="选择排班日期">
        {days.map((day) => (
          <button key={day.date} className={selectedDate === day.date ? "active" : ""} onClick={() => setSelectedDate(day.date)}>
            <span>{day.week}</span><strong>{day.day}</strong>
            {orders.some((order) => order.appointmentStartAt.startsWith(day.date) && order.status !== "cancelled") && <i />}
          </button>
        ))}
      </section>

      <div className="schedule-summary-grid">
        <article className="shift-card">
          <span>今日班次</span><strong>09:00 - 18:00</strong><small>杭州西湖店 · 美容一组</small>
        </article>
        <article className="shift-card"><span>预约占用</span><strong>{Math.floor(bookedMinutes / 60)}小时{bookedMinutes % 60 ? `${bookedMinutes % 60}分` : ""}</strong><small>{dayOrders.length} 位顾客</small></article>
        <article className="next-visit-card">
          <div><span>{nextOrder ? "下一位顾客" : "当前状态"}</span><strong>{nextOrder ? `${nextOrder.appointmentStartAt.slice(11, 16)} · ${helpers.getCustomer(nextOrder.customerId).name}` : "今日暂无待服务"}</strong><small>{nextOrder ? helpers.getItem(nextOrder.serviceItemId).name : "可以安排休息或店务"}</small></div>
          {nextOrder && <button>查看顾客档案</button>}
        </article>
      </div>

      <section className="panel day-agenda-panel">
        <div className="panel-header"><div><h3>{selectedDate === today ? "今天的工作日程" : `${selectedDate.slice(5).replace("-", "月")}日工作日程`}</h3><p>预约、空闲窗口和顾客注意事项集中在一条时间线上。</p></div><span className="shift-badge">班次 09:00-18:00</span></div>
        <div className="day-agenda">
          {scheduleBlocks.map((block, index) => {
            if (block.type === "free") {
              const duration = block.end - block.start;
              return <article className="agenda-free" key={`free-${index}`}><time>{timeText(block.start)}</time><span className="agenda-track" /><div><strong>空闲 {duration} 分钟</strong><small>可接预约、休息或处理店务</small></div><button>设为不可约</button></article>;
            }
            const customer = helpers.getCustomer(block.order.customerId);
            const item = helpers.getItem(block.order.serviceItemId);
            return (
              <article className={`agenda-booking ${block.order.status}`} key={block.order.id}>
                <time>{timeText(block.start)}<small>{timeText(block.end)}</small></time><span className="agenda-track" />
                <div className="agenda-main"><span className="agenda-type">预约服务</span><strong>{item.name}</strong><p>{customer.name} · {customer.phone.slice(-4)} · {statusText[block.order.paymentStatus]}</p><small>注意：{block.order.remark || "无特殊备注"}</small></div>
                <div className="agenda-actions"><span className={`tag ${block.order.status === "pending" ? "green" : "gold"}`}>{statusText[block.order.status]}</span><button>联系顾客</button></div>
              </article>
            );
          })}
          {!dayOrders.length && <div className="empty-state">当天没有预约，班次时间可以安排店务或开放预约</div>}
        </div>
      </section>
    </section>
  );
}

function ServiceLedgerView({ orders, helpers }) {
  const [range, setRange] = useState("month");
  const [itemFilter, setItemFilter] = useState("all");
  const completed = orders
    .filter((order) => order.status === "completed")
    .filter((order) => itemFilter === "all" || order.serviceItemId === Number(itemFilter))
    .filter((order) => range === "all" || order.appointmentStartAt.startsWith("2026-08"))
    .sort((a, b) => b.appointmentStartAt.localeCompare(a.appointmentStartAt));
  const revenue = completed.reduce((sum, order) => sum + order.paidAmount, 0);
  const serviceMinutes = completed.reduce((sum, order) => sum + helpers.getItem(order.serviceItemId).durationMinutes, 0);
  const itemStats = helpers.technicians ? [...new Set(completed.map((order) => order.serviceItemId))].map((id) => ({
    item: helpers.getItem(id),
    count: completed.filter((order) => order.serviceItemId === id).length,
  })) : [];

  return (
    <section className="view active service-ledger-view">
      <div className="ledger-toolbar">
        <div className="status-tabs"><button className={range === "month" ? "active" : ""} onClick={() => setRange("month")}>本月</button><button className={range === "all" ? "active" : ""} onClick={() => setRange("all")}>全部</button></div>
        <label>服务项目<select value={itemFilter} onChange={(event) => setItemFilter(event.target.value)}><option value="all">全部项目</option>{[...new Set(orders.filter((order) => order.status === "completed").map((order) => order.serviceItemId))].map((id) => <option key={id} value={id}>{helpers.getItem(id).name}</option>)}</select></label>
        <button className="ghost-button">导出记录</button>
      </div>

      <div className="ledger-metric-grid">
        <article><span>已完成服务</span><strong>{completed.length}</strong><small>核销后的真实服务</small></article>
        <article><span>服务实收</span><strong>{yuan(revenue)}</strong><small>用于个人业绩核对</small></article>
        <article><span>服务时长</span><strong>{(serviceMinutes / 60).toFixed(1)}h</strong><small>按项目标准时长</small></article>
        <article><span>平均客单</span><strong>{completed.length ? yuan(Math.round(revenue / completed.length)) : "¥0"}</strong><small>实收金额 / 服务数</small></article>
      </div>

      <div className="ledger-layout">
        <section className="panel ledger-table-panel">
          <div className="panel-header"><div><h3>服务明细</h3><p>完整保留项目、顾客、实收和服务总结。</p></div></div>
          <div className="ledger-list">
            {completed.map((order) => { const item = helpers.getItem(order.serviceItemId); const customer = helpers.getCustomer(order.customerId); return (
              <article key={order.id}>
                <div className="ledger-date"><strong>{order.appointmentStartAt.slice(8, 10)}</strong><span>{order.appointmentStartAt.slice(5, 7)}月 · {order.appointmentStartAt.slice(11, 16)}</span></div>
                <div className="ledger-service"><strong>{item.name}</strong><p>{customer.name} · {item.durationMinutes} 分钟</p><small>{order.remark || "未填写服务总结"}</small></div>
                <div className="ledger-payment"><span>实收</span><strong>{yuan(order.paidAmount)}</strong><small>{order.paymentMethod === "wechat" ? "微信支付" : order.paymentMethod === "balance" ? "储值余额" : "到店支付"}</small></div>
                <button className="text-button">查看详情</button>
              </article>
            ); })}
            {!completed.length && <div className="empty-state">当前筛选条件下没有服务记录</div>}
          </div>
        </section>

        <aside className="panel ledger-insights">
          <div className="panel-header"><div><h3>项目构成</h3><p>了解自己的服务结构。</p></div></div>
          <div className="service-mix">{itemStats.map(({ item, count }) => <div key={item.id}><span><strong>{item.name}</strong><small>{count} 次</small></span><i><b style={{ width: `${Math.max(24, count / Math.max(1, completed.length) * 100)}%` }} /></i></div>)}</div>
          <div className="ledger-tip"><span>服务质量提醒</span><strong>2 条服务均已填写总结</strong><p>完整的服务备注能帮助下次接待快速了解顾客情况。</p></div>
        </aside>
      </div>
    </section>
  );
}

function AppointmentCard({ order, helpers, startVerify, cancelOrder }) {
  const item = helpers.getItem(order.serviceItemId);
  const customer = helpers.getCustomer(order.customerId);
  const technician = helpers.getStaff(order.technicianId);
  const start = order.appointmentStartAt.slice(11, 16);
  const end = order.appointmentEndAt.slice(11, 16);
  const phoneTail = customer.phone.slice(-4);

  return (
    <article className={`appointment-card ${order.status}`}>
      <div>
        <strong>{item.name}</strong>
        <small>
          {technician.name} · {start}-{end}
        </small>
      </div>
      <div>
        <span>
          {customer.name} · {phoneTail}
        </span>
        <small>
          {statusText[order.paymentStatus]} · {order.remark || "无备注"}
        </small>
      </div>
      <div className="inline-actions">
        <span className={`tag ${order.status === "pending" ? "green" : order.status === "completed" ? "gold" : "red"}`}>
          {statusText[order.status]}
        </span>
        {order.status === "pending" && (
          <>
            <button className="mini-button" data-verify-order={order.id} onClick={() => startVerify(order.id)}>
              核销
            </button>
            <button className="mini-button alt" data-cancel-order={order.id} onClick={() => cancelOrder(order.id)}>
              取消
            </button>
          </>
        )}
      </div>
    </article>
  );
}

function CustomerView({
  state,
  helpers,
  miniBook,
  page,
  setPage,
  sendAdvisorMessage,
  requestHumanSupport,
  setCustomerContext,
  activeSession,
  standalone = false,
}) {
  const customer = helpers.customer;
  const orders = state.orders.filter(
    (order) =>
      order.merchantId === helpers.merchant?.id &&
      order.storeId === helpers.store?.id &&
      order.customerId === customer?.id,
  );
  const industry = helpers.merchant?.industry || state.industry;
  const onlineItems = helpers.onlineItems || [];
  const sessionKey = `${helpers.merchant?.id ?? "none"}:${helpers.store?.id ?? "none"}:${customer?.id ?? "none"}`;
  const session = activeSession ?? state.advisorSessions?.[sessionKey] ?? createAdvisorSession(helpers.store);
  const messages = session.messages;

  return (
    <section className={`view active ${standalone ? "standalone" : ""}`} id="customerView">
      <div className={`phone-frame ${standalone ? "standalone" : ""}`}>
        {!standalone && <div className="phone-status">
          <span>09:41</span>
          <span>5G 100%</span>
        </div>}
        <div className="mini-program">
          {!standalone && <div className="mini-context-bar">
            <div>
              <span>当前商户</span>
              <strong>{helpers.merchant?.name || "未选择商户"}</strong>
            </div>
            <label>
              <span>当前门店</span>
              <select
                aria-label="小程序当前门店"
                value={helpers.store?.id ?? ""}
                onChange={(event) =>
                  setCustomerContext({
                    merchantId: helpers.merchant?.id,
                    storeId: event.target.value,
                    customerId: customer?.id,
                  })
                }
                disabled={!helpers.merchantStores?.length}
              >
                {!helpers.merchantStores?.length && <option value="">暂无可用门店</option>}
                {helpers.merchantStores?.map((store) => (
                  <option value={store.id} key={store.id}>
                    {store.name}{store.isActive === false ? "（暂停营业）" : ""}
                  </option>
                ))}
              </select>
            </label>
          </div>}
          {page === "advisor" && (
            <AdvisorView
              messages={messages}
              serviceItems={onlineItems}
              quickQuestions={industryTemplates[industry]?.quickQuestions || industryTemplates.beauty.quickQuestions}
              onSend={sendAdvisorMessage}
              onBook={miniBook}
              onHumanSupport={requestHumanSupport}
              store={helpers.store}
            />
          )}
          {(page === "home" || page === "bookings") && (
            <header className="mini-hero">
              <span>{helpers.store?.name || "请先选择门店"}</span>
              <h3>{page === "bookings" ? "选择适合你的服务" : "预约你的下一次到店服务"}</h3>
              <p>{helpers.store ? `营业时间 ${helpers.store.businessHours}` : "选择门店后展示可预约项目"}</p>
            </header>
          )}

          {(page === "home" || page === "cards") && <section className={`member-strip ${page === "cards" ? "standalone" : ""}`}>
            <div>
              <span>会员余额</span>
              <strong>¥328</strong>
            </div>
            <div>
              <span>可用券</span>
              <strong>2 张</strong>
            </div>
            <div>
              <span>次卡</span>
              <strong>4 次</strong>
            </div>
          </section>}

          {(page === "home" || page === "bookings") && <section className="mini-section">
            <div className="mini-section-title">
              <h4>热门项目</h4>
              <button>刷新</button>
            </div>
            <div className="mini-items" id="miniItemList">
              {onlineItems.map((item) => (
                  <article className="mini-item" key={item.id}>
                    <div>
                      <h4>{item.name}</h4>
                      <span className="muted">
                        {item.durationMinutes} 分钟 · {yuan(item.price)}
                      </span>
                    </div>
                    <button className="mini-button" data-mini-book={item.id} onClick={() => miniBook(item.id)}>
                      预约
                    </button>
                  </article>
                ))}
              {!onlineItems.length && (
                <div className="empty-state">
                  {helpers.store
                    ? "当前门店暂无已上架项目。你可以转人工，让门店确认是否有其他可安排服务。"
                    : "请先选择门店，再查看可预约项目。"}
                </div>
              )}
            </div>
          </section>}

          {(page === "home" || page === "my_orders") && <section className="mini-section">
            <div className="mini-section-title">
              <h4>我的订单</h4>
              <span>{orders.length} 单</span>
            </div>
            <div className="mini-orders" id="miniOrderList">
              {orders.map((order) => {
                const item = helpers.getItem(order.serviceItemId);
                const technician = helpers.getStaff(order.technicianId);
                return (
                  <article className="mini-order" key={order.id}>
                    <h4>{item?.name || "服务项目"}</h4>
                    <p className="muted">
                      {order.appointmentStartAt.slice(5, 16)} · {technician?.name || "到店安排"}
                    </p>
                    <span className={`tag ${order.status === "pending" ? "green" : order.status === "completed" ? "gold" : "red"}`}>
                      {statusText[order.status]}
                    </span>
                  </article>
                );
              })}
            </div>
          </section>}

          {page === "cards" && (
            <section className="mini-section mini-card-list">
              <article className="wallet-card balance-card">
                <span>储值余额</span>
                <strong>¥328.00</strong>
                <small>全商户门店通用</small>
              </article>
              <article className="wallet-card count-card">
                <span>面部护理次卡</span>
                <strong>剩余 4 次</strong>
                <small>有效期至 2026-12-31</small>
              </article>
              <article className="coupon-row">
                <strong>满 200 减 30</strong>
                <span>2 张可用</span>
              </article>
            </section>
          )}

          <nav className="mini-tabbar five" aria-label="小程序导航">
            {[['home', '首页', '⌂'], ['advisor', 'AI顾问', '✦'], ['bookings', '预约', '＋'], ['my_orders', '订单', '▤'], ['cards', '卡包', '◇']].map(([id, label, icon]) => (
              <button className={page === id ? "active" : ""} key={id} onClick={() => setPage(id)}>
                <span>{icon}</span>{label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}

function AdvisorView({ messages, serviceItems, quickQuestions, onSend, onBook, onHumanSupport, store }) {
  const [draft, setDraft] = useState("");

  function submit(message = draft) {
    onSend(message);
    setDraft("");
  }

  return (
    <section className="advisor-screen">
      <header className="advisor-header">
        <div className="advisor-avatar">AI</div>
        <div><strong>AI 服务顾问</strong><span>先了解需求，再推荐当前门店项目</span></div>
        <button title="转人工客服" aria-label="转人工客服" onClick={onHumanSupport}>☎</button>
      </header>
      <div className="advisor-notice">
        推荐范围：{store?.name || "未选择门店"}在售项目。建议仅供服务选择参考，不提供医疗诊断。
      </div>
      <div className="chat-list">
        {messages.map((message) => (
          <div className={`chat-message ${message.role}`} key={message.id}>
            {message.role === "assistant" && <span className="chat-avatar">AI</span>}
            <div className={`chat-bubble ${message.risk ? "risk" : ""}`}>
              <p>{message.text}</p>
              {!!message.recommendationIds?.length && (
                <div className="chat-recommendations">
                  {message.recommendationIds.map((id, index) => {
                    const item = serviceItems.find((serviceItem) => serviceItem.id === id);
                    if (!item) return null;
                    return (
                      <article className="chat-service-card" key={id}>
                        <div><span className="match-badge">推荐 {index + 1}</span><strong>{item.name}</strong><small>{(item.tags || []).join(" · ")}</small></div>
                        <div className="chat-service-footer"><span>{item.durationMinutes} 分钟 · {yuan(item.price)}</span><button onClick={() => onBook(item.id)}>立即预约</button></div>
                      </article>
                    );
                  })}
                </div>
              )}
              {message.role === "assistant" && (
                <button className="human-link" onClick={onHumanSupport}>
                  这个回答没解决问题？转人工
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {messages.length === 1 && <div className="quick-question-list">{quickQuestions.map((question) => <button key={question} onClick={() => submit(question)}>{question}</button>)}</div>}
      <form className="advisor-composer" onSubmit={(event) => { event.preventDefault(); submit(); }}>
        <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="描述你的需求或不适..." aria-label="向 AI 服务顾问提问" />
        <button type="submit" aria-label="发送问题">↑</button>
      </form>
    </section>
  );
}

function Modal({ active, onClose, title, children, wide = false, id }) {
  if (!active) return null;
  return (
    <div id={id} className="modal active" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className={`modal-card ${wide ? "wide" : ""}`}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="icon-button" onClick={onClose}>
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function CustomerDemoModal({ active, onClose, url, onUrlChange, onCopy, storeName }) {
  return (
    <Modal active={active} onClose={onClose} title="体验微信小程序" id="customerDemoModal">
      <div className="customer-demo-modal">
        <div className="demo-qr-wrap">
          <QRCodeSVG value={url} size={196} level="M" includeMargin />
        </div>
        <div className="demo-qr-copy">
          <span className="tag green">{storeName || "当前门店"}</span>
          <h4>手机扫码预览顾客体验</h4>
          <p>这是免安装的 Web 演示码，手机与电脑需连接同一 Wi-Fi；界面与流程同步微信小程序版本。</p>
        </div>
        <aside className="wechat-project-note">
          <strong>真实微信小程序已生成</strong>
          <span>在微信开发者工具中导入项目目录 <code>wechat-miniapp</code>，点击“预览”即可生成微信扫码二维码。</span>
        </aside>
        <label className="demo-url-field">
          Web 预览地址
          <input
            aria-label="顾客端地址"
            value={url}
            onChange={(event) => onUrlChange(event.target.value)}
            spellCheck="false"
          />
        </label>
        <div className="demo-modal-actions">
          <button className="ghost-button" type="button" onClick={onCopy}>复制链接</button>
          <a className="primary-button" href={url} target="_blank" rel="noreferrer">电脑预览</a>
        </div>
        <aside className="demo-sync-note">当前为纯前端 Mock：手机和电脑各自维护本地页面状态，操作结果不会跨设备实时同步。</aside>
      </div>
    </Modal>
  );
}

function MerchantModal({ active, onClose, onSubmit }) {
  return (
    <Modal active={active} onClose={onClose} title="新增商户">
      <form onSubmit={(event) => submitForm(event, onSubmit)}>
        <label>
          商户名称 <input name="name" defaultValue="新美业品牌" required />
        </label>
        <label>
          联系人 <input name="contactName" defaultValue="陈总" required />
        </label>
        <label>
          联系电话 <input name="contactPhone" defaultValue="13800005555" required />
        </label>
        <label>
          套餐到期 <input name="packageEnd" type="date" defaultValue="2026-12-31" required />
        </label>
        <button className="primary-button" type="submit">
          保存商户
        </button>
      </form>
    </Modal>
  );
}

function StoreModal({ active, onClose, onSubmit, store }) {
  const [openAt = "09:00", closeAt = "21:00"] = (store?.businessHours || "09:00-21:00").split("-");
  return (
    <Modal active={active} onClose={onClose} title={store ? "编辑门店" : "新增门店"}>
      <form className="two-column-form" onSubmit={(event) => submitForm(event, onSubmit)}>
        <input type="hidden" name="storeId" value={store?.id || ""} readOnly />
        <label className="full">门店名称 <input name="name" defaultValue={store?.name || "杭州滨江店"} required /></label>
        <label className="full">详细地址 <input name="address" defaultValue={store?.address || "杭州市滨江区江南大道88号"} required /></label>
        <label className="full">联系电话 <input name="phone" defaultValue={store?.phone || "0571-88990011"} required /></label>
        <label>开始营业 <input name="openAt" type="time" defaultValue={openAt} required /></label>
        <label>结束营业 <input name="closeAt" type="time" defaultValue={closeAt} required /></label>
        <label className="full">营业状态 <select name="isActive" defaultValue={String(store?.isActive !== false)}><option value="true">正常营业</option><option value="false">暂停营业</option></select></label>
        <button className="primary-button full" type="submit">{store ? "保存修改" : "保存门店"}</button>
      </form>
    </Modal>
  );
}

function StaffModal({ active, onClose, onSubmit, stores, staffer }) {
  return (
    <Modal active={active} onClose={onClose} title={staffer ? "编辑员工" : "新增员工"}>
      <form onSubmit={(event) => submitForm(event, onSubmit)}>
        <input type="hidden" name="staffId" value={staffer?.id || ""} readOnly />
        <label>员工姓名 <input name="name" defaultValue={staffer?.name || "陈技师"} required /></label>
        <label>手机号 <input name="phone" defaultValue={staffer?.phone || "13800009999"} required /></label>
        <label>所属门店 <select name="storeId" defaultValue={staffer?.storeId || stores[0]?.id}>{stores.map((store) => <option key={store.id} value={store.id}>{store.name}</option>)}</select></label>
        <label>岗位 <select name="role" defaultValue={staffer?.role || "technician"}><option value="admin">商户管理员</option><option value="receptionist">收银/前台</option><option value="technician">技师</option></select></label>
        <label>账号状态 <select name="isActive" defaultValue={String(staffer?.isActive !== false)}><option value="true">启用</option><option value="false">停用</option></select></label>
        <button className="primary-button" type="submit">{staffer ? "保存修改" : "创建员工账号"}</button>
      </form>
    </Modal>
  );
}

function CustomerModal({ active, onClose, onSubmit, stores, customer }) {
  if (!customer) return null;
  return (
    <Modal active={active} onClose={onClose} title="编辑会员档案">
      <form onSubmit={(event) => submitForm(event, onSubmit)}>
        <input type="hidden" name="customerId" value={customer.id} readOnly />
        <label>会员姓名 <input name="name" defaultValue={customer.name} required /></label>
        <label>手机号 <input name="phone" defaultValue={customer.phone} required /></label>
        <label>性别 <select name="gender" defaultValue={customer.gender || "unknown"}><option value="female">女</option><option value="male">男</option><option value="unknown">未填写</option></select></label>
        <label>常用门店 <select name="homeStoreId" defaultValue={customer.homeStoreId}>{stores.map((store) => <option key={store.id} value={store.id}>{store.name}</option>)}</select></label>
        <label>会员备注 <textarea name="remark" rows="3" defaultValue={customer.remark || ""} placeholder="过敏信息、服务偏好等" /></label>
        <div className="readonly-summary"><span>累计消费（不可编辑）</span><strong>{yuan(customer.totalSpent)}</strong></div>
        <button className="primary-button" type="submit">保存会员资料</button>
      </form>
    </Modal>
  );
}

function ItemModal({ active, onClose, onSubmit, industry, item }) {
  return (
    <Modal active={active} onClose={onClose} title={item ? "编辑服务项目" : "新增服务项目"}>
      <form onSubmit={(event) => submitForm(event, onSubmit)}>
        <input type="hidden" name="itemId" value={item?.id || ""} readOnly />
        <label>
          项目名称 <input name="name" defaultValue={item?.name || "水光修护护理"} required />
        </label>
        <label>
          价格（元） <input name="price" type="number" min="0" defaultValue={item ? item.price / 100 : 198} required />
        </label>
        <label>
          时长（分钟） <input name="duration" type="number" min="15" step="15" defaultValue={item?.durationMinutes || 75} required />
        </label>
        <fieldset className="tag-fieldset">
          <legend>适用场景（平台预置，可多选）</legend>
          <div className="tag-checkboxes">
            {industryTemplates[industry].tags.map((tag) => (
              <label key={tag}><input type="checkbox" name="tags" value={tag} defaultChecked={item ? (item.tags || []).includes(tag) : ["深层补水", "敏感修护"].includes(tag)} />{tag}</label>
            ))}
          </div>
        </fieldset>
        <label>展示状态 <select name="isOnline" defaultValue={String(item?.isOnline !== false)}><option value="true">上架到顾客端</option><option value="false">暂时下架</option></select></label>
        <button className="primary-button" type="submit">
          {item ? "保存修改" : "创建项目"}
        </button>
      </form>
    </Modal>
  );
}

function OrderModal({ active, onClose, onSubmit, items, technicians }) {
  const defaultItemId = items.find((item) => item.isOnline)?.id ?? "";
  const defaultTechnicianId = technicians[0]?.id ?? "";
  return (
    <Modal active={active} onClose={onClose} title="新增预约" wide>
      <form className="two-column-form" onSubmit={(event) => submitForm(event, onSubmit)}>
        <label>
          顾客手机号 <input name="phone" defaultValue="13600004444" required />
        </label>
        <label>
          顾客姓名 <input name="customerName" defaultValue="赵女士" required />
        </label>
        <label>
          服务项目
          <select name="serviceItemId" defaultValue={defaultItemId}>
            {items
              .filter((item) => item.isOnline)
              .map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name} · {yuan(item.price)}
                </option>
              ))}
          </select>
        </label>
        <label>
          服务技师
          <select name="technicianId" defaultValue={defaultTechnicianId}>
            {technicians.map((staffer) => (
              <option value={staffer.id} key={staffer.id}>
                {staffer.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          预约日期 <input name="date" type="date" defaultValue="2026-08-14" required />
        </label>
        <label>
          预约时间 <input name="time" type="time" defaultValue="13:30" required />
        </label>
        <label className="full">
          备注 <textarea name="remark" rows="3" defaultValue="希望安排安静房间" />
        </label>
        <button className="primary-button full" type="submit">
          保存预约
        </button>
      </form>
    </Modal>
  );
}

function VerifyModal({ active, onClose, onSubmit, order, helpers }) {
  if (!order) return null;
  const item = helpers.getItem(order.serviceItemId);
  const customer = helpers.getCustomer(order.customerId);
  return (
    <Modal id="verifyModal" active={active} onClose={onClose} title="订单核销">
      <div className="verify-summary">
        <strong>
          {customer.name} · {item.name}
        </strong>
        <span className="muted">预约时间：{order.appointmentStartAt.slice(0, 16)}</span>
        <span className="muted">应收：{yuan(order.totalAmount)}</span>
      </div>
      <form id="verifyForm" onSubmit={(event) => submitForm(event, onSubmit)}>
        <input type="hidden" name="orderId" value={order.id} readOnly />
        <label>
          实收金额（元） <input name="paidAmount" type="number" min="0" defaultValue={order.totalAmount / 100} required />
        </label>
        <label>
          优惠金额（元） <input name="discountAmount" type="number" min="0" defaultValue="0" />
        </label>
        <label>
          支付方式
          <select name="paymentMethod" defaultValue="offline">
            <option value="offline">到店支付</option>
            <option value="wechat">微信支付</option>
            <option value="card">次卡</option>
            <option value="balance">储值余额</option>
          </select>
        </label>
        <button className="primary-button" type="submit">
          确认核销
        </button>
      </form>
    </Modal>
  );
}

function submitForm(event, handler) {
  event.preventDefault();
  handler(new FormData(event.currentTarget));
}

export default App;
