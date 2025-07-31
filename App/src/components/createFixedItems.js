import { createGoldItem } from "./items/goldItem.js";
import { createRockItem } from "./items/rockItem.js";
import { createBagItem } from "./items/bagItem.js";

export function createItems(scene, difficulty = 'easy') {
  const items = scene.physics.add.group();

  const mapLayouts = {
    easy: [
      [
        { x: 80, y: 320, type: 'gold', size: 'large' },
        { x: 130, y: 340, type: 'gold', size: 'large' },
        { x: 100, y: 380, type: 'gold', size: 'large' },
        { x: 150, y: 400, type: 'gold', size: 'large' },
        { x: 400, y: 500, type: 'bag' },
        { x: 650, y: 320, type: 'rock', size: 'large' },
      ],
      [
        { x: 200, y: 300, type: 'gold', size: 'large' },
        { x: 250, y: 350, type: 'gold', size: 'medium' },
        { x: 300, y: 400, type: 'gold', size: 'medium' },
        { x: 350, y: 450, type: 'bag' },
        { x: 600, y: 350, type: 'rock', size: 'large' },
      ]
    ],
    medium: [
      [
        { x: 100, y: 350, type: 'gold', size: 'medium' },
        { x: 400, y: 500, type: 'bag' },
        { x: 700, y: 320, type: 'rock', size: 'large' },
        { x: 650, y: 380, type: 'rock', size: 'medium' },
        { x: 350, y: 420, type: 'gold', size: 'medium' },
        { x: 450, y: 480, type: 'rock', size: 'small' }
      ]
    ],
    hard: [
      [
        { x: 150, y: 400, type: 'gold', size: 'small' },
        { x: 200, y: 420, type: 'gold', size: 'small' },
        { x: 250, y: 440, type: 'bag' },
        { x: 600, y: 300, type: 'rock', size: 'large' },
        { x: 650, y: 350, type: 'rock', size: 'large' },
        { x: 700, y: 400, type: 'rock', size: 'medium' },
        { x: 400, y: 500, type: 'rock', size: 'medium' }
      ]
    ]
  };

  const layout = Phaser.Utils.Array.GetRandom(mapLayouts[difficulty] || mapLayouts.easy);

  layout.forEach(pos => {
    const { x, y, type, size = 'small' } = pos;

    const item = items.create(x, y, type);
    item.setData('type', type);

    if (type === 'gold') {
      createGoldItem(item, size);
    } else if (type === 'rock') {
      createRockItem(item, size);
    } else if (type === 'bag') {
      createBagItem(item);
    }

    item.setOrigin(0.5, 0.5);
    item.body.setCircle(item.width / 2);
    item.body.setImmovable(true);
  });

  return items;
}
