export default class RoleService {
  roleMapper = undefined;
  initPromise = undefined;

  constructor() {}

  /**
   * 初始化数据库映射器
   */
  async init() {
    // 已初始化
    if (this.roleMapper) {
      return;
    }

    // 正在初始化，等待初始化完成
    if (this.initPromise) {
      return this.initPromise;
    }

    // 创建唯一初始化任务
    this.initPromise = this.initData();

    try {
      await this.initPromise;
    } finally {
      // 初始化结束（成功或失败）都清除锁
      this.initPromise = undefined;
    }
  }

  /**
   * 初始化数据
   */
  async initData() {
    const DATABASE_NAME = window.mockDB.databaseName;
    const { DatabaseMapper } = window.mockDB.mapper;
    const { ROLE_STORE_NAME } = window.mockDB.storeNames;

    this.roleMapper = new DatabaseMapper(
      DATABASE_NAME,
      ROLE_STORE_NAME,
    );

    const count = await this.roleMapper.count();

    if (count === 0) {
      console.log('角色表为空，开始初始化...');
      const roles = window.mockDB.data.roles;
      await this.roleMapper.insertBatch(roles);
    }
  }

  /**
   * 获取 Mapper
   */
  async getMapper() {
    await this.init();
    return this.roleMapper;
  }

  /**
   * 分页查询角色，支持名称模糊搜索和状态筛选
   * @param params.currentPage 当前页码（从1开始）
   * @param params.pageSize 每页条数
   * @param params.searchText 角色名称或编码模糊匹配关键字
   * @param params.status 状态筛选（可选）
   */
  async getRolesByPage(params) {
    await this.getMapper();
    const { currentPage, pageSize, searchText, status } = params;
    if (!currentPage || !pageSize) {
      throw new Error('currentPage 和 pageSize 是必填参数');
    }
    const filter = (item) => {
      const matchSearch = searchText
        ? item.name.toLowerCase().includes(searchText.toLowerCase())
        || item.code.toLowerCase().includes(searchText.toLowerCase())
        : true;
      const matchStatus = status ? item.status === status : true;
      return matchSearch && matchStatus;
    };
    return this.roleMapper.query(currentPage, pageSize, filter);
  }

  /**
   * 获取全量角色（用于统计）
   */
  async getAllRoles() {
    await this.getMapper();
    return this.roleMapper.getAll();
  }

  /**
   * 获取单条角色
   */
  async getRole(id) {
    await this.getMapper();
    return this.roleMapper.getByKey(id);
  }

  /**
   * 更新角色
   */
  async updateRole(role) {
    await this.getMapper();
    await this.roleMapper.update(role);
  }

  /**
   * 删除角色
   */
  async deleteRole(id) {
    await this.getMapper();
    await this.roleMapper.deleteByKey(id);
  }

  /**
   * 插入角色
   */
  async insertRole(role) {
    await this.getMapper();
    await this.roleMapper.insert(role);
  }

  /**
   * 重置数据库：清空所有数据并重新生成
   */
  async reset() {
    await this.getMapper();
    const roles = window.mockDB.data.roles;
    await this.roleMapper.clear();
    await this.roleMapper.insertBatch(roles);
  }
}
