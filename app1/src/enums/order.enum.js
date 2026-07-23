export const OrderStatusEnum = {
  Pending: 'pending',
  Paid: 'paid',
  Shipped: 'shipped',
  Completed: 'completed',
  Cancelled: 'cancelled',
};

export const STATUS_MAP = {
  [OrderStatusEnum.Pending]: { text: '待支付', type: 'warning' },
  [OrderStatusEnum.Paid]: { text: '已支付', type: 'primary' },
  [OrderStatusEnum.Shipped]: { text: '已发货', type: 'success' },
  [OrderStatusEnum.Completed]: { text: '已完成', type: 'info' },
  [OrderStatusEnum.Cancelled]: { text: '已取消', type: 'danger' },
};
