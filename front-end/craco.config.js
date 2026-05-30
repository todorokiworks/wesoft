const CracoLessPlugin = require("craco-less");

const basePath = (() => {
  const raw = process.env.REACT_APP_BASE_PATH?.trim();
  if (raw) {
    return raw.startsWith("/") ? raw : `/${raw}`;
  }
  if (process.env.NODE_ENV === "development") {
    return "";
  }
  return "";
})();

const publicPath = (() => {
  const raw = process.env.PUBLIC_URL?.trim();
  if (raw && raw !== "/") {
    return raw.endsWith("/") ? raw : `${raw}/`;
  }
  return basePath ? `${basePath}/` : "/";
})();

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.output.publicPath = publicPath;
      return webpackConfig;
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#1890ff",
              "@max-width": "820px",
            },
            javascriptEnabled: true,
            url: false,
          },
        },
      },
    },
  ],
};
