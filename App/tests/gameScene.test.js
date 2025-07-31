import Phaser from 'phaser/dist/phaser.js';
import GameScene from '../src/scenes/GameScene.js';

describe('GameScene loading and object creation', () => {
  let scene;

  beforeEach(() => {
    scene = new GameScene();
  });

  test('GameScene should be instantiated', () => {
    expect(scene).toBeDefined();
    expect(scene).toBeInstanceOf(GameScene);
  });

  test('GameScene should have init method', () => {
    expect(typeof scene.init).toBe('function');

    scene.init({});
    expect(scene.score).toBe(0);
    expect(scene.level).toBe(1);
    expect(scene.upgrades).toBeDefined();
    expect(scene.upgrades.dynamiteCount).toBe(0);
  });

  test('GameScene should handle init with custom data', () => {
    const testData = {
      score: 100,
      level: 2,
      upgrades: { dynamiteCount: 5, strength: true },
      goal: 500
    };

    scene.init(testData);
    expect(scene.score).toBe(100);
    expect(scene.level).toBe(2);
    expect(scene.upgrades.dynamiteCount).toBe(5);
    expect(scene.upgrades.strength).toBe(true);
    expect(scene.goal).toBe(500);
  });

  test('GameScene should have preload method', () => {
    expect(typeof scene.preload).toBe('function');
  });

  test('GameScene should have create method', () => {
    expect(typeof scene.create).toBe('function');
  });

  test('GameScene should have update method', () => {
    expect(typeof scene.update).toBe('function');
  });

  test('GameScene should handle partial init data', () => {
    const partialData = {
      score: 250,
      upgrades: { strength: true }
    };

    scene.init(partialData);
    expect(scene.score).toBe(250);
    expect(scene.level).toBe(1);
    expect(scene.upgrades.strength).toBe(true);
    expect(scene.upgrades.dynamiteCount).toBe(0);
  });

  test('GameScene should use default goal when not provided', () => {
    scene.init({});
    expect(scene.goal).toBeDefined();
    expect(typeof scene.goal).toBe('number');
  });

  test('GameScene should load required assets in preload', () => {
    scene.load = {
      image: jest.fn(),
    };

    scene.preload();

    expect(scene.load.image).toHaveBeenCalledWith('miner', '../../assets/miner.png');
    expect(scene.load.image).toHaveBeenCalledWith('gold', '../../assets/gold.png');
    expect(scene.load.image).toHaveBeenCalledWith('rock', '../../assets/rock.jpg');
    expect(scene.load.image).toHaveBeenCalledWith('bag', '../../assets/bag.png');
    expect(scene.load.image).toHaveBeenCalledWith('dynamite', '../../assets/dynamite.jpg');
  });
});
