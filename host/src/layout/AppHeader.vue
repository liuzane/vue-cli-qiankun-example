<template>
  <el-header class="app-header">
    <h1 class="title">一个基于 QianKun + Vue 的微前端演示项目</h1>
    <i class="el-icon-setting setting-icon" @click="showModal = true"></i>

    <!-- 数据管理对话框 -->
    <el-dialog
      title="数据管理"
      :visible.sync="showModal"
      width="600px"
    >
      <p class="description">
        点击下方按钮可重置对应数据表，重置后将清空现有数据并重新初始化。
      </p>

      <!-- 微应用 1 数据 -->
      <el-card shadow="never" class="data-card">
        <div slot="header" class="card-header">
          <span>微应用 1 数据</span>
        </div>
        <div class="button-group">
          <el-button
            type="danger"
            icon="el-icon-refresh"
            @click="onResetTable(orderStoreName, '订单')"
          >
            重置订单数据
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-refresh"
            @click="onResetTable(productStoreName, '产品')"
          >
            重置产品数据
          </el-button>
        </div>
      </el-card>

      <!-- 微应用 2 数据 -->
      <el-card shadow="never" class="data-card">
        <div slot="header" class="card-header">
          <span>微应用 2 数据</span>
        </div>
        <div class="button-group">
          <el-button
            type="danger"
            icon="el-icon-refresh"
            @click="onResetTable(userStoreName, '用户')"
          >
            重置用户数据
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-refresh"
            @click="onResetTable(roleStoreName, '角色')"
          >
            重置角色数据
          </el-button>
        </div>
      </el-card>

      <span slot="footer">
        <el-button @click="showModal = false">关闭</el-button>
      </span>
    </el-dialog>
  </el-header>
</template>

<script>
export default {
  name: 'AppHeader',
  data() {
    return {
      /**
       * 数据管理对话框显示状态
       */
      showModal: false,

      /**
       * 数据库名称
       */
      databaseName: '',

      /**
       * 数据库存储名称
       */
      orderStoreName: '',
      productStoreName: '',
      userStoreName: '',
      roleStoreName: '',
    };
  },

  mounted() {
    /**
     * 初始化数据库配置
     * 从 window.mockDB 中获取数据库名称和存储名称
     */
    if (window.mockDB) {
      this.databaseName = window.mockDB.databaseName;
      const { storeNames } = window.mockDB;
      this.orderStoreName = storeNames.ORDER_STORE_NAME;
      this.productStoreName = storeNames.PRODUCT_STORE_NAME;
      this.userStoreName = storeNames.USER_STORE_NAME;
      this.roleStoreName = storeNames.ROLE_STORE_NAME;
    }
  },

  methods: {
    /**
     * 重置指定数据表
     * @param {string} storeName - 数据库存储名称
     * @param {string} tableName - 显示的表名
     */
    async onResetTable(storeName, tableName) {
      this.$confirm(
        `确定要重置 ${tableName}(${storeName}) 数据吗？此操作将清空现有数据并重新初始化。`,
        '确认重置',
        {
          confirmButtonText: '确认重置',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(async () => {
          try {
            // 获取 DatabaseMapper 类
            const { DatabaseMapper } = window.mockDB.mapper;

            // 创建数据库映射器实例
            const mapper = new DatabaseMapper(this.databaseName, storeName);

            // 根据存储名称清空并重新插入对应数据
            switch (storeName) {
              case this.orderStoreName: {
                const orders = window.mockDB.data.orders;
                await mapper.clear();
                await mapper.insertBatch(orders);
                break;
              }

              case this.productStoreName: {
                const products = window.mockDB.data.products;
                await mapper.clear();
                await mapper.insertBatch(products);
                break;
              }

              case this.userStoreName: {
                const users = window.mockDB.data.users;
                await mapper.clear();
                await mapper.insertBatch(users);
                break;
              }

              case this.roleStoreName: {
                const roles = window.mockDB.data.roles;
                await mapper.clear();
                await mapper.insertBatch(roles);
                break;
              }
            }

            this.$message.success(`重置 ${tableName}(${storeName}) 数据成功`);
          } catch (error) {
            console.error('重置数据失败:', error);
            this.$message.error('重置数据失败，请重试');
          }
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
.el-header.app-header {
  display: flex;
  align-items: center;
  padding: 0 24px;
  background-color: #fff;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
  margin-right: 40px;
  white-space: nowrap;
}

.setting-icon {
  font-size: 20px;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
}

.setting-icon:hover {
  color: #409eff;
}

.description {
  color: #999;
  margin-bottom: 16px;
}

.data-card {
  margin-bottom: 16px;
  background-color: #fafafa;
}

.card-header {
  font-weight: 600;
}

.button-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
