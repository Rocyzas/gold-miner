import { gameConfig } from "../config/gameConfig.js";
import { createRandomItems } from "../components/backgroundFill.js";
import Rope from "../components/rope.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  init(data) {
    this.score = data.score || 0;
    this.level = data.level || 1;
    this.upgrades = data.upgrades || { strength: false, rockMiner: false };
    this.goal = data.goal || gameConfig.initialMoneyGoal;
  }

  preload() {
    this.load.image('miner', '../../assets/miner.png');
    this.load.image('gold', '../../assets/gold.jpeg');
    this.load.image('rock', '../../assets/rock.jpg');
    this.load.image('bag', '../../assets/bag.png');
  }

  create() {
    this.add.image(400, 50, 'miner').setScale(0.1);

    this.scoreText = this.add.text(20, 20, `Score: ${this.score}`, {
      fontSize: '24px',
      color: '#fff'
    });

    this.goalText = this.add.text(20, 50, `Goal: ${this.goal}`, {
      fontSize: '20px',
      color: '#ff0'
    });

    this.timeLeft = 30; // increase round time as needed
    this.timerText = this.add.text(650, 20, `Time: ${this.timeLeft}`, {
      fontSize: '24px',
      color: '#fff'
    });

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timeLeft--;
        this.timerText.setText(`Time: ${this.timeLeft}`);
        if (this.timeLeft <= 0) {
          // Check if goal met, else game over
          if (this.score < this.goal) {
            this.scene.start('GameOverScene', { score: this.score });
          } else {
            this.scene.start('ShopScene', {
              score: this.score,
              level: this.level,
              upgrades: this.upgrades,
              goal: this.goal
            });
          }
        }
      },
      callbackScope: this,
      loop: true
    });

    // Randomize rows and columns for background items
    const randomRows = Phaser.Math.Between(5, 10); // Random rows between 5 and 10
    const randomCols = Phaser.Math.Between(5, 10); // Random columns between 5 and 10

    // Create randomized items
    this.items = createRandomItems(this, randomRows, randomCols);

    this.rope = new Rope(this, this.upgrades);
  }

  update() {
    this.rope.update(this.items, scoreDelta => {
      this.score += scoreDelta;
      this.scoreText.setText(`Score: ${this.score}`);
    });
  }
}
