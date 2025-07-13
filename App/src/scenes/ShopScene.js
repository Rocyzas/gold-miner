export default class ShopScene extends Phaser.Scene {
  constructor() {
    super('ShopScene');
  }

  init(data) {
    this.score = data.score;
    this.level = data.level;
    this.upgrades = data.upgrades || {};

    // Separate permanent and resettable upgrades:
    // For example:
    // strength = permanent (keeps after buy)
    // rockMiner = resettable (can buy again each round)
    this.permanentUpgrades = ['strength'];
    this.resettableUpgrades = ['rockMiner'];
    this.resettableUpgrades = ['luck'];

    // Initialize resettable upgrades to false if undefined
    this.resettableUpgrades.forEach(key => {
      if (this.upgrades[key] === undefined) {
        this.upgrades[key] = false;
      }
    });

    // You can also add a goal to pass each round (optional)
    this.goal = data.goal || 500;
  }

  create() {
    this.children.removeAll();

    this.add.text(300, 50, '🛒 Shop', { fontSize: '32px', fill: '#fff' });
    this.goldText = this.add.text(250, 100, `Your gold: ${this.score}`, { fontSize: '24px', fill: '#fff' });
    this.add.text(250, 140, `Level: ${this.level}`, { fontSize: '24px', fill: '#fff' });
    this.add.text(250, 170, `Next Goal: ${Math.floor(this.goal * 1.5)}`, { fontSize: '20px', fill: '#ff0' });
    this.add.text(250, 500, `Press SPACE to continue`, { fontSize: '20px', fill: '#fff' });

    // Prices (can randomize or keep static)
    const prices = {
      strength: Phaser.Math.Between(50, 100),
      rockMiner: Phaser.Math.Between(50, 100),
      luck: Phaser.Math.Between(50, 100)
    };

    const upgrades = [
      { emoji: '💪', desc: 'Increase rope speed', price: prices.strength, key: 'strength', x: 300, y: 200 },
      { emoji: '🪨', desc: 'Double money from rocks', price: prices.rockMiner, key: 'rockMiner', x: 300, y: 300 },
      { emoji: '🍀', desc: 'More luck from bags', price: prices.luck, key: 'luck', x: 300, y: 400 }
    ];

    upgrades.forEach(upgrade => {
      const emojiText = this.add.text(upgrade.x, upgrade.y, upgrade.emoji, { fontSize: '40px', fill: '#fff' })
        .setInteractive({ useHandCursor: true });

      const priceText = this.add.text(upgrade.x, upgrade.y + 40, `${upgrade.price} 💰`, { fontSize: '20px', fill: '#ff0' });

      const descText = this.add.text(upgrade.x + 50, upgrade.y, upgrade.desc, { fontSize: '20px', fill: '#fff' })
        .setVisible(false);

      emojiText.on('pointerover', () => descText.setVisible(true));
      emojiText.on('pointerout', () => descText.setVisible(false));

      const buyBtn = this.add.text(upgrade.x + 100, upgrade.y + 40, '', { fontSize: '20px' })
        .setInteractive({ useHandCursor: true });

      const isPermanent = this.permanentUpgrades.includes(upgrade.key);
      const isBought = this.upgrades[upgrade.key];

      if (isPermanent && isBought) {
        buyBtn.setText('[BOUGHT]').setFill('#aaa');
        buyBtn.disableInteractive();
      } else if (!isPermanent && isBought) {
        buyBtn.setText('[BUY]').setFill('#0f0');
        this.upgrades[upgrade.key] = false;

        buyBtn.on('pointerdown', () => {
          if (this.score >= upgrade.price) {
            this.score -= upgrade.price;
            this.upgrades[upgrade.key] = true;
            this.goldText.setText(`Your gold: ${this.score}`);
            buyBtn.setText('[BOUGHT]').setFill('#aaa');
            buyBtn.disableInteractive();
          }
        });
      } else {
        buyBtn.setText('[BUY]').setFill('#0f0');
        buyBtn.on('pointerdown', () => {
          if (this.score >= upgrade.price) {
            this.score -= upgrade.price;
            this.upgrades[upgrade.key] = true;
            this.goldText.setText(`Your gold: ${this.score}`);
            buyBtn.setText('[BOUGHT]').setFill('#aaa');
            buyBtn.disableInteractive();
          }
        });
      }
    });

    this.input.keyboard.on('keydown-SPACE', () => {
      const nextGoal = Math.floor(this.goal * 1.5);

      this.scene.start('GameScene', {
        score: this.score,
        level: this.level + 1,
        upgrades: this.upgrades,
        goal: nextGoal
      });
    });
  }
}
