import { gameConfig } from "../../config/gameConfig.js";

export function createRockItem(item, size) {
  item.setData('size', size);

  if (size === 'small') {
    item.setData('score', gameConfig.rockSmallGold);
    item.setData('pickupSpeed', gameConfig.rockSmallSpeed);
    item.setScale(0.1);
  } else if (size === 'medium') {
    item.setData('score', gameConfig.rockLargeGold);
    item.setData('pickupSpeed', gameConfig.rockLargeSpeed);
    item.setScale(0.12);
  } else if (size === 'large') {
    item.setData('score', gameConfig.rockLargeGold);
    item.setData('pickupSpeed', gameConfig.rockLargeSpeed);
    item.setScale(0.15);
  }
}
