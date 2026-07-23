export const RoleStatusEnum = {
  Active: 'active',
  Inactive: 'inactive',
};

export const STATUS_MAP = {
  [RoleStatusEnum.Active]: { text: '启用', type: 'success' },
  [RoleStatusEnum.Inactive]: { text: '停用', type: 'info' },
};
