<template>
  <el-card>
    <div slot="header">
      <span>用户管理</span>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-row">
      <el-input
        v-model="searchText"
        placeholder="搜索用户姓名或邮箱"
        prefix-icon="el-icon-search"
        clearable
        style="width: 300px"
        @keyup.enter.native="onSearch"
      />
      <el-select
        v-model="userStatus"
        placeholder="选择状态"
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
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="margin-left: auto"
        @click="onAdd"
      >
        新增用户
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
      <el-table-column prop="id" label="ID" width="80" fixed />
      <el-table-column prop="name" label="姓名" min-width="120" />
      <el-table-column prop="email" label="邮箱" min-width="200" show-overflow-tooltip />
      <el-table-column prop="phone" label="手机号" min-width="130" />
      <el-table-column label="状态" min-width="120">
        <template slot-scope="{ row }">
          <el-tag
            :type="STATUS_MAP[row.status] ? STATUS_MAP[row.status].type : 'info'"
            size="small"
          >
            {{ STATUS_MAP[row.status] ? STATUS_MAP[row.status].text : row.status }}
          </el-tag>
          <el-switch
            v-model="row.status"
            :active-value="UserStatusEnum.Active"
            :inactive-value="UserStatusEnum.Disabled"
            style="margin-left: 8px"
            @change="(val) => onToggleStatus(val, row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="role" label="角色" min-width="120" />
      <el-table-column prop="lastLoginTime" label="最后登录" min-width="180" sortable />
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

    <!-- 查看用户对话框 -->
    <el-dialog
      :title="`用户详情 - ${viewRecord ? viewRecord.name : ''}`"
      :visible.sync="viewModalVisible"
      width="700px"
    >
      <el-descriptions v-if="viewRecord" :column="2" border>
        <el-descriptions-item label="用户ID">{{ viewRecord.id }}</el-descriptions-item>
        <el-descriptions-item label="用户角色">{{ viewRecord.role }}</el-descriptions-item>
        <el-descriptions-item label="用户姓名" :span="2">{{ viewRecord.name }}</el-descriptions-item>
        <el-descriptions-item label="电子邮箱">{{ viewRecord.email }}</el-descriptions-item>
        <el-descriptions-item label="手机号码">{{ viewRecord.phone }}</el-descriptions-item>
        <el-descriptions-item label="用户状态">
          <el-tag
            :type="STATUS_MAP[viewRecord.status] ? STATUS_MAP[viewRecord.status].type : 'info'"
            size="small"
          >
            {{ STATUS_MAP[viewRecord.status] ? STATUS_MAP[viewRecord.status].text : viewRecord.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">{{ viewRecord.createTime }}</el-descriptions-item>
        <el-descriptions-item label="最后登录" :span="2">{{ viewRecord.lastLoginTime || '-' }}</el-descriptions-item>
      </el-descriptions>
      <span slot="footer">
        <el-button @click="viewModalVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <!-- 新增/编辑用户对话框 -->
    <el-dialog
      :title="editRecord ? `编辑用户 - ${editRecord.name}` : '新增用户'"
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
        <el-form-item label="用户姓名" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入用户姓名" />
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入电子邮箱" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="editForm.phone" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="用户状态" prop="status">
          <el-select v-model="editForm.status" placeholder="请选择状态">
            <el-option
              v-for="(config, key) in STATUS_MAP"
              :key="key"
              :label="config.text"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户角色" prop="role">
          <el-select v-model="editForm.role" placeholder="请选择角色">
            <el-option value="超级管理员">超级管理员</el-option>
            <el-option value="管理员">管理员</el-option>
            <el-option value="产品经理">产品经理</el-option>
            <el-option value="运营专员">运营专员</el-option>
            <el-option value="普通用户">普通用户</el-option>
            <el-option value="访客">访客</el-option>
            <el-option value="数据分析师">数据分析师</el-option>
            <el-option value="财务人员">财务人员</el-option>
          </el-select>
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
// 枚举定义
import { UserStatusEnum, STATUS_MAP } from '@/enums/user.enum';

// 数据服务
import UserService from '@/services/UserService';

const userService = new UserService();

export default {
  name: 'User',

  /**
   * 组件数据模型
   * @property {Object} STATUS_MAP - 状态映射（用于展示标签）
   * @property {Object} UserStatusEnum - 用户状态枚举（用于开关）
   * @property {Array} dataSource - 当前页的用户列表
   * @property {number} total - 用户总数
   * @property {boolean} loading - 表格加载状态
   * @property {string} searchText - 搜索框内容（姓名或邮箱）
   * @property {string} userStatus - 筛选的用户状态
   * @property {number} currentPage - 当前页码
   * @property {number} pageSize - 每页条数
   * @property {boolean} viewModalVisible - 查看对话框显隐
   * @property {boolean} editModalVisible - 编辑/新增对话框显隐
   * @property {Object|null} viewRecord - 当前查看的用户记录
   * @property {Object|null} editRecord - 当前编辑的用户记录（为 null 表示新增）
   * @property {Object} editForm - 编辑/新增表单的数据
   * @property {Object} editFormRules - 编辑/新增表单的验证规则
   */
  data() {
    return {
      STATUS_MAP,
      UserStatusEnum,
      dataSource: [],
      total: 0,
      loading: true,
      searchText: '',
      userStatus: '',
      currentPage: 1,
      pageSize: 10,
      viewModalVisible: false,
      editModalVisible: false,
      viewRecord: null,
      editRecord: null,
      editForm: {
        name: '',
        email: '',
        phone: '',
        status: UserStatusEnum.Active,
        role: '',
      },
      editFormRules: {
        name: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入电子邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' },
        ],
        status: [{ required: true, message: '请选择用户状态', trigger: 'change' }],
        role: [{ required: true, message: '请选择用户角色', trigger: 'change' }],
      },
    };
  },

  /**
   * 组件挂载钩子：如果路由查询参数带有 name，则自动搜索该姓名；否则正常加载列表
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
     * 加载用户数据（分页 + 筛选）
     * @param {Object} [params] - 可选参数，可覆盖当前分页/搜索/状态
     * @param {number} [params.currentPage] - 当前页
     * @param {number} [params.pageSize] - 每页条数
     * @param {string} [params.searchText] - 搜索文本
     * @param {string} [params.status] - 用户状态
     */
    async loadData(params) {
      this.loading = true;
      try {
        const queryParams = {
          currentPage: params && 'currentPage' in params ? params.currentPage : this.currentPage,
          pageSize: params && 'pageSize' in params ? params.pageSize : this.pageSize,
          searchText: params && 'searchText' in params ? params.searchText : this.searchText,
          status: params && 'status' in params ? params.status : this.userStatus,
        };
        const { data, total } = await userService.getUsersByPage(queryParams);
        this.dataSource = data;
        this.total = total;
      } catch (error) {
        console.error('加载数据失败:', error);
        this.$message.error('加载用户数据失败，请刷新页面重试');
      } finally {
        this.loading = false;
      }
    },

    /**
     * 打开查看用户详情对话框
     * @param {Object} record - 要查看的用户记录
     */
    onView(record) {
      this.viewRecord = record;
      this.viewModalVisible = true;
    },

    /**
     * 打开编辑用户对话框，并填充当前记录的数据
     * @param {Object} record - 要编辑的用户记录
     */
    onEdit(record) {
      this.editRecord = record;
      this.editForm = {
        name: record.name,
        email: record.email,
        phone: record.phone,
        status: record.status,
        role: record.role,
      };
      this.editModalVisible = true;
    },

    /**
     * 打开新增用户对话框，重置表单
     */
    onAdd() {
      this.editRecord = null;
      this.editForm = {
        name: '',
        email: '',
        phone: '',
        status: UserStatusEnum.Active,
        role: '',
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
     * 确认删除用户（弹出二次确认框）
     * @param {Object} record - 要删除的用户记录
     * @param {number|string} record.id - 用户ID
     * @param {string} record.name - 用户姓名
     */
    confirmDelete(record) {
      this.$confirm(
        `确定要删除用户 ${record.name} 吗？此操作不可恢复。`,
        '确认删除',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(async () => {
          try {
            await userService.deleteUser(record.id);
            await this.loadData();
            this.$message.success(`删除用户：${record.name} 成功`);
          } catch (error) {
            console.error('删除失败:', error);
            this.$message.error('删除失败，请重试');
          }
        })
        .catch(() => {});
    },

    /**
     * 保存编辑或新增的用户数据
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
            email: this.editForm.email,
            phone: this.editForm.phone,
            status: this.editForm.status,
            role: this.editForm.role,
          };
          await userService.updateUser(updatedRecord);
          await this.loadData();
          this.editModalVisible = false;
          this.$message.success(`用户 ${this.editRecord.name} 更新成功`);
        } else {
          // 新增操作
          const newUser = {
            id: Date.now(),
            name: this.editForm.name,
            email: this.editForm.email,
            phone: this.editForm.phone,
            status: this.editForm.status,
            role: this.editForm.role,
            roleId: 5,
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
            lastLoginTime: '-',
          };
          await userService.insertUser(newUser);
          await this.loadData();
          this.editModalVisible = false;
          this.$message.success(`用户 ${newUser.name} 创建成功`);
        }
      } catch (error) {
        if (error !== false) {
          console.error('更新失败:', error);
        }
      }
    },

    /**
     * 切换用户状态（开关事件）
     * @param {string|number} val - 新状态值（Active 或 Disabled）
     * @param {Object} record - 当前行用户记录
     */
    async onToggleStatus(val, record) {
      try {
        const newStatus = val;
        const updatedRecord = {
          ...record,
          status: newStatus,
        };
        await userService.updateUser(updatedRecord);
        await this.loadData();
        this.$message.success(`用户 "${record.name}" 状态已更新为「${STATUS_MAP[newStatus].text}」`);
      } catch (error) {
        console.error('状态切换失败:', error);
        this.$message.error('状态切换失败，请重试');
      }
    },

    /**
     * 重置所有筛选条件并重新加载数据
     */
    onReset() {
      this.searchText = '';
      this.userStatus = '';
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
