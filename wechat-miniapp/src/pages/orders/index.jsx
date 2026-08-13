import { Button, Text, View } from "@tarojs/components";
import Taro, { useDidShow, usePullDownRefresh } from "@tarojs/taro";
import { useState } from "react";
import { getOrders } from "../../store";
import "./index.scss";

const filters = ["全部", "待到店", "已完成", "已取消"];

export default function OrdersPage() {
  const [filter, setFilter] = useState("全部");
  const [orders, setOrders] = useState([]);
  const refresh = () => setOrders(getOrders());
  useDidShow(refresh);
  usePullDownRefresh(() => {
    refresh();
    Taro.stopPullDownRefresh();
  });
  const visibleOrders = filter === "全部" ? orders : orders.filter((order) => order.status === filter);

  return (
    <View className="page-shell orders-page">
      <View className="page-header"><Text className="page-header__eyebrow">服务进度</Text><Text className="page-header__title">我的订单</Text><Text className="page-header__note">下拉页面可以刷新预约状态</Text></View>
      <View className="order-filters">
        {filters.map((item) => <Button className={filter === item ? "active" : ""} key={item} onClick={() => setFilter(item)}>{item}</Button>)}
      </View>
      <View className="order-list">
        {visibleOrders.map((order) => (
          <View className="order-card card" key={order.id}>
            <View className="order-card__top"><Text className="order-card__name">{order.serviceName}</Text><Text className={`order-card__status order-card__status--${order.status}`}>{order.status}</Text></View>
            <View className="order-card__details"><View><Text>到店时间</Text><Text>{order.date} {order.time}</Text></View><View><Text>服务人员</Text><Text>{order.technician}</Text></View><View><Text>订单金额</Text><Text>¥{order.price}</Text></View></View>
            <View className="order-card__actions">
              {order.status === "待到店" && <Button className="secondary-button" onClick={() => Taro.showModal({ title: "联系门店", content: "如需改期或取消，请联系门店前台。", confirmText: "拨打电话" }).then((result) => result.confirm && Taro.makePhoneCall({ phoneNumber: "0571-88881234" }))}>改期 / 取消</Button>}
              <Button className="primary-button" onClick={() => Taro.showToast({ title: "详情功能准备中", icon: "none" })}>查看详情</Button>
            </View>
          </View>
        ))}
        {!visibleOrders.length && <View className="empty-state">当前没有{filter === "全部" ? "" : filter}订单</View>}
      </View>
    </View>
  );
}
