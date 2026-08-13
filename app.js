const yuan = (fen) =>
  `¥${(fen / 100).toLocaleString("zh-CN", {
    minimumFractionDigits: fen % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;

const today = "2026-08-14";

const initialState = {
  currentView: "platform",
  calendarStatus: "all",
  calendarView: "today",
  technicianFilter: "all",
  currentMerchantId: 1,
  merchants: [
    {
      id: 1,
      name: "有赞测试美容",
      contactName: "张三",
      contactPhone: "13800001111",
      packageEnd: "2026-12-31",
      status: "active",
    },
    {
      id: 2,
      name: "清颜皮肤管理",
      contactName: "陈总",
      contactPhone: "13800005555",
      packageEnd: "2026-09-30",
      status: "trial",
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
    },
  ],
  staff: [
    { id: 1, merchantId: 1, storeId: 1, name: "李店长", phone: "13900002222", role: "admin" },
    { id: 2, merchantId: 1, storeId: 1, name: "王技师", phone: "13700003333", role: "technician" },
    { id: 3, merchantId: 1, storeId: 1, name: "周技师", phone: "13500006666", role: "technician" },
    { id: 4, merchantId: 1, storeId: 1, name: "前台小林", phone: "13400007777", role: "receptionist" },
  ],
  customers: [
    { id: 1, merchantId: 1, homeStoreId: 1, name: "赵女士", phone: "13600004444", gender: "female", totalSpent: 0 },
    { id: 2, merchantId: 1, homeStoreId: 1, name: "王女士", phone: "13600008821", gender: "female", totalSpent: 12800 },
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
    },
    {
      id: 2,
      merchantId: 1,
      storeId: 1,
      name: "肩颈舒缓推拿",
      price: 16800,
      durationMinutes: 90,
      isOnline: true,
    },
    {
      id: 3,
      merchantId: 1,
      storeId: 1,
      name: "水光修护护理",
      price: 19800,
      durationMinutes: 75,
      isOnline: true,
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
  ],
  operationLogs: [
    { id: 1, orderId: 1, action: "create", operatorStaffId: 1, createdAt: "2026-08-13 12:20:00" },
  ],
};

let state = structuredClone(initialState);

const viewMeta = {
  platform: {
    eyebrow: "平台运营后台",
    title: "管理全平台商户和经营数据",
    action: "创建商户",
    modal: "merchantModal",
  },
  merchant: {
    eyebrow: "商家管理端",
    title: "配置门店、员工、项目和经营看板",
    action: "新增项目",
    modal: "itemModal",
  },
  staff: {
    eyebrow: "门店员工端",
    title: "预约日历、到店核销和一线操作",
    action: "新增预约",
    modal: "orderModal",
  },
  customer: {
    eyebrow: "微信小程序",
    title: "顾客预约、下单和查看订单",
    action: "立即预约",
    modal: null,
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

function getMerchant() {
  return state.merchants.find((merchant) => merchant.id === state.currentMerchantId) ?? state.merchants[0];
}

function getStore(id = 1) {
  return state.stores.find((store) => store.id === id);
}

function getCustomer(id) {
  return state.customers.find((customer) => customer.id === id);
}

function getItem(id) {
  return state.serviceItems.find((item) => item.id === id);
}

function getStaff(id) {
  return state.staff.find((staffer) => staffer.id === id);
}

function getTechnicians() {
  return getMerchantStaff().filter((staffer) => staffer.role === "technician");
}

function getMerchantStores(merchantId = getMerchant().id) {
  return state.stores.filter((store) => store.merchantId === merchantId);
}

function getPrimaryStore(merchantId = getMerchant().id) {
  return getMerchantStores(merchantId)[0] ?? null;
}

function getMerchantStaff(merchantId = getMerchant().id) {
  return state.staff.filter((staffer) => staffer.merchantId === merchantId);
}

function getMerchantCustomers(merchantId = getMerchant().id) {
  return state.customers.filter((customer) => customer.merchantId === merchantId);
}

function getMerchantServiceItems(merchantId = getMerchant().id) {
  return state.serviceItems.filter((item) => item.merchantId === merchantId);
}

function ensureMerchantBaseline(merchant) {
  const merchantStores = getMerchantStores(merchant.id);
  let primaryStore = merchantStores[0];

  if (!primaryStore) {
    primaryStore = {
      id: nextId(state.stores),
      merchantId: merchant.id,
      name: `${merchant.name} 首店`,
      address: "待补充地址",
      phone: merchant.contactPhone || `1380000${String(merchant.id).padStart(4, "0")}`,
      businessHours: "09:00-21:00",
    };
    state.stores.push(primaryStore);
  }

  const merchantStaff = getMerchantStaff(merchant.id);
  if (!merchantStaff.some((staffer) => staffer.role === "admin")) {
    state.staff.push({
      id: nextId(state.staff),
      merchantId: merchant.id,
      storeId: primaryStore.id,
      name: merchant.contactName || `${merchant.name} 店长`,
      phone: `1390000${String(merchant.id).padStart(4, "0")}`,
      role: "admin",
    });
  }

  if (!merchantStaff.some((staffer) => staffer.role === "technician")) {
    state.staff.push({
      id: nextId(state.staff),
      merchantId: merchant.id,
      storeId: primaryStore.id,
      name: "默认技师",
      phone: `1370000${String(merchant.id).padStart(4, "0")}`,
      role: "technician",
    });
  }

  if (!getMerchantServiceItems(merchant.id).length) {
    state.serviceItems.push({
      id: nextId(state.serviceItems),
      merchantId: merchant.id,
      storeId: primaryStore.id,
      name: "体验护理",
      price: 9800,
      durationMinutes: 60,
      isOnline: true,
    });
  }
}

function ensureAllMerchantBaselines() {
  state.merchants.forEach((merchant) => ensureMerchantBaseline(merchant));
}

function setCurrentMerchant(merchantId) {
  const merchant = state.merchants.find((item) => item.id === merchantId);
  if (!merchant) return;
  state.currentMerchantId = merchant.id;
  state.technicianFilter = "all";
}

function renderMerchantSwitcher() {
  const select = document.querySelector("#merchantSwitcher");
  if (!select) return;
  select.innerHTML = state.merchants
    .map((merchant) => `<option value="${merchant.id}">${merchant.name}</option>`)
    .join("");
  select.value = String(getMerchant().id);
}

ensureAllMerchantBaselines();

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function openModal(id) {
  const modal = document.querySelector(`#${id}`);
  if (modal) modal.classList.add("active");
}

function closeModals() {
  document.querySelectorAll(".modal").forEach((modal) => modal.classList.remove("active"));
}

function setView(view) {
  state.currentView = view;
  document.querySelectorAll(".persona-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
  document.querySelectorAll(".view").forEach((section) => {
    section.classList.toggle("active", section.id === `${view}View`);
  });
  document.querySelector("#viewEyebrow").textContent = viewMeta[view].eyebrow;
  document.querySelector("#viewTitle").textContent = viewMeta[view].title;
  const action = document.querySelector("#primaryActionButton");
  action.textContent = viewMeta[view].action;
  action.disabled = view === "customer";
  render();
}

function currentMerchantOrders() {
  return state.orders.filter((order) => order.merchantId === getMerchant().id);
}

function renderPlatform() {
  const orders = state.orders;
  const completedRevenue = orders
    .filter((order) => order.status === "completed")
    .reduce((sum, order) => sum + order.paidAmount, 0);
  document.querySelector("#platformGmv").textContent = yuan(completedRevenue);
  document.querySelector("#activeMerchantCount").textContent = state.merchants.filter((m) =>
    ["active", "trial"].includes(m.status),
  ).length;
  document.querySelector("#pendingOrderCount").textContent = state.orders.filter(
    (order) => order.status === "pending",
  ).length;

  const tbody = document.querySelector("#merchantTableBody");
  tbody.innerHTML = state.merchants
    .map((merchant) => {
      const merchantOrders = state.orders.filter((order) => order.merchantId === merchant.id);
      const gmv = merchantOrders
        .filter((order) => order.status === "completed")
        .reduce((sum, order) => sum + order.paidAmount, 0);
      const storeCount = state.stores.filter((store) => store.merchantId === merchant.id).length;
      const tagClass = merchant.status === "active" ? "green" : merchant.status === "trial" ? "gold" : "red";
      return `<tr>
        <td><strong>${merchant.name}</strong><br><span class="muted">${merchant.contactPhone}</span></td>
        <td>${merchant.contactName}</td>
        <td>${storeCount}</td>
        <td>${merchant.packageEnd}</td>
        <td><span class="tag ${tagClass}">${statusText[merchant.status]}</span></td>
        <td>${yuan(gmv)}</td>
      </tr>`;
    })
    .join("");
}

function renderMerchant() {
  const orders = currentMerchantOrders();
  const todayRevenue = orders
    .filter((order) => order.status === "completed" && order.appointmentStartAt.startsWith(today))
    .reduce((sum, order) => sum + order.paidAmount, 0);
  document.querySelector("#merchantTodayRevenue").textContent = yuan(todayRevenue);
  document.querySelector("#merchantPendingOrders").textContent = orders.filter((order) => order.status === "pending").length;
  document.querySelector("#onlineItemCount").textContent = getMerchantServiceItems().filter((item) => item.isOnline).length;
  document.querySelector("#customerCount").textContent = getMerchantCustomers().length;

  document.querySelector("#serviceItemList").innerHTML = getMerchantServiceItems()
    .map(
      (item) => `<article class="service-item">
        <div class="item-thumb" aria-hidden="true"></div>
        <div>
          <h4>${item.name}</h4>
          <span class="muted">${item.durationMinutes} 分钟 · ${item.isOnline ? "小程序可预约" : "已下架"}</span>
        </div>
        <strong class="price">${yuan(item.price)}</strong>
      </article>`,
    )
    .join("");

  const store = getPrimaryStore() ?? {
    name: "暂无门店",
    address: "待补充地址",
    phone: "",
    businessHours: "",
  };
  document.querySelector("#storeProfile").innerHTML = `<h4>${store.name}</h4>
    <p class="muted">${store.address}</p>
    <p class="muted">${store.phone} · ${store.businessHours}</p>`;

  document.querySelector("#staffList").innerHTML = getMerchantStaff()
    .map(
      (staffer) => `<article class="staff-row">
        <div>
          <h4>${staffer.name}</h4>
          <span class="muted">${staffer.phone}</span>
        </div>
        <span class="tag">${roleText[staffer.role]}</span>
      </article>`,
    )
    .join("");
}

function renderCalendarSelects() {
  const techOptions = [`<option value="all">全部技师</option>`]
    .concat(getTechnicians().map((staffer) => `<option value="${staffer.id}">${staffer.name}</option>`))
    .join("");
  const technicianFilter = document.querySelector("#technicianFilter");
  technicianFilter.innerHTML = techOptions;
  technicianFilter.value = state.technicianFilter;

  document.querySelector("#orderTechnicianSelect").innerHTML = getTechnicians()
    .map((staffer) => `<option value="${staffer.id}">${staffer.name}</option>`)
    .join("");
  document.querySelector("#orderItemSelect").innerHTML = state.serviceItems
    .filter((item) => item.isOnline)
    .map((item) => `<option value="${item.id}">${item.name} · ${yuan(item.price)}</option>`)
    .join("");
}

function orderHour(order) {
  return Number(order.appointmentStartAt.slice(11, 13));
}

function calendarOrders() {
  return currentMerchantOrders().filter((order) => {
    if (state.calendarStatus !== "all" && order.status !== state.calendarStatus) return false;
    if (state.technicianFilter !== "all" && order.technicianId !== Number(state.technicianFilter)) return false;
    if (state.calendarView === "today") return order.appointmentStartAt.startsWith(today);
    return order.appointmentStartAt.slice(0, 10) >= today;
  });
}

function renderStaff() {
  renderCalendarSelects();
  document.querySelector("#calendarViewSelect").value = state.calendarView;
  document.querySelectorAll("#statusTabs button").forEach((button) => {
    button.classList.toggle("active", button.dataset.status === state.calendarStatus);
  });

  const hours = Array.from({ length: 13 }, (_, index) => 9 + index);
  document.querySelector("#timeRail").innerHTML = hours
    .map((hour) => `<div class="time-slot">${String(hour).padStart(2, "0")}:00</div>`)
    .join("");

  const orders = calendarOrders();
  document.querySelector("#timeline").innerHTML = hours
    .map((hour) => {
      const hourOrders = orders.filter((order) => orderHour(order) === hour);
      return `<div class="timeline-row">
        ${
          hourOrders.length
            ? hourOrders.map(renderAppointmentCard).join("")
            : `<span class="empty-slot">该时段暂无预约</span>`
        }
      </div>`;
    })
    .join("");
}

function renderAppointmentCard(order) {
  const item = getItem(order.serviceItemId);
  const customer = getCustomer(order.customerId);
  const technician = getStaff(order.technicianId);
  const start = order.appointmentStartAt.slice(11, 16);
  const end = order.appointmentEndAt.slice(11, 16);
  const phoneTail = customer.phone.slice(-4);
  return `<article class="appointment-card ${order.status}">
    <div>
      <strong>${item.name}</strong>
      <small>${technician.name} · ${start}-${end}</small>
    </div>
    <div>
      <span>${customer.name} · ${phoneTail}</span>
      <small>${statusText[order.paymentStatus]} · ${order.remark || "无备注"}</small>
    </div>
    <div class="inline-actions">
      <span class="tag ${order.status === "pending" ? "green" : order.status === "completed" ? "gold" : "red"}">${statusText[order.status]}</span>
      ${order.status === "pending" ? `<button class="mini-button" data-verify-order="${order.id}">核销</button>` : ""}
      ${order.status === "pending" ? `<button class="mini-button alt" data-cancel-order="${order.id}">取消</button>` : ""}
    </div>
  </article>`;
}

function renderCustomer() {
  document.querySelector("#miniItemList").innerHTML = state.serviceItems
    .filter((item) => item.isOnline)
    .map(
      (item) => `<article class="mini-item">
        <div>
          <h4>${item.name}</h4>
          <span class="muted">${item.durationMinutes} 分钟 · ${yuan(item.price)}</span>
        </div>
        <button class="mini-button" data-mini-book="${item.id}">预约</button>
      </article>`,
    )
    .join("");

  const customer = state.customers[0];
  const orders = state.orders.filter((order) => order.customerId === customer.id);
  document.querySelector("#miniOrderCount").textContent = `${orders.length} 单`;
  document.querySelector("#miniOrderList").innerHTML = orders
    .map((order) => {
      const item = getItem(order.serviceItemId);
      const technician = getStaff(order.technicianId);
      return `<article class="mini-order">
        <h4>${item.name}</h4>
        <p class="muted">${order.appointmentStartAt.slice(5, 16)} · ${technician.name}</p>
        <span class="tag ${order.status === "pending" ? "green" : order.status === "completed" ? "gold" : "red"}">${statusText[order.status]}</span>
      </article>`;
    })
    .join("");
}

function render() {
  document.querySelector("#activeMerchantName").textContent = getMerchant().name;
  renderPlatform();
  renderMerchant();
  renderStaff();
  renderCustomer();
}

function nextId(collection) {
  return Math.max(0, ...collection.map((item) => item.id)) + 1;
}

function addMinutes(dateText, minutes) {
  const date = new Date(dateText.replace(" ", "T"));
  date.setMinutes(date.getMinutes() + minutes);
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
}

function createOrder({ customerId, serviceItemId, technicianId, appointmentStartAt, remark, source }) {
  const item = getItem(serviceItemId);
  const order = {
    id: nextId(state.orders),
    merchantId: 1,
    storeId: 1,
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
  state.orders.push(order);
  state.operationLogs.push({
    id: nextId(state.operationLogs),
    orderId: order.id,
    action: "create",
    operatorStaffId: 1,
    createdAt: new Date().toISOString(),
  });
  return order;
}

function findOrCreateCustomer(name, phone) {
  const existing = state.customers.find((customer) => customer.phone === phone);
  if (existing) return existing;
  const customer = {
    id: nextId(state.customers),
    merchantId: 1,
    homeStoreId: 1,
    name,
    phone,
    gender: "unknown",
    totalSpent: 0,
  };
  state.customers.push(customer);
  return customer;
}

function verifyOrder(orderId, paidAmount, discountAmount, paymentMethod) {
  const order = state.orders.find((item) => item.id === orderId);
  if (!order || order.status !== "pending") return;
  order.status = "completed";
  order.paymentStatus = "paid";
  order.paidAmount = paidAmount;
  order.discountAmount = discountAmount;
  order.paymentMethod = paymentMethod;
  order.verifiedAt = "2026-08-14 16:30:00";
  order.verifiedBy = 1;
  const customer = getCustomer(order.customerId);
  customer.totalSpent += paidAmount;
  state.operationLogs.push({
    id: nextId(state.operationLogs),
    orderId: order.id,
    action: "verify",
    operatorStaffId: 1,
    createdAt: new Date().toISOString(),
  });
}

function bindEvents() {
  document.querySelectorAll(".persona-button").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });

  document.querySelector("#primaryActionButton").addEventListener("click", () => {
    const modal = viewMeta[state.currentView].modal;
    if (modal) openModal(modal);
  });

  document.querySelector("#resetDataButton").addEventListener("click", () => {
    state = structuredClone(initialState);
    render();
    showToast("Mock 数据已重置");
  });

  document.querySelectorAll("[data-open-modal]").forEach((button) => {
    button.addEventListener("click", () => openModal(button.dataset.openModal));
  });

  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", closeModals);
  });

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModals();
    });
  });

  document.querySelector("#calendarViewSelect").addEventListener("change", (event) => {
    state.calendarView = event.target.value;
    renderStaff();
  });

  document.querySelector("#technicianFilter").addEventListener("change", (event) => {
    state.technicianFilter = event.target.value;
    renderStaff();
  });

  document.querySelector("#statusTabs").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    state.calendarStatus = button.dataset.status;
    renderStaff();
  });

  document.querySelector("#timeline").addEventListener("click", (event) => {
    const verifyButton = event.target.closest("[data-verify-order]");
    const cancelButton = event.target.closest("[data-cancel-order]");
    if (verifyButton) {
      const order = state.orders.find((item) => item.id === Number(verifyButton.dataset.verifyOrder));
      const item = getItem(order.serviceItemId);
      const customer = getCustomer(order.customerId);
      document.querySelector("#verifySummary").innerHTML = `<strong>${customer.name} · ${item.name}</strong>
        <span class="muted">预约时间：${order.appointmentStartAt.slice(0, 16)}</span>
        <span class="muted">应收：${yuan(order.totalAmount)}</span>`;
      const form = document.querySelector("#verifyForm");
      form.orderId.value = order.id;
      form.paidAmount.value = order.totalAmount / 100;
      form.discountAmount.value = 0;
      openModal("verifyModal");
    }
    if (cancelButton) {
      const order = state.orders.find((item) => item.id === Number(cancelButton.dataset.cancelOrder));
      order.status = "cancelled";
      order.cancelledReason = "门店员工手动取消";
      render();
      showToast("预约已取消");
    }
  });

  document.querySelector("#merchantForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    state.merchants.push({
      id: nextId(state.merchants),
      name: form.get("name"),
      contactName: form.get("contactName"),
      contactPhone: form.get("contactPhone"),
      packageEnd: form.get("packageEnd"),
      status: "trial",
    });
    closeModals();
    render();
    showToast("商户已创建");
  });

  document.querySelector("#itemForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    state.serviceItems.push({
      id: nextId(state.serviceItems),
      merchantId: 1,
      storeId: 1,
      name: form.get("name"),
      price: Number(form.get("price")) * 100,
      durationMinutes: Number(form.get("duration")),
      isOnline: true,
    });
    closeModals();
    render();
    showToast("服务项目已上架");
  });

  document.querySelector("#orderForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const customer = findOrCreateCustomer(form.get("customerName"), form.get("phone"));
    createOrder({
      customerId: customer.id,
      serviceItemId: Number(form.get("serviceItemId")),
      technicianId: Number(form.get("technicianId")),
      appointmentStartAt: `${form.get("date")} ${form.get("time")}:00`,
      remark: form.get("remark"),
      source: "admin_manual",
    });
    closeModals();
    setView("staff");
    showToast("预约已创建");
  });

  document.querySelector("#verifyForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    verifyOrder(
      Number(form.get("orderId")),
      Math.round(Number(form.get("paidAmount")) * 100),
      Math.round(Number(form.get("discountAmount") || 0) * 100),
      form.get("paymentMethod"),
    );
    closeModals();
    render();
    showToast("订单已核销");
  });

  document.querySelector("#customerView").addEventListener("click", (event) => {
    const bookButton = event.target.closest("[data-mini-book]");
    if (!bookButton) return;
    const customer = state.customers[0];
    const itemId = Number(bookButton.dataset.miniBook);
    createOrder({
      customerId: customer.id,
      serviceItemId: itemId,
      technicianId: 2,
      appointmentStartAt: "2026-08-14 17:00:00",
      remark: "小程序顾客自助预约",
      source: "mini_program",
    });
    render();
    showToast("小程序预约成功");
  });
}

bindEvents();
render();
