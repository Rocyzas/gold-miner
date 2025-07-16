import Phaser from 'phaser/dist/phaser.js';
import ShopScene from '../src/scenes/ShopScene.js';

describe('ShopScene loading and behavior', () => {
  let scene;

  beforeEach(() => {
    scene = new ShopScene();

    // Mock minimal Phaser methods/properties
    scene.add = {
      text: jest.fn(() => ({
        setInteractive: jest.fn(() => ({
          on: jest.fn()
        })),
        setText: jest.fn(),
        setFill: jest.fn()
      }))
    };

    scene.scene = {
      start: jest.fn()
    };
  });

  test('ShopScene should be instantiated', () => {
    expect(scene).toBeDefined();
    expect(scene).toBeInstanceOf(ShopScene);
  });

  test('ShopScene should have init method', () => {
    expect(typeof scene.init).toBe('function');

    scene.init({});
    expect(scene.score).toBe(0);
    expect(scene.level).toBe(1);
    expect(scene.goal).toBe(500);
    expect(scene.upgrades).toBeDefined();
    expect(scene.upgrades).toEqual({
      strength: false,
      rockMiner: false,
      luck: false,
      dynamiteCount: 0
    });
  });

  test('ShopScene should handle custom init data', () => {
    const data = {
      score: 150,
      level: 3,
      goal: 800,
      upgrades: {
        strength: true,
        rockMiner: true,
        luck: false,
        dynamiteCount: 2
      }
    };

    scene.init(data);
    expect(scene.score).toBe(150);
    expect(scene.level).toBe(3);
    expect(scene.goal).toBe(800);
    expect(scene.upgrades).toEqual(data.upgrades);
  });

  test('ShopScene should set prices correctly', () => {
    scene.init({});
    expect(scene.prices).toEqual({
      strength: 200,
      rockMiner: 150,
      luck: 100,
      dynamite: 50
    });
  });

  test('ShopScene should have create method', () => {
    expect(typeof scene.create).toBe('function');

    // Run create to ensure no errors with mocked `add`
    scene.init({});
    scene.create();

    expect(scene.add.text).toHaveBeenCalled();
  });

  test('ShopScene should have updateMoney method', () => {
    expect(typeof scene.updateMoney).toBe('function');

    scene.init({});
    scene.moneyText = { setText: jest.fn() };

    scene.score = 123;
    scene.updateMoney();

    expect(scene.moneyText.setText).toHaveBeenCalledWith('Money: 123');
  });
});
