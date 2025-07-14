import { gameConfig } from "../config/gameConfig.js";

function createGoldItem(item, size) {
  item.setData('size', size);
  if (size === 'small') {
    item.setData('score', gameConfig.goldSmallGold);
    item.setData('pickupSpeed', gameConfig.goldSmallSpeed);
    item.setScale(0.1);
  } else if (size === 'medium') {
    item.setData('score', gameConfig.goldMediumGold);
    item.setData('pickupSpeed', gameConfig.goldMediumSpeed);
    item.setScale(0.15);
  } else if (size === 'large') {
    item.setData('score', gameConfig.goldLargeGold);
    item.setData('pickupSpeed', gameConfig.goldLargeSpeed);
    item.setScale(0.2);
  }
}

function createRockItem(item, size) {
  item.setData('size', size);
  if (size === 'small') {
    item.setData('score', gameConfig.rockSmallGold);
    item.setData('pickupSpeed', gameConfig.rockSmallSpeed);
    item.setScale(0.1);
  } else if (size === 'large') {
    item.setData('score', gameConfig.rockLargeGold);
    item.setData('pickupSpeed', gameConfig.rockLargeSpeed);
    item.setScale(0.15);
  }
}

function createBagItem(item) {
  item.setData('score', 0);
  item.setData('pickupSpeed', 1);
  item.setScale(0.1);
}

export function createRandomItems(scene, rows, cols) {
  const items = scene.physics.add.group();
  const cellWidth = 800 / cols; // Assuming a scene width of 800
  const cellHeight = 300 / rows; // Restricting to bottom half (600 / 2 = 300)
  const occupiedCells = new Set();

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let cellIndex = i * cols + j;

      // Randomly decide whether to place an item in this cell
      if (Phaser.Math.Between(0, 1) === 1 && !occupiedCells.has(cellIndex)) {
        const x = Phaser.Math.Between(j * cellWidth + 20, (j + 1) * cellWidth - 20);
        const y = Phaser.Math.Between(300 + i * cellHeight + 20, 300 + (i + 1) * cellHeight - 20); // Offset by 300 for bottom half
        const type = Phaser.Math.RND.pick(['gold', 'rock', 'bag']);

        const item = items.create(x, y, type);
        item.setData('type', type);

        if (type === 'gold') {
          const size = Phaser.Math.RND.pick(['small', 'medium', 'large']);
          createGoldItem(item, size);
        } else if (type === 'rock') {
          const size = Phaser.Math.RND.pick(['small', 'large']);
          createRockItem(item, size);
        } else if (type === 'bag') {
          createBagItem(item);
        }

        item.setOrigin(0.5, 0.5);
        item.body.setCircle(item.width / 2);
        item.body.setImmovable(true);

        // Mark this cell as occupied
        occupiedCells.add(cellIndex);
      }
    }
  }

  return items;
}
