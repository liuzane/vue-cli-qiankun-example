<template>
  <el-card>
    <div slot="header">
      <span>订单管理</span>
    </div>

    <!-- 统计卡片 -->
    <div class="stat-card-container">
      <el-card shadow="never" class="stat-card">
        <div class="stat-label">总订单</div>
        <div class="stat-value color-primary" @click="onReset">
          {{ statistics.total }}
        </div>
      </el-card>
      <el-card shadow="never" class="stat-card">
        <div class="stat-label">待支付</div>
        <div class="stat-value color-warning" @click="() => onStatusChange(OrderStatusEnum.Pending)"> 
          {{ statistics.pending }}
        </div>
      </el-card>
      <el-card shadow="never" class="stat-card">
        <div class="stat-label">已支付</div>
        <div class="stat-value color-primary" @click="() => onStatusChange(OrderStatusEnum.Paid)">
          {{ statistics.paid }}
        </div>
      </el-card>
      <el-card shadow="never" class="stat-card">
        <div class="stat-label">已发货</div>
        <div class="stat-value color-success" @click="() => onStatusChange(OrderStatusEnum.Shipped)">
          {{ statistics.shipped }}
        </div>
      </el-card>
      <el-card shadow="never" class="stat-card">
        <div class="stat-label">已完成</div>
        <div class="stat-value color-info" @click="() => onStatusChange(OrderStatusEnum.Completed)">
          {{ statistics.completed }}
        </div>
      </el-card>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-row">
      <el-input
        v-model="searchText"
        placeholder="搜索订单号"
        prefix-icon="el-icon-search"
        clearable
        style="width: 300px"
        @keyup.enter.native="onSearch"
      />
      <el-select
        v-model="orderStatus"
        placeholder="选择订单状态"
        clearable
        style="width: 150px"
      >
        <el-option label="全部状态" value="" />
        <el-option
          v-for="(config, key) in STATUS_MAP"
          :key="key"
          :label="config.text"
          :value="key"
        />
      </el-select>
      <div class="filter-buttons">
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button @click="onReset">重置</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table
      :data="dataSource"
      v-loading="loading"
      stripe
      border
      style="width: 100%;"
    >
      <el-table-column prop="orderNo" label="订单号" min-width="150" fixed />
      <el-table-column label="商品名称" min-width="300" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <el-button type="text" @click="onViewProduct(row)">{{ row.productName }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="客户信息" min-width="140">
        <template slot-scope="{ row }">
          <el-button type="text" @click="onViewCustomer(row)">{{ row.customerName }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="金额" min-width="120" sortable prop="amount">
        <template slot-scope="{ row }">
          ¥ {{ row.amount.toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="100">
        <template slot-scope="{ row }">
          <el-tag
            :type="STATUS_MAP[row.status] ? STATUS_MAP[row.status].type : 'info'"
            size="small"
          >
            {{ STATUS_MAP[row.status] ? STATUS_MAP[row.status].text : row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" min-width="180" sortable prop="createTime" />
      <el-table-column label="操作" width="240" fixed="right">
        <template slot-scope="{ row }">
          <el-button type="text" icon="el-icon-view" @click="onView(row)">查看</el-button>
          <el-button type="text" icon="el-icon-edit" @click="onEdit(row)">编辑</el-button>
          <el-button type="text" icon="el-icon-delete" style="color: #f56c6c" @click="confirmDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="pagination"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="onSizeChange"
      @current-change="onPageChange"
    />

    <!-- 查看订单对话框 -->
    <el-dialog
      :title="`订单详情 - ${viewRecord ? viewRecord.orderNo : ''}`"
      :visible.sync="viewModalVisible"
      width="700px"
    >
      <el-descriptions v-if="viewRecord" :column="2" border>
        <el-descriptions-item label="订单号" :span="2">{{ viewRecord.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="商品名称" :span="2">{{ viewRecord.productName }}</el-descriptions-item>
        <el-descriptions-item label="客户姓名">{{ viewRecord.customerName }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ viewRecord.phone }}</el-descriptions-item>
        <el-descriptions-item label="订单金额">
          ¥ {{ viewRecord.amount.toLocaleString() }}
        </el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag
            :type="STATUS_MAP[viewRecord.status] ? STATUS_MAP[viewRecord.status].type : 'info'"
            size="small"
          >
            {{ STATUS_MAP[viewRecord.status] ? STATUS_MAP[viewRecord.status].text : viewRecord.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="下单时间" :span="2">{{ viewRecord.createTime }}</el-descriptions-item>
        <el-descriptions-item label="收货地址" :span="2">{{ viewRecord.address }}</el-descriptions-item>
      </el-descriptions>
      <span slot="footer">
        <el-button @click="viewModalVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 编辑订单对话框 -->
    <el-dialog
      :title="`编辑订单 - ${editRecord ? editRecord.orderNo : ''}`"
      :visible.sync="editModalVisible"
      width="600px"
      @closed="onEditDialogClosed"
    >
      <el-form
        ref="editForm"
        :model="editForm"
        :rules="editFormRules"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="editForm.productName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="订单金额" prop="amount">
          <el-input-number
            v-model="editForm.amount"
            :precision="2"
            :min="0.01"
            style="width: 100%"
            placeholder="请输入金额"
          />
        </el-form-item>
        <el-form-item label="订单状态" prop="status">
          <el-select v-model="editForm.status" placeholder="请选择状态">
            <el-option
              v-for="(config, key) in STATUS_MAP"
              :key="key"
              :label="config.text"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="客户姓名" prop="customerName">
          <el-input v-model="editForm.customerName" placeholder="请输入客户姓名" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="editForm.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="收货地址" prop="address">
          <el-input
            v-model="editForm.address"
            type="textarea"
            :rows="2"
            placeholder="请输入收货地址"
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editModalVisible = false">取消</el-button>
        <el-button type="primary" @click="onEditSave">保存</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
// 枚举
import { OrderStatusEnum, STATUS_MAP } from '@/enums/order.enum';

// 数据服务
import OrderService from '@/services/OrderService';

const orderService = new OrderService();

export default {
  name: 'Order',

  /**
   * 组件数据模型
   * @property {Object} STATUS_MAP - 状态映射（从枚举导入，用于展示标签）
   * @property {Array} dataSource - 当前页的订单列表
   * @property {number} total - 订单总数
   * @property {boolean} loading - 表格加载状态
   * @property {string} searchText - 搜索框内容（订单号）
   * @property {string} orderStatus - 筛选的订单状态
   * @property {number} currentPage - 当前页码
   * @property {number} pageSize - 每页条数
   * @property {Object} statistics - 各状态订单统计
   * @property {boolean} viewModalVisible - 查看对话框显隐
   * @property {boolean} editModalVisible - 编辑对话框显隐
   * @property {Object|null} viewRecord - 当前查看的订单记录
   * @property {Object|null} editRecord - 当前编辑的订单记录（原始数据）
   * @property {Object} editForm - 编辑表单的数据
   * @property {Object} editFormRules - 编辑表单的验证规则
   */
  data() {
    return {
      STATUS_MAP,
      dataSource: [],
      total: 0,
      loading: true,
      searchText: '',
      orderStatus: '',
      currentPage: 1,
      pageSize: 10,
      statistics: {
        total: 0,
        pending: 0,
        paid: 0,
        shipped: 0,
        completed: 0,
        cancelled: 0,
      },
      viewModalVisible: false,
      editModalVisible: false,
      viewRecord: null,
      editRecord: null,
      editForm: {
        productName: '',
        amount: 0,
        status: OrderStatusEnum.Pending,
        customerName: '',
        phone: '',
        address: '',
      },
      editFormRules: {
        productName: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        amount: [
          { required: true, message: '请输入订单金额', trigger: 'blur' },
          { type: 'number', min: 0.01, message: '金额必须大于0', trigger: 'blur' },
        ],
        status: [{ required: true, message: '请选择订单状态', trigger: 'change' }],
        customerName: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' },
        ],
        address: [{ required: true, message: '请输入收货地址', trigger: 'blur' }],
      },
    };
  },

  /**
   * 组件挂载钩子：初始化加载订单数据
   */
  mounted() {
    this.loadData();
  },

  methods: {
    /**
     * 加载订单数据（分页 + 筛选）
     * @param {Object} [params] - 可选参数，可覆盖当前分页/搜索/状态
     * @param {number} [params.currentPage] - 当前页
     * @param {number} [params.pageSize] - 每页条数
     * @param {string} [params.searchText] - 搜索文本
     * @param {string} [params.status] - 订单状态
     */
    async loadData(params) {
      this.loading = true;
      try {
        const queryParams = {
          currentPage: params && 'currentPage' in params ? params.currentPage : this.currentPage,
          pageSize: params && 'pageSize' in params ? params.pageSize : this.pageSize,
          searchText: params && 'searchText' in params ? params.searchText : this.searchText,
          status: params && 'status' in params ? params.status : this.orderStatus,
        };
        const { data, total } = await orderService.getOrdersByPage(queryParams);
        this.dataSource = data;
        this.total = total;

        // 获取全部订单用于统计各状态数量（实际项目可改为后端统计接口）
        const allOrders = await orderService.getAllOrders();
        this.statistics = {
          total: allOrders.length,
          pending: allOrders.filter(item => item.status === OrderStatusEnum.Pending).length,
          paid: allOrders.filter(item => item.status === OrderStatusEnum.Paid).length,
          shipped: allOrders.filter(item => item.status === OrderStatusEnum.Shipped).length,
          completed: allOrders.filter(item => item.status === OrderStatusEnum.Completed).length,
          cancelled: allOrders.filter(item => item.status === OrderStatusEnum.Cancelled).length,
        };
      } catch (error) {
        console.error('加载数据失败:', error);
        this.$message.error('加载订单数据失败，请刷新页面重试');
      } finally {
        this.loading = false;
      }
    },

    /**
     * 查看商品详情（跳转到商品列表页并筛选商品名称）
     * @param {Object} record - 订单记录
     * @param {string} record.productName - 商品名称
     */
    onViewProduct(record) {
      // 跳转到自身应用的商品列表页面，携带商品名称作为查询参数
      this.$router.push({ name: 'Product', query: { name: record.productName } });
    },

    /**
     * 查看客户信息（跳转到微应用2的用户列表页）
     * @param {Object} record - 订单记录
     * @param {string} record.customerName - 客户姓名
     */
    onViewCustomer(record) {
      // 跳转到微应用2的用户列表页面，携带客户姓名
      this.$router.push(`/app2/user?name=${record.customerName}`);
    },

    /**
     * 打开查看订单详情对话框
     * @param {Object} record - 要查看的订单记录
     */
    onView(record) {
      this.viewRecord = record;
      this.viewModalVisible = true;
    },

    /**
     * 打开编辑订单对话框，并填充当前记录的数据
     * @param {Object} record - 要编辑的订单记录
     */
    onEdit(record) {
      this.editRecord = record;
      this.editForm = {
        productName: record.productName,
        amount: record.amount,
        status: record.status,
        customerName: record.customerName,
        phone: record.phone,
        address: record.address,
      };
      this.editModalVisible = true;
    },

    /**
     * 编辑对话框关闭后的回调：重置表单验证状态
     */
    onEditDialogClosed() {
      this.$refs.editForm && this.$refs.editForm.resetFields();
    },

    /**
     * 确认删除订单（弹出二次确认框）
     * @param {Object} record - 要删除的订单记录
     * @param {string} record.orderNo - 订单号
     * @param {number|string} record.id - 订单ID
     */
    confirmDelete(record) {
      this.$confirm(
        `确定要删除订单 ${record.orderNo} 吗？此操作不可恢复。`,
        '确认删除',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(async () => {
        try {
          await orderService.deleteOrder(record.id);
          await this.loadData();
          this.$message.success(`删除订单：${record.orderNo} 成功`);
        } catch (error) {
          console.error('删除失败:', error);
          this.$message.error('删除失败，请重试');
        }
      }).catch(() => {});
    },

    /**
     * 保存编辑后的订单数据
     */
    async onEditSave() {
      try {
        await this.$refs.editForm.validate();
        const updatedRecord = {
          ...this.editRecord,
          productName: this.editForm.productName,
          amount: this.editForm.amount,
          status: this.editForm.status,
          customerName: this.editForm.customerName,
          phone: this.editForm.phone,
          address: this.editForm.address,
        };
        await orderService.updateOrder(updatedRecord);
        await this.loadData();
        this.editModalVisible = false;
        this.$message.success(`订单 ${this.editRecord.orderNo} 更新成功`);
      } catch (error) {
        if (error !== false) {
          console.error('更新失败:', error);
        }
      }
    },

    /**
     * 重置所有筛选条件并重新加载数据
     */
    onReset() {
      this.searchText = '';
      this.orderStatus = '';
      this.currentPage = 1;
      this.loadData({ searchText: '', status: '', currentPage: 1 });
    },

    /**
     * 点击搜索按钮：重置到第一页并执行查询
     */
    onSearch() {
      this.currentPage = 1;
      this.loadData({ currentPage: 1 });
    },

    /**
     * 点击统计卡片切换状态筛选
     * @param {string} status - 订单状态枚举值
     */
    onStatusChange(status) {
      this.searchText = '';
      this.orderStatus = status;
      this.currentPage = 1;
      this.loadData({ searchText: '', status, currentPage: 1 });
    },

    /**
     * 分页页码变更
     * @param {number} page - 新页码
     */
    onPageChange(page) {
      this.currentPage = page;
      this.loadData({ currentPage: page });
    },

    /**
     * 每页条数变更
     * @param {number} size - 新的每页条数
     */
    onSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1;
      this.loadData({ currentPage: 1, pageSize: size });
    },
  },
};
</script>

<style scoped>
.stat-card-container {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 12px;
}

.stat-card {
  text-align: center;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity .2s;
}

.stat-value:hover {
  opacity: 0.75;
}

.filter-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.filter-buttons {
  flex: 1;
}

.pagination {
  margin-top: 12px;
  text-align: right;
}
</style>
