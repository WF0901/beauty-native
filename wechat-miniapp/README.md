# 微信小程序顾客端

这是基于 Taro React 的真实微信小程序工程，包含首页、AI 顾问、预约、订单和卡包五个 Tab。

## 在微信开发者工具中预览

1. 打开微信开发者工具，选择“导入项目”。
2. 项目目录选择本文件夹 `wechat-miniapp`，AppID 使用测试号即可。
3. 导入后点击“编译”；点击顶部“预览”会生成手机微信扫码二维码。

`project.config.json` 已将小程序目录指向 `dist/`，无需单独选择构建产物目录。

## 重新构建

在仓库根目录执行：

```bash
pnpm run build:weapp
```

开发监听模式：

```bash
pnpm run dev:weapp
```

当前为纯前端 Mock，预约记录保存在微信本地存储中。接入后端后，将 `src/data.js` 和 `src/store.js` 替换为商户上下文与 API 请求即可。
