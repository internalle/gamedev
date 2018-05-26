<template>
  <div id="app">
  </div>
</template>

<script>
import Modules from './config/modules';
import Setup from './config/setup';
import Assets from './config/assets';

export default {
  name: 'app',

  components: {

  },

  data () {
    return {
      'engine': {},
      'level_elements': [
          ['Rival', {x: 0, y: 130, sheet: 'bluerival'}],
          ['Rival', {x: 0, y: 130, sheet: 'greenrival'}],
          ['Rival', {x: 0, y: 130, sheet: 'purplerival'}],
          ['Princess', {x: 2000, y: 130}],
          ['Player', {x: 0, y: 130, vx: 50}],
      ]
    }
  },

  mounted () {
    this.loadEngine();
    this.initApp();
  },

  methods: {

    initApp ()
    {
      this.loadFirstLevel();
      this.loadEndGameLevel();

      this.engine.load(Assets, this.handleEngineLoaded);
    },

    handleEngineLoaded () {
      this.engine.sheet("tiles", Assets[4], { tilew: 32, tileh: 32 });
      this.engine.compileSheets(Assets[0], Assets[1]);

      this.engine.stageScene("level", {
        elements: this.level_elements,
        mathOperations: {operations_min: 0, operations_max: 10}
      });

      this.engine.stageScene("ui",1);
    },

    loadEngine () {
      this.engine = window.Q = Quintus({development: true})
              .include(Modules)
              .setup(Setup)
              .touch();

      //enable sound, this will find the best way to play audio according to the device
      this.engine.enableSound();

      //values for collision detection
      this.engine.SPRITE_NONE = 0;
      this.engine.SPRITE_RACER = 1;
      this.engine.SPRITE_OTHER = 2;
    },

    loadFirstLevel () {
      Q.scene("level", (stage) => {
        const collisionLayer = new Q.TileLayer({ dataAsset: Assets[2], sheet: 'tiles', type: Q.SPRITE_OTHER});
        const backgroundLayer = new Q.TileLayer({ dataAsset: Assets[3], sheet: 'tiles', type: Q.SPRITE_NONE});

        //add these elements to the stage
        stage.collisionLayer(collisionLayer);
        stage.insert(backgroundLayer);

        //load level assets from options, this inserts each element
        stage.loadAssets(stage.options.elements);

        //find the player
        const player = Q('Player').first();


        //set game variables
        Q.state.set(stage.options.mathOperations);

        stage.add("viewport")
                .follow(player,{x: true, y: true},{minX: 0, maxX: backgroundLayer.p.w, minY: 0, maxY: backgroundLayer.p.h});
      });
    },

    loadEndGameLevel () {
      Q.scene('endGame', (stage) => {
        const box = stage.insert(new Q.UI.Container({
          x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
        }));

        const button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC", label: "Play Again" }));
        const label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, label: stage.options.label }));

        button.on("click",function() {
          //find stage in index 0, grab it's options
          var stageOptions = Q.stages[0].options;
          Q.stageScene("level", stageOptions);
          Q.stageScene("ui",1);
          stage.stop();
        });

        box.fit(20);
      });
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
