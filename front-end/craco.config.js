const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { "@primary-color": "#1890ff", "@max-width": "820px" },
            javascriptEnabled: true,
            url: false,
          },
        },
      },
    },
  ],
};
