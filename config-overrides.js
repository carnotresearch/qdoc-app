const { override, addWebpackResolve } = require("customize-cra");

module.exports = override(
  (config) => {
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });
    return config;
  },
  addWebpackResolve({
    fallback: {
      util: require.resolve("util/"),
      buffer: require.resolve("buffer/"),
    },
  })
);

// Export devServer settings correctly
module.exports.devServer = function (config) {
  config.headers = {
    "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
  };
  return config;
};
