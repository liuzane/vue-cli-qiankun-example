// 产品状态枚举
export const ProductStatusEnum = {
  OnSale: 'on_sale',
  OffSale: 'off_sale',
  OutOfStock: 'out_of_stock',
  LowStock: 'low_stock',
};

// 产品分类枚举
export const ProductCategoryEnum = {
  Electronics: 'electronics',
  Clothing: 'clothing',
  Home: 'home',
  Beauty: 'beauty',
  Food: 'food',
};

export const STATUS_MAP = {
  [ProductStatusEnum.OnSale]: { text: '上架', type: 'success' },
  [ProductStatusEnum.OffSale]: { text: '下架', type: 'info' },
  [ProductStatusEnum.OutOfStock]: { text: '缺货', type: 'danger' },
  [ProductStatusEnum.LowStock]: { text: '库存紧张', type: 'warning' },
};

export const CATEGORY_MAP = {
  [ProductCategoryEnum.Electronics]: '电子产品',
  [ProductCategoryEnum.Clothing]: '服装',
  [ProductCategoryEnum.Home]: '家居用品',
  [ProductCategoryEnum.Beauty]: '美妆个护',
  [ProductCategoryEnum.Food]: '食品饮料',
};
