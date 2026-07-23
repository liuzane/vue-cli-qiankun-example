export default class OrderService {
  orderMapper = undefined;
  initPromise = undefined;

  constructor() {}

  /**
   * 初始化数据库映射器
   */
  async init() {
    // 已初始化
    if (this.orderMapper) {
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
    const { ORDER_STORE_NAME } = window.mockDB.storeNames;
    this.orderMapper = new DatabaseMapper(
      DATABASE_NAME,
      ORDER_STORE_NAME,
    );

    const count = await this.orderMapper.count();

    if (count === 0) {
      console.log('订单表为空，开始初始化...');
      const orders = window.mockDB.data.orders;
      await this.orderMapper.insertBatch(orders);
    }
  }

  /**
   * 获取 Mapper
   */
  async getMapper() {
    await this.init();
    return this.orderMapper;
  }

  /**
   * 分页查询订单，支持订单号模糊搜索和状态筛选
   * @param params.currentPage 当前页码（从1开始）
   * @param params.pageSize 每页条数
   * @param params.searchText 订单号模糊匹配关键字
   * @param params.status 状态筛选（可选）
   */
  async getOrdersByPage(params) {
    await this.getMapper();
    const { currentPage, pageSize, searchText, status } = params;
    if (!currentPage || !pageSize) {
      throw new Error('currentPage 和 pageSize 是必填参数');
    }
    const filter = (item) => {
      const matchSearch = searchText
        ? item.orderNo.toLowerCase().includes(searchText.toLowerCase())
        : true;
      const matchStatus = status ? item.status === status : true;
      return matchSearch && matchStatus;
    };
    return this.orderMapper.query(currentPage, pageSize, filter);
  }

  /**
   * 获取全量订单（用于统计）
   */
  async getAllOrders() {
    await this.getMapper();
    return this.orderMapper.getAll();
  }

  /**
   * 获取单条订单
   */
  async getOrder(id) {
    await this.getMapper();
    return this.orderMapper.getByKey(id);
  }

  /**
   * 更新订单
   */
  async updateOrder(order) {
    await this.getMapper();
    await this.orderMapper.update(order);
  }

  /**
   * 删除订单
   */
  async deleteOrder(id) {
    await this.getMapper();
    await this.orderMapper.deleteByKey(id);
  }

  /**
   * 插入订单
   */
  async insertOrder(order) {
    await this.getMapper();
    await this.orderMapper.insert(order);
  }

  /**
   * 重置数据库：清空所有数据并重新生成
   */
  async reset() {
    await this.getMapper();
    const orders = window.mockDB.data.orders;
    await this.orderMapper.clear();
    await this.orderMapper.insertBatch(orders);
  }
}
