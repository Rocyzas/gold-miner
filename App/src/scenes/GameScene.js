import { gameConfig } from "../config/gameConfig.js";
// import { createItems } from "../components/createRandomItems.js";
import { createItems } from "../components/createFixedItems.js";

import Rope from "../components/Rope.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  init(data) {
    this.score = data.score || 0;
    this.level = data.level || 1;
    this.upgrades = data.upgrades || { strength: false, rockMiner: false, luck: false, dynamiteCount: 0 };
    this.goal = data.goal || gameConfig.initialMoneyGoal;
  }

  preload() {
    this.load.image('miner', '../../assets/miner.png');
    this.load.image('gold', '../../assets/gold.jpeg');
    this.load.image('rock', '../../assets/rock.jpg');
    this.load.image('bag', '../../assets/bag.png');
    this.load.image('dynamit', 'assets/dynamit.png'); // Preload dynamite
  }

  create() {
    // Miner sprite
    this.add.image(400, 50, 'miner').setScale(0.1);

    // Score, goal, timer
    this.scoreText = this.add.text(20, 20, `Score: ${this.score}`, {
      fontSize: '24px',
      color: '#fff'
    });

    this.goalText = this.add.text(20, 50, `Goal: ${this.goal}`, {
      fontSize: '20px',
      color: '#ff0'
    });

    this.timerText = this.add.text(650, 20, `Time: 30`, {
      fontSize: '24px',
      color: '#fff'
    });

    this.timeLeft = 30;
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timeLeft--;
        this.timerText.setText(`Time: ${this.timeLeft}`);
        if (this.timeLeft <= 0) {
          if (this.score < this.goal) {
            this.scene.start('GameOverScene', { score: this.score });
          } else {
            this.scene.start('ShopScene', {
              score: this.score,
              level: this.level,
              upgrades: this.upgrades,
              goal: Math.floor(this.goal * 1.5)
            });
          }
        }
      },
      callbackScope: this,
      loop: true
    });

    // Create items in random grid
    const randomRows = Phaser.Math.Between(5, 10);
    const randomCols = Phaser.Math.Between(5, 10);
    this.items = createItems(this, randomRows, randomCols);

    // Create rope
    this.rope = new Rope(this, this.upgrades);

    // Dynamite counter text
    this.dynamiteText = this.add.text(500, 20, `Dynamite: ${this.upgrades.dynamiteCount}`, {
      fontSize: '20px',
      color: '#fff'
    });
  }

  update() {
    this.rope.update(this.items, scoreDelta => {
      this.score += scoreDelta;
      this.scoreText.setText(`Score: ${this.score}`);
    }, remainingDynamite => {
      // Update dynamite counter when rope consumes one
      this.upgrades.dynamiteCount = remainingDynamite;
      this.dynamiteText.setText(`Dynamite: ${this.upgrades.dynamiteCount}`);
    });
  }
}
