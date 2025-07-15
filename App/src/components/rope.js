import { gameConfig } from "../config/gameConfig.js";

export default class Rope {
  constructor(scene, upgrades) {
    this.scene = scene;
    this.upgrades = upgrades || {};

    this.defaultExtendSpeed = gameConfig.initialSpeed;

    this.ropeLength = 60;
    this.ropeMaxLength = 600;

    this.ropeAngle = 0;
    this.ropeSwingSpeed = 1;
    this.ropeSwingDirection = 1;

    this.ropeState = 'swing';
    this.hookedItem = null;

    this.graphics = scene.add.graphics({ lineStyle: { width: 2, color: 0x000000 } });

    scene.input.keyboard.on('keydown-SPACE', () => {
      if (this.ropeState === 'swing') {
        this.ropeState = 'extend';
      }
    });

    // Dynamite stock
    this.dynamiteStock = this.upgrades.dynamiteCount || 0;

    // Create a dynamite sprite to animate throw
    this.dynamiteSprite = scene.add.sprite(450, 50, 'dynamit').setScale(0.1).setVisible(false);

    this.bombKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
  }

  throwDynamite() {
    this.dynamiteStock--;
    this.scene.tweens.add({
      targets: this.dynamiteSprite,
      x: this.hookedItem.x,
      y: this.hookedItem.y,
      duration: 500,
      onStart: () => {
        this.dynamiteSprite.setPosition(450, 50).setVisible(true);
      },
      onComplete: () => {
        this.dynamiteSprite.setVisible(false);
        this.useBomb();
      }
    });
  }

  useBomb() {
    if (this.hookedItem) {
      this.hookedItem.destroy();
      this.hookedItem = null;
    }
    this.ropeState = 'retract';
  }

  update(items, updateScoreCb, updateDynamiteCb) {
    // Handle B key press
    if (Phaser.Input.Keyboard.JustDown(this.bombKey)) {
      if (this.hookedItem && this.dynamiteStock > 0) {
        this.throwDynamite();
        if (updateDynamiteCb) {
          updateDynamiteCb(this.dynamiteStock);
        }
      }
    }

    if (this.ropeState === 'swing') {
      this.ropeAngle += this.ropeSwingSpeed * this.ropeSwingDirection;
      if (this.ropeAngle > 60 || this.ropeAngle < -60) {
        this.ropeSwingDirection *= -1;
      }
    }

    const hookX = 400 + this.ropeLength * Math.sin(Phaser.Math.DegToRad(this.ropeAngle));
    const hookY = 50 + this.ropeLength * Math.cos(Phaser.Math.DegToRad(this.ropeAngle));

    if (this.ropeState === 'extend') {
      this.ropeLength += this.defaultExtendSpeed;

      items.getChildren().forEach(item => {
        const dist = Phaser.Math.Distance.Between(hookX, hookY, item.x, item.y);
        if (dist < 20 && !this.hookedItem) {
          this.hookedItem = item;
          this.ropeState = 'retract';
        }
      });

      if (this.ropeLength >= this.ropeMaxLength && !this.hookedItem) {
        this.ropeState = 'retract';
      }
    } 
    else if (this.ropeState === 'retract') {
      let retractSpeed;

      if (this.hookedItem) {
        retractSpeed = this.hookedItem.getData('pickupSpeed') || gameConfig.initialSpeed;

        if (this.upgrades.strength) {
          retractSpeed *= (gameConfig.strengthMultiplier || 2);
        }
      } else {
        retractSpeed = gameConfig.initialSpeed;
      }

      this.ropeLength -= retractSpeed;

      if (this.hookedItem) {
        const hookX = 400 + this.ropeLength * Math.sin(Phaser.Math.DegToRad(this.ropeAngle));
        const hookY = 50 + this.ropeLength * Math.cos(Phaser.Math.DegToRad(this.ropeAngle));
        this.hookedItem.setPosition(hookX, hookY);
      }

      if (this.hookedItem) {
        let scoreToAdd;

        if (this.hookedItem.getData('type') === 'bag') {
          if (this.upgrades.luck) {
            scoreToAdd = Phaser.Math.Between(50, 250);
          } else {
            scoreToAdd = Phaser.Math.Between(0, 200);
          }
        } else {
          scoreToAdd = this.hookedItem.getData('score');

          if (
            this.hookedItem.getData('type') === 'rock' &&
            this.upgrades.rockMiner
          ) {
            scoreToAdd *= 2;
          }
        }

        if (this.ropeLength <= 50) {
          updateScoreCb(scoreToAdd);
          this.hookedItem.destroy();
          this.hookedItem = null;
          this.ropeState = 'swing';
        }
      }

      if (this.ropeLength <= 50 && !this.hookedItem) {
        this.ropeLength = 50;
        this.ropeState = 'swing';
      }
    }

    this.graphics.clear();
    this.graphics.lineStyle(2, 0x000000);
    this.graphics.lineBetween(400, 50, hookX, hookY);
    this.graphics.fillStyle(0x000000, 1);
    this.graphics.fillCircle(hookX, hookY, 5);
  }
}
