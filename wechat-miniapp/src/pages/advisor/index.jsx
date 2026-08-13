import { Button, Input, ScrollView, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useState } from "react";
import { currentMerchant, getRecommendation } from "../../data";
import "./index.scss";

const welcome = {
  id: 1,
  role: "assistant",
  text: `你好，我是${currentMerchant.storeName}的 AI 服务顾问。告诉我你想改善什么问题，我会从本店在售项目中为你推荐。`,
};

export default function AdvisorPage() {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([welcome]);

  const send = (content = draft) => {
    const query = content.trim();
    if (!query) return;
    const hasRisk = ["发烧", "出血", "剧痛", "伤口", "过敏休克"].some((word) => query.includes(word));
    const service = getRecommendation(query);
    const answer = hasRisk
      ? { id: Date.now() + 1, role: "assistant", risk: true, text: "你描述的情况可能不适合直接接受到店服务，建议先停止预约并咨询正规医疗机构。需要时可以联系门店人工客服确认。" }
      : { id: Date.now() + 1, role: "assistant", text: `根据你的描述，我优先匹配了「${service.name}」。它与${service.tags.join("、")}更相关，你可以先查看项目再决定是否预约。`, service };
    setMessages((current) => [...current, { id: Date.now(), role: "user", text: query }, answer]);
    setDraft("");
  };

  const book = (service) => {
    Taro.setStorageSync("selected_service_id", service.id);
    Taro.switchTab({ url: "/pages/booking/index" });
  };

  return (
    <View className="advisor-page">
      <View className="advisor-profile">
        <View className="advisor-profile__avatar">AI</View>
        <View><Text className="advisor-profile__name">AI 服务顾问</Text><Text className="advisor-profile__note">只推荐{currentMerchant.storeName}在售项目</Text></View>
        <Button className="advisor-profile__human" onClick={() => Taro.makePhoneCall({ phoneNumber: currentMerchant.phone })}>人工</Button>
      </View>
      <View className="advisor-safety">建议仅供服务选择参考，不提供医疗诊断</View>
      <ScrollView className="message-list" scrollY scrollIntoView={`message-${messages.at(-1).id}`}>
        {messages.map((message) => (
          <View id={`message-${message.id}`} className={`message message--${message.role}`} key={message.id}>
            {message.role === "assistant" && <View className="message__avatar">AI</View>}
            <View className={`message__bubble ${message.risk ? "message__bubble--risk" : ""}`}>
              <Text>{message.text}</Text>
              {message.service && (
                <View className="recommendation-card">
                  <Text className="recommendation-card__badge">为你推荐</Text>
                  <Text className="recommendation-card__name">{message.service.name}</Text>
                  <Text className="recommendation-card__meta">{message.service.duration}分钟 · ¥{message.service.price}</Text>
                  <Button className="primary-button" onClick={() => book(message.service)}>立即预约</Button>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
      {messages.length === 1 && (
        <ScrollView className="quick-list" scrollX>
          {currentMerchant.quickQuestions.map((question) => <Button key={question} onClick={() => send(question)}>{question}</Button>)}
        </ScrollView>
      )}
      <View className="composer">
        <Input value={draft} onInput={(event) => setDraft(event.detail.value)} confirmType="send" onConfirm={() => send()} placeholder="描述你的需求或不适" />
        <Button onClick={() => send()}>发送</Button>
      </View>
    </View>
  );
}
