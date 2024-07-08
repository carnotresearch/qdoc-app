const { override, addWebpackResolve } = require("customize-cra");

module.exports = override(
  addWebpackResolve({
    fallback: {
      util: require.resolve("util/"),
      buffer: require.resolve("buffer/"),
    },
  })
);
