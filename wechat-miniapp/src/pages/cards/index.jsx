import { Button, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { currentMerchant } from "../../data";
import "./index.scss";

export default function CardsPage() {
  return (
    <View className="page-shell cards-page">
      <View className="member-profile">
        <View className="member-profile__avatar">赵</View>
        <View><Text className="member-profile__name">赵女士</Text><Text className="member-profile__level">悦享会员 · {currentMerchant.name}</Text></View>
        <Text className="member-profile__code">会员码</Text>
      </View>
      <View className="wallet-balance">
        <Text>储值余额</Text><Text className="wallet-balance__value">¥328.00</Text><Text className="wallet-balance__note">商户下所有门店通用</Text>
        <Button onClick={() => Taro.showToast({ title: "充值功能将在支付接入后开放", icon: "none" })}>立即充值</Button>
      </View>
      <View className="section">
        <View className="section-title"><Text className="section-title__main">我的次卡</Text><Text className="section-title__link">1张</Text></View>
        <View className="count-card card"><View><Text className="count-card__name">面部护理次卡</Text><Text className="count-card__valid">有效期至 2026-12-31</Text></View><View className="count-card__times"><Text>剩余</Text><Text>4次</Text></View></View>
      </View>
      <View className="section">
        <View className="section-title"><Text className="section-title__main">优惠券</Text><Text className="section-title__link">2张可用</Text></View>
        <View className="coupon-card card"><View className="coupon-card__amount"><Text>¥30</Text><Text>满200可用</Text></View><View className="coupon-card__detail"><Text>会员护理优惠券</Text><Text>有效期至 2026-09-30</Text></View><Button onClick={() => Taro.switchTab({ url: "/pages/booking/index" })}>去使用</Button></View>
      </View>
      <View className="card-tip">权益数据属于当前商户，可在同一商户的不同门店累计与使用。</View>
    </View>
  );
}
