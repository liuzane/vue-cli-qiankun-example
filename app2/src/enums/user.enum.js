export const UserStatusEnum = {
  Active: 'active',
  Disabled: 'disabled',
};

export const STATUS_MAP = {
  [UserStatusEnum.Active]: { text: '启用', type: 'success' },
  [UserStatusEnum.Disabled]: { text: '禁用', type: 'info' },
};
