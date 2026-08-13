import { Button, Image, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./ServiceCard.scss";

export default function ServiceCard({ service, compact = false }) {
  const openBooking = () => {
    Taro.setStorageSync("selected_service_id", service.id);
    Taro.switchTab({ url: "/pages/booking/index" });
  };

  return (
    <View className={`service-card card ${compact ? "service-card--compact" : ""}`}>
      <Image className="service-card__image" src={service.image} mode="aspectFill" />
      <View className="service-card__body">
        <Text className="service-card__name">{service.name}</Text>
        <View className="service-card__tags">
          {service.tags.map((tag) => <Text className="service-card__tag" key={tag}>{tag}</Text>)}
        </View>
        <View className="service-card__footer">
          <View>
            <Text className="service-card__price">¥{service.price}</Text>
            <Text className="service-card__duration"> / {service.duration}分钟</Text>
          </View>
          <Button className="service-card__button" onClick={openBooking}>预约</Button>
        </View>
      </View>
    </View>
  );
}
