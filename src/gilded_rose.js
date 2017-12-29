class Item {
  constructor(name, sellIn, quality){
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

class ItemDecayerFactory {
  static createItemDecayer(item) {
    if (item.name === 'Aged Brie') {
      return new AgedBrieDecayer(item);
    } else if (item.name === 'Sulfuras, Hand of Ragnaros') {
      return new SulfurasDecayer(item);
    } else if (item.name === 'Backstage passes to a TAFKAL80ETC concert') {
      return new BackstagePassDecayer(item);
    } else if (item.name === 'Conjured') {
      return new ConjuredDecayer(item)
    } else {
      return new ItemDecayer(item);
    }
  }
}

class ItemDecayer {
  constructor(item) {
    this.item = item;
  }

  decay() {
    this.adjustQuality();
    this.adjustSellIn();
  }

  adjustQuality() {
    const newQuality = this.item.quality + this.getQualityChange();
    this.item.quality = this.clampQuality(newQuality);
  }

  adjustSellIn() {
    this.item.sellIn += this.getSellInChange();
  }

  getQualityChange() {
    return this.item.sellIn <= 0 ? -2 : -1;
  }

  getSellInChange() {
    return -1;
  }

  clampQuality(quality) {
    return Math.min(50, Math.max(0, quality));
  }
}

class AgedBrieDecayer extends ItemDecayer {
  getQualityChange() {
    return this.item.sellIn <= 0 ? 2 : 1;
  }
}

class ConjuredDecayer extends ItemDecayer {
  getQualityChange() {
    return this.item.sellIn <= 0 ? -4 : -2;
  }
}

class SulfurasDecayer extends ItemDecayer {
  adjustQuality() {
  }

  adjustSellIn() {
  }
}

class BackstagePassDecayer extends ItemDecayer {
  adjustQuality() {
    if (this.item.sellIn <= 0) {
      this.item.quality = 0;
      return;
    }

    super.adjustQuality();
  }

  getQualityChange() {
    if (this.item.sellIn <= 5) {
      return 3;
    } else if (this.item.sellIn <= 10) {
      return 2;
    } else {
      return 1;
    }
  }
}

class Shop {
  constructor(items=[]){
    this.items = items;
  }

  updateQuality() {
    this.items
      .map(ItemDecayerFactory.createItemDecayer)
      .forEach(decayer => decayer.decay());

    return this.items;
  }
}

module.exports = { Shop, Item };