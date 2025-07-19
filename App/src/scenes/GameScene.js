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
    const defaultUpgrades = { strength: false, rockMiner: false, luck: false, dynamiteCount: 0 };
    this.upgrades = { ...defaultUpgrades, ...(data.upgrades || {}) };
    this.goal = data.goal || gameConfig.initialMoneyGoal;
  }
  

  preload() {
    this.load.image('miner', '../../assets/miner.png');
    this.load.image('gold', '../../assets/gold.png');
    this.load.image('rock', '../../assets/rock.jpg');
    this.load.image('bag', '../../assets/bag.png');
    this.load.image('dynamit', 'assets/dynamite.jpg'); // Preload dynamite
    this.load.image('background', '../../assets/background.png');
    this.load.image('ropeTexture', '../../assets/rope.avif');
    this.load.image('hookImage', '../../assets/hook.jpg');
  }

  create() {
    this.add.image(400, 300, 'background')
      .setOrigin(0.5, 0.5)
      .setDisplaySize(this.scale.width, this.scale.height)
      .setDepth(-1);

    // Miner sprite
    this.add.image(400, 180, 'miner').setScale(0.3);

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
          this.finishLevel();
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

    // Add Finish Level Early button
    this.finishButton = this.add.text(650, 50, 'Finish Level Early', {
      fontSize: '18px',
      color: '#0f0',
      backgroundColor: '#000',
      padding: { x: 10, y: 5 },
      borderRadius: 5
    })
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => this.finishLevel());
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

  finishLevel() {
    if (this.score < this.goal) {
      this.scene.start('GameOverScene', { score: this.score });
    } else {
      this.scene.start('ShopScene', {
        score: this.score,
        level: this.level,
        upgrades: {
          strength: false,
          rockMiner: false,
          luck: false,
          dynamiteCount: this.upgrades.dynamiteCount
        },
        goal: Math.floor(this.goal * 1.5)
      });
    }
  }
}
