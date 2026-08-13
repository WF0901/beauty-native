export const merchants = {
  beauty: {
    id: 1,
    name: "有赞测试美容",
    storeName: "杭州西湖店",
    hours: "09:00-21:00",
    phone: "0571-88881234",
    industry: "beauty",
    hero: "/images/beauty-service.jpg",
    quickQuestions: ["毛孔比较明显", "皮肤干还泛红", "最近脸色暗沉"],
    services: [
      { id: 1, name: "面部深层清洁", price: 128, duration: 60, tags: ["深层清洁", "毛孔护理"], image: "/images/beauty-service.jpg" },
      { id: 2, name: "敏感舒缓修护", price: 168, duration: 90, tags: ["深层补水", "敏感修护"], image: "/images/beauty-service.jpg" },
      { id: 3, name: "水光修护护理", price: 198, duration: 75, tags: ["深层补水", "提亮肤色"], image: "/images/beauty-service.jpg" }
    ]
  },
  massage: {
    id: 2,
    name: "清颜健康管理",
    storeName: "上海静安店",
    hours: "10:00-22:00",
    phone: "021-68881234",
    industry: "massage",
    hero: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=80",
    quickQuestions: ["肩颈很僵硬", "久坐腰背不舒服", "最近疲劳想放松"],
    services: [
      { id: 4, name: "肩颈舒缓放松", price: 198, duration: 60, tags: ["肩颈酸痛", "肌肉僵硬"], image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=480&q=80" },
      { id: 5, name: "全身经络舒压", price: 268, duration: 90, tags: ["疲劳乏力", "全身放松"], image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=480&q=80" }
    ]
  }
};

export const currentMerchant = merchants.beauty;

export const technicians = [
  { id: 2, name: "王老师", specialty: "皮肤管理" },
  { id: 3, name: "周老师", specialty: "舒缓修护" }
];

export const initialOrders = [
  { id: 1, serviceId: 1, serviceName: "面部深层清洁", technician: "王老师", date: "8月14日", time: "10:00", status: "待到店", price: 128 },
  { id: 2, serviceId: 2, serviceName: "敏感舒缓修护", technician: "周老师", date: "8月10日", time: "14:00", status: "已完成", price: 168 }
];

export function getRecommendation(query, services = currentMerchant.services) {
  const rules = [
    { words: ["毛孔", "黑头", "出油", "清洁"], tags: ["深层清洁", "毛孔护理"] },
    { words: ["干", "泛红", "敏感", "补水"], tags: ["深层补水", "敏感修护"] },
    { words: ["暗沉", "提亮"], tags: ["提亮肤色"] },
    { words: ["肩颈", "脖子", "僵硬"], tags: ["肩颈酸痛", "肌肉僵硬"] },
    { words: ["疲劳", "放松", "没劲"], tags: ["疲劳乏力", "全身放松"] }
  ];
  const tags = rules.filter((rule) => rule.words.some((word) => query.includes(word))).flatMap((rule) => rule.tags);
  const ranked = services
    .map((service) => ({ service, score: service.tags.filter((tag) => tags.includes(tag)).length }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
  return ranked[0]?.service || services[0];
}
