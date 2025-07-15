import { createGoldItem } from "./items/goldItem.js";
import { createRockItem } from "./items/rockItem.js";
import { createBagItem } from "./items/bagItem.js";

export function createItems(scene, rows, cols) {
  const items = scene.physics.add.group();
  const cellWidth = 800 / cols; // Assuming a scene width of 800
  const cellHeight = 300 / rows; // Restricting to bottom half (600 / 2 = 300)
  const occupiedCells = new Set();

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let cellIndex = i * cols + j;

      if (Phaser.Math.Between(0, 1) === 1 && !occupiedCells.has(cellIndex)) {
        const x = Phaser.Math.Between(j * cellWidth + 20, (j + 1) * cellWidth - 20);
        const y = Phaser.Math.Between(300 + i * cellHeight + 20, 300 + (i + 1) * cellHeight - 20);
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

        occupiedCells.add(cellIndex);
      }
    }
  }

  return items;
}
