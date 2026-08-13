const config = {
  projectName: "store-service-wechat-miniapp",
  date: "2026-08-13",
  designWidth: 750,
  deviceRatio: {
    375: 2,
    750: 1,
  },
  sourceRoot: "src",
  outputRoot: "dist",
  framework: "react",
  compiler: "webpack5",
  copy: {
    patterns: [
      {
        from: "../public/images/beauty-service.jpg",
        to: "dist/images/beauty-service.jpg",
      },
    ],
    options: {},
  },
  cache: {
    enable: true,
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: false,
      },
    },
  },
};

module.exports = function mergeConfig(merge) {
  if (process.env.NODE_ENV === "development") {
    return merge({}, config, require("./dev"));
  }
  return merge({}, config, require("./prod"));
};
