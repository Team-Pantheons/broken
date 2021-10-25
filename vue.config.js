module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "https://resource.staked.store/" : "/",
  assetsDir: 'polkaproject',
  outputDir:'../boka-network/polkaproject',
  configureWebpack: {
    resolve: {
      // .mjs needed for https://github.com/graphql/graphql-js/issues/1272
      extensions: ["*", ".mjs", ".js", ".vue", ".json", ".gql", ".graphql"],
      alias: {
        static: "public/polkaproject",
        vue$: "vue/dist/vue.esm.js",
      },
    },
    module: {
      rules: [
        // fixes https://github.com/graphql/graphql-js/issues/1272
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto",
        },
      ],
    },
  },
  devServer: {
    port: "8081",
  },
};
