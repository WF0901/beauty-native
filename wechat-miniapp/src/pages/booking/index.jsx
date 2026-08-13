import { Button, Picker, Text, View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { useState } from "react";
import ServiceCard from "../../components/ServiceCard";
import { currentMerchant, technicians } from "../../data";
import { addOrder } from "../../store";
import "./index.scss";

const dates = ["8月16日", "8月17日", "8月18日", "8月19日"];
const times = ["10:00", "11:30", "14:00", "15:30", "17:00"];

export default function BookingPage() {
  const [selectedId, setSelectedId] = useState(currentMerchant.services[0].id);
  const [date, setDate] = useState(dates[0]);
  const [time, setTime] = useState(times[2]);
  const [technician, setTechnician] = useState(technicians[0].name);
  useDidShow(() => {
    const storedId = Number(Taro.getStorageSync("selected_service_id"));
    if (currentMerchant.services.some((item) => item.id === storedId)) setSelectedId(storedId);
  });
  const selected = currentMerchant.services.find((item) => item.id === selectedId) || currentMerchant.services[0];

  const submit = () => {
    addOrder(selected, { date, time, technician });
    Taro.showToast({ title: "预约成功", icon: "success" });
    setTimeout(() => Taro.switchTab({ url: "/pages/orders/index" }), 500);
  };

  return (
    <View className="page-shell booking-page">
      <View className="page-header"><Text className="page-header__eyebrow">{currentMerchant.storeName}</Text><Text className="page-header__title">预约到店服务</Text><Text className="page-header__note">选择项目、日期与服务人员</Text></View>
      <View className="section">
        <View className="section-title"><Text className="section-title__main">1. 选择服务</Text></View>
        <View className="service-selector">
          {currentMerchant.services.map((service) => (
            <View className={`service-option card ${selectedId === service.id ? "service-option--active" : ""}`} key={service.id} onClick={() => setSelectedId(service.id)}>
              <View><Text className="service-option__name">{service.name}</Text><Text className="service-option__meta">{service.duration}分钟</Text></View>
              <Text className="service-option__price">¥{service.price}</Text>
            </View>
          ))}
        </View>
      </View>
      <View className="section">
        <View className="section-title"><Text className="section-title__main">2. 选择安排</Text></View>
        <View className="booking-form card">
          <Picker mode="selector" range={dates} value={dates.indexOf(date)} onChange={(event) => setDate(dates[event.detail.value])}>
            <View className="picker-row"><Text>预约日期</Text><Text>{date} ›</Text></View>
          </Picker>
          <Picker mode="selector" range={times} value={times.indexOf(time)} onChange={(event) => setTime(times[event.detail.value])}>
            <View className="picker-row"><Text>到店时间</Text><Text>{time} ›</Text></View>
          </Picker>
          <Picker mode="selector" range={technicians.map((item) => item.name)} value={technicians.findIndex((item) => item.name === technician)} onChange={(event) => setTechnician(technicians[event.detail.value].name)}>
            <View className="picker-row"><Text>服务人员</Text><Text>{technician} ›</Text></View>
          </Picker>
        </View>
      </View>
      <View className="booking-submit card"><View><Text className="booking-submit__label">预约金额</Text><Text className="booking-submit__price">¥{selected.price}</Text></View><Button className="primary-button" onClick={submit}>确认预约</Button></View>
    </View>
  );
}
