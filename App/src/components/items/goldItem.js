import { gameConfig } from "../../config/gameConfig.js";

export function createGoldItem(item, size) {
  item.setData('size', size);

  if (size === 'small') {
    item.setData('score', gameConfig.goldSmallGold);
    item.setData('pickupSpeed', gameConfig.goldSmallSpeed);
    item.setScale(0.1);
  } else if (size === 'medium') {
    item.setData('score', gameConfig.goldMediumGold);
    item.setData('pickupSpeed', gameConfig.goldMediumSpeed);
    item.setScale(0.12);
  } else if (size === 'large') {
    item.setData('score', gameConfig.goldLargeGold);
    item.setData('pickupSpeed', gameConfig.goldLargeSpeed);
    item.setScale(0.15);
  }
}
