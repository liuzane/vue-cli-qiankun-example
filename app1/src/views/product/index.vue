<template>
  <el-card>
    <div slot="header">
      <span>产品管理</span>
    </div>

    <!-- 统计卡片 -->
    <div class="stat-card-container">
      <el-card shadow="never" class="stat-card">
        <div class="stat-label">总产品</div>
        <div class="stat-value color-primary" @click="onReset">
          {{ statistics.total }}
        </div>
      </el-card>
      <el-card shadow="never" class="stat-card">
        <div class="stat-label">上架</div>
        <div class="stat-value color-success" @click="() => onStatusChange(ProductStatusEnum.OnSale)">
          {{ statistics.onSale }}
        </div>
      </el-card>
      <el-card shadow="never" class="stat-card">
        <div class="stat-label">缺货</div>
        <div class="stat-value color-danger" @click="() => onStatusChange(ProductStatusEnum.OutOfStock)">
          {{ statistics.outOfStock }}
        </div>
      </el-card>
      <el-card shadow="never" class="stat-card">
        <div class="stat-label">库存紧张</div>
        <div class="stat-value color-warning" @click="() => onStatusChange(ProductStatusEnum.LowStock)">
          {{ statistics.lowStock }}
        </div>
      </el-card>
      <el-card shadow="never" class="stat-card">
        <div class="stat-label">下架</div>
        <div class="stat-value color-info" @click="() => onStatusChange(ProductStatusEnum.OffSale)">
          {{ statistics.offSale }}
        </div>
      </el-card>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-row">
      <el-input
        v-model="searchText"
        placeholder="搜索产品编号或名称"
        prefix-icon="el-icon-search"
        clearable
        style="width: 300px"
        @keyup.enter.native="onSearch"
      />
      <el-select
        v-model="category"
        placeholder="选择分类"
        clearable
        style="width: 150px"
        @change="onCategoryChange"
      >
        <el-option label="全部分类" value="" />
        <el-option
          v-for="(value, key) in CATEGORY_MAP"
          :key="key"
          :label="value"
          :value="key"
        />
      </el-select>
      <el-select
        v-model="productStatus"
        placeholder="选择状态"
        clearable
        style="width: 150px"
        @change="onStatusSelectChange"
      >
        <el-option label="全部状态" value="" />
        <el-option
          v-for="(config, key) in STATUS_MAP"
          :key="key"
          :label="config.text"
          :value="key"
        />
      </el-select>
      <div>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button @click="onReset">重置</el-button>
      </div>
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="margin-left: auto"
        @click="onAdd"
      >
        新增产品
      </el-button>
    </div>

    <!-- 表格 -->
    <el-table
      :data="dataSource"
      v-loading="loading"
      stripe
      border
      style="width: 100%;"
    >
      <el-table-column prop="productNo" label="产品编号" min-width="120" fixed />
      <el-table-column prop="name" label="产品名称" min-width="300" show-overflow-tooltip />
      <el-table-column prop="category" label="分类" min-width="120">
        <template slot-scope="{ row }">
          {{ CATEGORY_MAP[row.category] }}
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格" min-width="120" sortable>
        <template slot-scope="{ row }">
          ¥ {{ row.price.toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="库存" min-width="100">
        <template slot-scope="{ row }">
          <el-tag
            :type="getStockTagType(row.stock)"
            size="small"
          >
            {{ row.stock }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sales" label="销量" min-width="100" sortable />
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
      <el-table-column prop="supplier" label="供应商" min-width="150" show-overflow-tooltip />
      <el-table-column prop="createTime" label="创建时间" min-width="180" sortable />
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

    <!-- 查看产品对话框 -->
    <el-dialog
      :title="`产品详情 - ${viewRecord ? viewRecord.productNo : ''}`"
      :visible.sync="viewModalVisible"
      width="700px"
    >
      <el-descriptions v-if="viewRecord" :column="2" border>
        <el-descriptions-item label="产品编号" :span="2">{{ viewRecord.productNo }}</el-descriptions-item>
        <el-descriptions-item label="产品名称" :span="2">{{ viewRecord.name }}</el-descriptions-item>
        <el-descriptions-item label="产品分类">{{ CATEGORY_MAP[viewRecord.category] }}</el-descriptions-item>
        <el-descriptions-item label="产品状态">
          <el-tag
            :type="STATUS_MAP[viewRecord.status] ? STATUS_MAP[viewRecord.status].type : 'info'"
            size="small"
          >
            {{ STATUS_MAP[viewRecord.status] ? STATUS_MAP[viewRecord.status].text : viewRecord.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="产品价格">¥ {{ viewRecord.price.toLocaleString() }}</el-descriptions-item>
        <el-descriptions-item label="库存数量">{{ viewRecord.stock }}</el-descriptions-item>
        <el-descriptions-item label="销量">{{ viewRecord.sales }}</el-descriptions-item>
        <el-descriptions-item label="供应商">{{ viewRecord.supplier }}</el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">{{ viewRecord.createTime }}</el-descriptions-item>
        <el-descriptions-item label="产品描述" :span="2">{{ viewRecord.description }}</el-descriptions-item>
      </el-descriptions>
      <span slot="footer">
        <el-button @click="viewModalVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 新增/编辑产品对话框 -->
    <el-dialog
      :title="editRecord ? `编辑产品 - ${editRecord.productNo}` : '新增产品'"
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
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="产品价格" prop="price">
          <el-input-number
            v-model="editForm.price"
            :precision="2"
            :min="0.01"
            style="width: 100%"
            placeholder="请输入价格"
          />
        </el-form-item>
        <el-form-item label="库存数量" prop="stock">
          <el-input-number
            v-model="editForm.stock"
            :min="0"
            style="width: 100%"
            placeholder="请输入库存数量"
          />
        </el-form-item>
        <el-form-item label="产品分类" prop="category">
          <el-select v-model="editForm.category" placeholder="请选择分类">
            <el-option
              v-for="(value, key) in CATEGORY_MAP"
              :key="key"
              :label="value"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="产品状态" prop="status">
          <el-select v-model="editForm.status" placeholder="请选择状态">
            <el-option
              v-for="(config, key) in STATUS_MAP"
              :key="key"
              :label="config.text"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="供应商" prop="supplier">
          <el-input v-model="editForm.supplier" placeholder="请输入供应商" />
        </el-form-item>
        <el-form-item label="产品描述" prop="description">
          <el-input
            v-model="editForm.description"
            type="textarea"
            :rows="2"
            placeholder="请输入产品描述"
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
import {
  ProductStatusEnum,
  ProductCategoryEnum,
  STATUS_MAP,
  CATEGORY_MAP,
} from '@/enums/product.enum';

// 数据服务
import ProductService from '@/services/ProductService';

const productService = new ProductService();

export default {
  name: 'Product',

  /**
   * 组件数据模型
   * @property {Object} STATUS_MAP - 状态映射（用于展示标签）
   * @property {Object} CATEGORY_MAP - 分类映射
   * @property {Array} dataSource - 当前页的产品列表
   * @property {number} total - 产品总数
   * @property {boolean} loading - 表格加载状态
   * @property {string} searchText - 搜索框内容（编号或名称）
   * @property {string} category - 筛选的分类
   * @property {string} productStatus - 筛选的产品状态
   * @property {number} currentPage - 当前页码
   * @property {number} pageSize - 每页条数
   * @property {Object} statistics - 各状态产品统计
   * @property {boolean} viewModalVisible - 查看对话框显隐
   * @property {boolean} editModalVisible - 编辑/新增对话框显隐
   * @property {Object|null} viewRecord - 当前查看的产品记录
   * @property {Object|null} editRecord - 当前编辑的产品记录（原始数据，为 null 表示新增）
   * @property {Object} editForm - 编辑/新增表单的数据
   * @property {Object} editFormRules - 编辑/新增表单的验证规则
   */
  data() {
    return {
      STATUS_MAP,
      CATEGORY_MAP,
      dataSource: [],
      total: 0,
      loading: true,
      searchText: '',
      category: '',
      productStatus: '',
      currentPage: 1,
      pageSize: 10,
      statistics: {
        total: 0,
        onSale: 0,
        offSale: 0,
        outOfStock: 0,
        lowStock: 0,
      },
      viewModalVisible: false,
      editModalVisible: false,
      viewRecord: null,
      editRecord: null,
      editForm: {
        name: '',
        price: 0,
        stock: 0,
        category: ProductCategoryEnum.Electronics,
        status: ProductStatusEnum.OnSale,
        supplier: '',
        description: '',
      },
      editFormRules: {
        name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        price: [
          { required: true, message: '请输入产品价格', trigger: 'blur' },
          { type: 'number', min: 0.01, message: '价格必须大于0', trigger: 'blur' },
        ],
        stock: [
          { required: true, message: '请输入库存数量', trigger: 'blur' },
          { type: 'integer', min: 0, message: '库存数量必须大于等于0', trigger: 'blur' },
        ],
        category: [{ required: true, message: '请选择产品分类', trigger: 'change' }],
        status: [{ required: true, message: '请选择产品状态', trigger: 'change' }],
        supplier: [{ required: true, message: '请输入供应商', trigger: 'blur' }],
      },
    };
  },

  /**
   * 组件挂载钩子：如果路由查询参数带有 name，则自动搜索该名称；否则正常加载列表
   */
  mounted() {
    const name = this.$route.query.name;
    if (name) {
      this.searchText = name;
      this.loadData({ searchText: name });
    } else {
      this.loadData();
    }
  },

  methods: {
    /**
     * 根据库存数量返回对应的标签类型（用于库存列的标签颜色）
     * @param {number} stock - 库存数量
     * @returns {string} 标签类型（'danger' | 'warning' | 'success'）
     */
    getStockTagType(stock) {
      if (stock === 0) {
        return 'danger';
      } else if (stock < 10) {
        return 'warning';
      }
      return 'success';
    },

    /**
     * 加载产品数据（分页 + 筛选）
     * @param {Object} [params] - 可选参数，可覆盖当前分页/搜索/分类/状态
     * @param {number} [params.currentPage] - 当前页
     * @param {number} [params.pageSize] - 每页条数
     * @param {string} [params.searchText] - 搜索文本
     * @param {string} [params.category] - 分类
     * @param {string} [params.status] - 产品状态
     */
    async loadData(params) {
      this.loading = true;
      try {
        const queryParams = {
          currentPage: params && 'currentPage' in params ? params.currentPage : this.currentPage,
          pageSize: params && 'pageSize' in params ? params.pageSize : this.pageSize,
          searchText: params && 'searchText' in params ? params.searchText : this.searchText,
          category: params && 'category' in params ? params.category : this.category,
          status: params && 'status' in params ? params.status : this.productStatus,
        };
        const { data, total } = await productService.getProductsByPage(queryParams);
        this.dataSource = data;
        this.total = total;

        // 获取全部产品用于统计各状态数量（实际项目可改为后端统计接口）
        const allProducts = await productService.getAllProducts();
        this.statistics = {
          total: allProducts.length,
          onSale: allProducts.filter(item => item.status === ProductStatusEnum.OnSale).length,
          offSale: allProducts.filter(item => item.status === ProductStatusEnum.OffSale).length,
          outOfStock: allProducts.filter(item => item.status === ProductStatusEnum.OutOfStock).length,
          lowStock: allProducts.filter(item => item.stock > 0 && item.stock < 10).length,
        };
      } catch (error) {
        console.error('加载数据失败:', error);
        this.$message.error('加载产品数据失败，请刷新页面重试');
      } finally {
        this.loading = false;
      }
    },

    /**
     * 搜索输入框内容变化时重置到第一页（用于后续搜索时，但实际未直接调用，仅示例）
     */
    onSearchInput() {
      this.currentPage = 1;
    },

    /**
     * 分类下拉变更时重置到第一页（用于后续筛选，实际配合 @change 调用）
     */
    onCategoryChange() {
      this.currentPage = 1;
    },

    /**
     * 状态下拉变更时重置到第一页
     */
    onStatusSelectChange() {
      this.currentPage = 1;
    },

    /**
     * 打开查看产品详情对话框
     * @param {Object} record - 要查看的产品记录
     */
    onView(record) {
      this.viewRecord = record;
      this.viewModalVisible = true;
    },

    /**
     * 打开编辑产品对话框，并填充当前记录的数据
     * @param {Object} record - 要编辑的产品记录
     */
    onEdit(record) {
      this.editRecord = record;
      this.editForm = {
        name: record.name,
        price: record.price,
        stock: record.stock,
        category: record.category,
        status: record.status,
        supplier: record.supplier,
        description: record.description,
      };
      this.editModalVisible = true;
    },

    /**
     * 打开新增产品对话框，重置表单
     */
    onAdd() {
      this.editRecord = null;
      this.editForm = {
        name: '',
        price: 0,
        stock: 0,
        category: ProductCategoryEnum.Electronics,
        status: ProductStatusEnum.OnSale,
        supplier: '',
        description: '',
      };
      this.editModalVisible = true;
    },

    /**
     * 编辑/新增对话框关闭后的回调：重置表单验证状态
     */
    onEditDialogClosed() {
      this.$refs.editForm && this.$refs.editForm.resetFields();
    },

    /**
     * 确认删除产品（弹出二次确认框）
     * @param {Object} record - 要删除的产品记录
     * @param {string} record.productNo - 产品编号
     * @param {number|string} record.id - 产品ID
     */
    confirmDelete(record) {
      this.$confirm(
        `确定要删除产品 ${record.productNo} 吗？此操作不可恢复。`,
        '确认删除',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(async () => {
          try {
            await productService.deleteProduct(record.id);
            await this.loadData();
            this.$message.success(`删除产品：${record.productNo} 成功`);
          } catch (error) {
            console.error('删除失败:', error);
            this.$message.error('删除失败，请重试');
          }
        })
        .catch(() => {});
    },

    /**
     * 保存编辑或新增的产品数据
     * 若 editRecord 存在则更新，否则新增
     */
    async onEditSave() {
      try {
        await this.$refs.editForm.validate();
        if (this.editRecord) {
          // 更新操作
          const updatedRecord = {
            ...this.editRecord,
            name: this.editForm.name,
            price: this.editForm.price,
            stock: this.editForm.stock,
            category: this.editForm.category,
            status: this.editForm.status,
            supplier: this.editForm.supplier,
            description: this.editForm.description,
          };
          await productService.updateProduct(updatedRecord);
          await this.loadData();
          this.editModalVisible = false;
          this.$message.success(`产品 ${this.editRecord.productNo} 更新成功`);
        } else {
          // 新增操作
          const newProduct = {
            id: Date.now(),
            productNo: `P${Date.now().toString().slice(-8)}`,
            name: this.editForm.name,
            price: this.editForm.price,
            stock: this.editForm.stock,
            sales: 0,
            category: this.editForm.category,
            status: this.editForm.status,
            supplier: this.editForm.supplier,
            createTime: new Date()
              .toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })
              .replace(/\//g, '-'),
            description: this.editForm.description,
          };
          await productService.insertProduct(newProduct);
          await this.loadData();
          this.editModalVisible = false;
          this.$message.success(`产品 ${newProduct.name} 创建成功`);
        }
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
      this.category = '';
      this.productStatus = '';
      this.currentPage = 1;
      this.loadData({ searchText: '', category: '', status: '', currentPage: 1 });
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
     * @param {string} status - 产品状态枚举值
     */
    onStatusChange(status) {
      this.searchText = '';
      this.category = '';
      this.productStatus = status;
      this.currentPage = 1;
      this.loadData({ searchText: '', category: '', status, currentPage: 1 });
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
  transition: opacity 0.2s;
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
