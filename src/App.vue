<template>
  <div id="app">
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    HelloWorld
  },

  data () {
    return {
      'engine': window.engine,
      'app': {},
    }
  },

  mounted () {
    this.initApp();
  },

  methods: {
    initApp ()
    {
      this.engine = window.Q = Quintus({development: true})
        .include("Sprites, Scenes, Input, 2D, Touch, UI, Audio")
        .setup({
          width: 320,
          height: 480
        })
        .touch();

      //enable sound, this will find the best way to play audio according to the device
      this.engine.enableSound();

      //values for collision detection
      this.engine.SPRITE_NONE = 0;
      this.engine.SPRITE_RACER = 1;
      this.engine.SPRITE_OTHER = 2;

      Q.scene("level", (stage) => {
        var collisionLayer = new Q.TileLayer({ dataAsset: 'level_collision.json', sheet: 'tiles', type: Q.SPRITE_OTHER});
        var backgroundLayer = new Q.TileLayer({ dataAsset: 'level_background.json', sheet: 'tiles', type: Q.SPRITE_NONE});

        //add these elements to the stage
        stage.collisionLayer(collisionLayer);
        stage.insert(backgroundLayer);

//        //load level assets from options, this inserts each element
//        stage.loadAssets(stage.options.elements);
//
//        //find the player
//        var player = Q('Player').first();
//
//        //set game variables
//        Q.state.set(stage.options.mathOperations);
//
//        stage.add("viewport")
//                .follow(player,{x: true, y: true},{minX: 0, maxX: backgroundLayer.p.w, minY: 0, maxY: backgroundLayer.p.h});
      });

      this.engine.load(
        "sprites.png, sprites.json, level_collision.json, level_background.json, tiles.png, boom.mp3, win.mp3",
        this.handleEngineLoaded
      );

    },

    handleEngineLoaded () {
      this.engine.sheet("tiles","tiles.png", { tilew: 32, tileh: 32 });
      this.engine.compileSheets("sprites.png","sprites.json");

      this.engine.stageScene("level", {
        elements: [
          ['Rival', {x: 0, y: 130, sheet: 'bluerival'}],
          ['Rival', {x: 0, y: 130, sheet: 'greenrival'}],
          ['Rival', {x: 0, y: 130, sheet: 'purplerival'}],
          ['Princess', {x: 2000, y: 130}],
          ['Player', {x: 0, y: 130, vx: 50}],
        ],
        mathOperations: {operations_min: 0, operations_max: 10}
      });
      this.engine.stageScene("ui",1);
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
