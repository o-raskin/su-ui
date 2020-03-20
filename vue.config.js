module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    proxy: 'http://localhost:8099/***',
    port: 4040
  }
}