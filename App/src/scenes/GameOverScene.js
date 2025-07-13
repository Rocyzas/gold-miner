export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    this.add.text(300, 200, 'Game Over', { fontSize: '48px', fill: '#f00' });
    this.add.text(300, 300, `Final Score: ${this.finalScore}`, { fontSize: '32px', fill: '#fff' });
    this.add.text(300, 400, 'Press SPACE to Restart', { fontSize: '24px', fill: '#fff' });

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('GameScene', { score: 0, level: 1, upgrades: {} , goal: 500});
    });
  }
}
