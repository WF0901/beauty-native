import { Button, Image, Text, View } from "@tarojs/components";
import Taro, { useLoad, useShareAppMessage } from "@tarojs/taro";
import ServiceCard from "../../components/ServiceCard";
import { currentMerchant } from "../../data";
import "./index.scss";

export default function HomePage() {
  useLoad(() => {
    Taro.setNavigationBarTitle({ title: currentMerchant.storeName });
  });
  useShareAppMessage(() => ({
    title: `${currentMerchant.storeName}在线预约`,
    path: "/pages/home/index",
  }));

  return (
    <View className="page-shell home-page">
      <View className="home-hero">
        <Image className="home-hero__image" src={currentMerchant.hero} mode="aspectFill" />
        <View className="home-hero__shade" />
        <View className="home-hero__content">
          <Text className="home-hero__store">{currentMerchant.storeName}</Text>
          <Text className="home-hero__title">预约你的下一次到店服务</Text>
          <Text className="home-hero__hours">营业时间 {currentMerchant.hours}</Text>
        </View>
      </View>

      <View className="member-overview card">
        <View><Text>会员余额</Text><Text className="member-overview__value">¥328</Text></View>
        <View><Text>可用券</Text><Text className="member-overview__value">2张</Text></View>
        <View><Text>次卡</Text><Text className="member-overview__value">4次</Text></View>
      </View>

      <View className="ai-entry" onClick={() => Taro.switchTab({ url: "/pages/advisor/index" })}>
        <View className="ai-entry__mark">AI</View>
        <View className="ai-entry__copy">
          <Text className="ai-entry__title">不知道选什么？问问 AI 服务顾问</Text>
          <Text className="ai-entry__note">描述你的需求，只推荐本店在售项目</Text>
        </View>
        <Text className="ai-entry__arrow">›</Text>
      </View>

      <View className="section">
        <View className="section-title">
          <Text className="section-title__main">热门服务</Text>
          <Text className="section-title__link" onClick={() => Taro.switchTab({ url: "/pages/booking/index" })}>查看全部</Text>
        </View>
        {currentMerchant.services.map((service) => <ServiceCard service={service} key={service.id} />)}
      </View>

      <View className="contact-strip">
        <View><Text className="contact-strip__title">需要人工帮助</Text><Text className="contact-strip__note">门店前台为你确认时间和项目</Text></View>
        <Button className="secondary-button" onClick={() => Taro.makePhoneCall({ phoneNumber: currentMerchant.phone })}>联系门店</Button>
      </View>
    </View>
  );
}
