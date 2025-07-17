import { gameConfig } from "../config/gameConfig.js";

export default class Rope {
  constructor(scene, upgrades, baseX = 400, baseY = 180) {
    this.scene = scene;
    this.upgrades = upgrades || {};

    // rope base position
    this.baseX = baseX;
    this.baseY = baseY;

    this.defaultExtendSpeed = gameConfig.initialSpeed;
    this.ropeLength = 60;
    this.ropeMaxLength = 600;
    this.ropeAngle = 0;
    this.ropeSwingSpeed = 1;
    this.ropeSwingDirection = 1;
    this.ropeState = 'swing';
    this.hookedItem = null;

    this.swingTime = 0;
    this.swingAmplitude = 60;
    this.swingFrequency = 0.002;

    this.dynamiteStock = this.upgrades.dynamiteCount || 0;

    this.graphics = scene.add.graphics({ lineStyle: { width: 2, color: 0x000000 } });
    this.dynamiteSprite = scene.add.sprite(450, 50, 'dynamit')
      .setScale(0.1)
      .setVisible(false);
    this.dynamiteUsedThisCycle = false;

    // this.hookSprite = this.scene.add.sprite(this.baseX, this.baseY, 'hookImage');
    // this.hookSprite.setOrigin(0.5, 0.5); // center origin
    // this.hookSprite.setScale(0.5); // scale to fit, adjust as needed
    this.setupInput();
  }

  setupInput() {
    this.cursors = this.scene.input.keyboard.createCursorKeys();

    this.scene.input.keyboard.on('keydown-SPACE', () => {
      if (this.ropeState === 'swing') {
        this.ropeState = 'extend';
      }
    });

    this.bombKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
  }

  calculateSwingingLinePoints(hookX, hookY, ropeAngle, lineLength = 20) {
    const angleRad = Phaser.Math.DegToRad(ropeAngle);
    const perpAngle = angleRad - Math.PI / 2;
  
    const startX = hookX + (lineLength / 2) * Math.sin(perpAngle);
    const startY = hookY + (lineLength / 2) * Math.cos(perpAngle);
  
    const endX = hookX - (lineLength / 2) * Math.sin(perpAngle);
    const endY = hookY - (lineLength / 2) * Math.cos(perpAngle);
  
    return { startX, startY, endX, endY };
  }
  

  handleBombInput(updateDynamiteCb) {
    if (Phaser.Input.Keyboard.JustDown(this.bombKey)) {
      if (this.hookedItem && this.dynamiteStock > 0 && !this.dynamiteUsedThisCycle) {
        this.throwDynamite();
        this.dynamiteUsedThisCycle = true;
        if (updateDynamiteCb) updateDynamiteCb(this.dynamiteStock);
      }
    }
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
    this.handleBombInput(updateDynamiteCb);

    switch (this.ropeState) {
      case 'swing':
        this.updateSwing();
        break;
      case 'extend':
        this.updateExtend(items);
        break;
      case 'retract':
        this.updateRetract(updateScoreCb);
        break;
    }

    this.drawRope();
  }

  updateSwing() {
    this.swingTime += this.scene.game.loop.delta;
    this.ropeAngle = this.swingAmplitude * Math.sin(this.swingFrequency * this.swingTime);
  }

  updateExtend(items) {
    this.ropeLength += this.defaultExtendSpeed;

    const { hookX, hookY } = this.getHookPosition();

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

  updateRetract(updateScoreCb) {
    let retractSpeed = this.calculateRetractSpeed();

    if (this.cursors.up.isDown) {
      retractSpeed *= 10;  // 10x speed when holding arrow up
    }

    this.ropeLength -= retractSpeed;

    if (this.hookedItem) {
      const { hookX, hookY } = this.getHookPosition();
      this.hookedItem.setPosition(hookX, hookY);
    }

    if (this.ropeLength <= 50) {
      this.handleRetractComplete(updateScoreCb);
    }
  }

  calculateRetractSpeed() {
    if (this.hookedItem) {
      let speed = this.hookedItem.getData('pickupSpeed') || gameConfig.initialSpeed;
      if (this.upgrades.strength) {
        speed *= (gameConfig.strengthMultiplier || 2);
      }
      return speed;
    }
    return gameConfig.initialSpeed;
  }

  handleRetractComplete(updateScoreCb) {
    if (this.hookedItem) {
      const scoreToAdd = this.calculateScore();
      updateScoreCb(scoreToAdd);
      this.hookedItem.destroy();
      this.hookedItem = null;
    }

    this.ropeLength = 50;
    this.ropeState = 'swing';
    this.dynamiteUsedThisCycle = false;  // reset here
  }

  calculateScore() {
    if (!this.hookedItem) return 0;

    const type = this.hookedItem.getData('type');

    if (type === 'bag') {
      return this.upgrades.luck
        ? Phaser.Math.Between(50, 250)
        : Phaser.Math.Between(0, 200);
    }

    let score = this.hookedItem.getData('score') || 0;

    if (type === 'rock' && this.upgrades.rockMiner) {
      score *= 2;
    }

    return score;
  }

  getHookPosition() {
    const hookX = this.baseX + this.ropeLength * Math.sin(Phaser.Math.DegToRad(this.ropeAngle));
    const hookY = this.baseY + this.ropeLength * Math.cos(Phaser.Math.DegToRad(this.ropeAngle));
    return { hookX, hookY };
  }
  drawRope() {
    const { hookX, hookY } = this.getHookPosition();
  
    this.graphics.clear();
    this.graphics.lineStyle(4, 0x5C4033);
    this.graphics.lineBetween(this.baseX, this.baseY, hookX, hookY);
  
    // Use the new helper function to get swinging line endpoints
    const { startX, startY, endX, endY } = this.calculateSwingingLinePoints(hookX, hookY, this.ropeAngle);
    this.graphics.lineStyle(2, 0xFF0000);
    this.graphics.lineBetween(startX, startY, endX, endY);
  }
  drawHook() {
    const { hookX, hookY } = this.getHookPosition();
    const { startX, startY, endX, endY } = this.calculateSwingingLinePoints(hookX, hookY, this.ropeAngle);
    this.graphics.lineStyle(3, 0xA0522D);
    this.graphics.lineBetween(startX, startY, endX, endY);
  }

}
