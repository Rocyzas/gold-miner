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

    this.input = scene.input.keyboard.on('keydown-SPACE', () => {
      if (this.ropeState === 'swing') {
        this.ropeState = 'extend';
      }
    });
  }

  update(items, updateScoreCb) {
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
        // Pulling a hooked item
        retractSpeed = this.hookedItem.getData('pickupSpeed') || gameConfig.initialSpeed;

        // Strength only applies when pulling a hooked item
        if (this.upgrades.strength) {
          retractSpeed *= (gameConfig.strengthMultiplier || 2);
        }
      } else {
        // No hooked item — strength has no effect
        retractSpeed = gameConfig.initialSpeed;
      }

      this.ropeLength -= retractSpeed;

      if (this.hookedItem) {
        // Update hooked item's position to follow the rope
        const hookX = 400 + this.ropeLength * Math.sin(Phaser.Math.DegToRad(this.ropeAngle));
        const hookY = 50 + this.ropeLength * Math.cos(Phaser.Math.DegToRad(this.ropeAngle));
        this.hookedItem.setPosition(hookX, hookY);
      }

      if (this.hookedItem) {
        let scoreToAdd;

        if (this.hookedItem.getData('type') === 'bag') {
          // luck upgrade affects bag score range
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
