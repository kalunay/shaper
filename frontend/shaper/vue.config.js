const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    allowedHosts: 'all',
    client: {
      overlay: {
        warnings: false,
        errors: false,
      },
    }
  }
})
