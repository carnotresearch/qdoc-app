const { override, addWebpackResolve } = require("customize-cra");

module.exports = function override(config, env) {
  config.module.rules.push({
    test: /\.mjs$/,
    include: /node_modules/,
    type: "javascript/auto",
  });
  return config;
};
module.exports = override(
  addWebpackResolve({
    fallback: {
      util: require.resolve("util/"),
      buffer: require.resolve("buffer/"),
    },
  })
);
