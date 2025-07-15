export default class ShopScene extends Phaser.Scene {
  constructor() {
    super('ShopScene');
  }

  init(data) {
    this.score = data.score || 0;
    this.level = data.level || 1;
    this.goal = data.goal || 500;
    this.upgrades = data.upgrades || {
      strength: false,
      rockMiner: false,
      luck: false,
      dynamiteCount: 0
    };

    // Prices
    this.prices = {
      strength: 200,
      rockMiner: 150,
      luck: 100,
      dynamite: 50
    };
  }

  create() {
    this.add.text(300, 50, 'Shop', { fontSize: '32px', fill: '#fff' });
    this.add.text(50, 100, `Money: ${this.score}`, { fontSize: '20px', fill: '#fff' });

    this.moneyText = this.add.text(50, 130, `Dynamite: ${this.upgrades.dynamiteCount}`, { fontSize: '20px', fill: '#fff' });

    const upgradesList = [
      { key: 'strength', name: 'Stronger Miner' },
      { key: 'rockMiner', name: 'Rock Mining' },
      { key: 'luck', name: 'Lucky Bags' }
    ];

    let y = 180;

    upgradesList.forEach(upgrade => {
      this.add.text(50, y, `${upgrade.name} - $${this.prices[upgrade.key]}`, {
        fontSize: '18px',
        fill: this.upgrades[upgrade.key] ? '#0f0' : '#fff'
      });

      if (!this.upgrades[upgrade.key]) {
        const btn = this.add.text(400, y, '[BUY]', {
          fontSize: '18px',
          fill: '#ff0'
        }).setInteractive();

        btn.on('pointerdown', () => {
          if (this.score >= this.prices[upgrade.key]) {
            this.score -= this.prices[upgrade.key];
            this.upgrades[upgrade.key] = true;
            btn.setFill('#999').setText('[BOUGHT]');
            this.updateMoney();
          }
        });
      } else {
        this.add.text(400, y, '[BOUGHT]', {
          fontSize: '18px',
          fill: '#999'
        });
      }

      y += 40;
    });

    // Dynamite (stackable)
    this.add.text(50, y, `Dynamite - $${this.prices.dynamite} each`, {
      fontSize: '18px',
      fill: '#fff'
    });

    const dynamiteCountText = this.add.text(300, y, `x${this.upgrades.dynamiteCount}`, {
      fontSize: '18px',
      fill: '#fff'
    });

    const buyDynamiteBtn = this.add.text(400, y, '[BUY]', {
      fontSize: '18px',
      fill: '#ff0'
    }).setInteractive();

    buyDynamiteBtn.on('pointerdown', () => {
      if (this.score >= this.prices.dynamite) {
        this.score -= this.prices.dynamite;
        this.upgrades.dynamiteCount++;
        dynamiteCountText.setText(`x${this.upgrades.dynamiteCount}`);
        this.updateMoney();
      }
    });

    // Next level button
    const nextLevelBtn = this.add.text(300, y + 80, '[NEXT LEVEL]', {
      fontSize: '24px',
      fill: '#0f0'
    }).setInteractive();

    nextLevelBtn.on('pointerdown', () => {
      this.scene.start('GameScene', {
        score: this.score,
        level: this.level + 1,
        goal: this.goal,
        upgrades: this.upgrades
      });
    });
  }

  updateMoney() {
    this.moneyText.setText(`Money: ${this.score}`);
  }
}
