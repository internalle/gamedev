import Vue from 'vue'
import App from './App.vue'

window.engine = Quintus({development: true})
    .include("Sprites, Scenes, Input, 2D, Touch, UI, Audio")
    .setup({
      width: 320,
      height: 480
    }).touch();

Vue.config.productionTip = false

new Vue({
  el: '#app',	
  render: h => h(App)
});
