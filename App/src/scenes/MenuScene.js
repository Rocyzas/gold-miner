
export default class Start extends Phaser.Scene {
    constructor() {
        super({ key: 'Start' });
    }

    preload() {
        // if you have images later:
        this.load.image('miner', '../assets/space.png');
    }

    create() {
        this.add.text(400, 300, 'Gold Miner', {
            fontSize: '48px',
            color: '#ffffff'
        }).setOrigin(0.5);

        console.log('Start scene created');
    }

    update() {
        // game loop
    }
}
