import GameScene from './src/scenes/GameScene.js';
import ShopScene from './src/scenes/ShopScene.js';
import GameOverScene from './src/scenes/GameOverScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#87CEEB',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: [GameScene, ShopScene, GameOverScene]
};

new Phaser.Game(config);
