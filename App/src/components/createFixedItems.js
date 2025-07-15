import { createGoldItem } from "./items/goldItem.js";
import { createRockItem } from "./items/rockItem.js";
import { createBagItem } from "./items/bagItem.js";

export function createItems(scene) {
  const items = scene.physics.add.group();

  const fixedPositions = [
    // 4 large golds in top-left
    { x: 80, y: 320, type: 'gold', size: 'large' },
    { x: 130, y: 340, type: 'gold', size: 'large' },
    { x: 100, y: 380, type: 'gold', size: 'large' },
    { x: 150, y: 400, type: 'gold', size: 'large' },
  
    // 4 large rocks in top-right
    { x: 650, y: 320, type: 'rock', size: 'large' },
    { x: 700, y: 340, type: 'rock', size: 'large' },
    { x: 670, y: 380, type: 'rock', size: 'large' },
    { x: 720, y: 400, type: 'rock', size: 'large' },
  
    // bottom middle items
    { x: 400, y: 500, type: 'bag' },
    { x: 370, y: 520, type: 'gold', size: 'medium' },
    { x: 430, y: 540, type: 'rock', size: 'small' }
  ];
  

  fixedPositions.forEach(pos => {
    const { x, y, type, size } = pos;

    const item = items.create(x, y, type);
    item.setData('type', type);

    if (type === 'gold') {
      createGoldItem(item, size || 'small');
    } else if (type === 'rock') {
      createRockItem(item, size || 'small');
    } else if (type === 'bag') {
      createBagItem(item);
    }

    item.setOrigin(0.5, 0.5);
    item.body.setCircle(item.width / 2);
    item.body.setImmovable(true);
  });

  return items;
}