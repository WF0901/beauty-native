import Taro from "@tarojs/taro";
import { initialOrders } from "./data";

const ORDER_KEY = "service_orders";

export function getOrders() {
  return Taro.getStorageSync(ORDER_KEY) || initialOrders;
}

export function addOrder(service, details = {}) {
  const orders = getOrders();
  const order = {
    id: Date.now(),
    serviceId: service.id,
    serviceName: service.name,
    technician: details.technician || "到店安排",
    date: details.date || "8月16日",
    time: details.time || "14:00",
    status: "待到店",
    price: service.price,
  };
  Taro.setStorageSync(ORDER_KEY, [order, ...orders]);
  return order;
}

export function resetOrders() {
  Taro.setStorageSync(ORDER_KEY, initialOrders);
}
