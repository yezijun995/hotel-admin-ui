<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="queryParams.username"
          placeholder="请输入用户名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="房间类型" prop="roomTypeName">
        <el-input
          v-model="queryParams.roomTypeName"
          placeholder="请输入房间类型"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="房间数" prop="numOfRoom">
        <el-input
          v-model="queryParams.numOfRoom"
          placeholder="请输入房间数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="预订时间" prop="orderDate">
        <el-date-picker clearable size="small"
          v-model="queryParams.orderDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择预订时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="预订状态" prop="orderState">
        <el-input
          v-model="queryParams.orderState"
          placeholder="请输入预订状态"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          icon="el-icon-plus"-->
<!--          size="mini"-->
<!--          @click="handleAdd"-->
<!--          v-hasPermi="['hotel:orders:add']"-->
<!--        >新增</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="success"-->
<!--          plain-->
<!--          icon="el-icon-edit"-->
<!--          size="mini"-->
<!--          :disabled="single"-->
<!--          @click="handleUpdate"-->
<!--          v-hasPermi="['hotel:orders:edit']"-->
<!--        >修改</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="danger"-->
<!--          plain-->
<!--          icon="el-icon-delete"-->
<!--          size="mini"-->
<!--          :disabled="multiple"-->
<!--          @click="handleDelete"-->
<!--          v-hasPermi="['hotel:orders:remove']"-->
<!--        >删除</el-button>-->
<!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hotel:orders:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="ordersList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="ordersId" />
      <el-table-column label="用户名" align="center" prop="username" />
      <el-table-column label="手机" align="center" prop="phone" />
      <el-table-column label="房间类型" align="center" prop="roomTypeName" />
      <el-table-column label="房间数" align="center" prop="numOfRoom" />
      <el-table-column label="预订天数" align="center" prop="orderDays" />
      <el-table-column label="预订时间" align="center" prop="orderDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.orderDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预订状态" align="center" prop="orderState" :formatter="orderStateFormat" />
      <el-table-column label="预订费用" align="center" prop="orderCost" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hotel:orders:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hotel:orders:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改订单管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="订单类型ID" prop="ordersTypeId">
          <el-select v-model="form.ordersTypeId" placeholder="请选择订单类型ID">
            <el-option
              v-for="dict in ordersTypeIdOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机" />
        </el-form-item>
        <el-form-item label="酒店ID" prop="hotelId">
          <el-input v-model="form.hotelId" placeholder="请输入酒店ID" />
        </el-form-item>
        <el-form-item label="类型ID" prop="roomTypeId">
          <el-input v-model="form.roomTypeId" placeholder="请输入类型ID" />
        </el-form-item>
        <el-form-item label="房间类型" prop="roomTypeName">
          <el-input v-model="form.roomTypeName" placeholder="请输入房间类型" />
        </el-form-item>
        <el-form-item label="房间ID" prop="roomId">
          <el-input v-model="form.roomId" placeholder="请输入房间ID" />
        </el-form-item>
        <el-form-item label="房间数" prop="numOfRoom">
          <el-input v-model="form.numOfRoom" placeholder="请输入房间数" />
        </el-form-item>
        <el-form-item label="预订天数" prop="orderDays">
          <el-input v-model="form.orderDays" placeholder="请输入预订天数" />
        </el-form-item>
        <el-form-item label="预订时间" prop="orderDate">
          <el-date-picker clearable size="small"
            v-model="form.orderDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择预订时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预订状态" prop="orderState">
          <el-input v-model="form.orderState" placeholder="请输入预订状态" />
        </el-form-item>
        <el-form-item label="预订费用" prop="orderCost">
          <el-input v-model="form.orderCost" placeholder="请输入预订费用" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listOrders, getOrders, delOrders, addOrders, updateOrders, exportOrders } from "@/api/hotel/orders";

export default {
  name: "Orders",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 订单管理表格数据
      ordersList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 订单类型ID字典
      ordersTypeIdOptions: [],
      // 预订状态字典
      orderStateOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        username: null,
        phone: null,
        roomTypeName: null,
        numOfRoom: null,
        orderDate: null,
        orderState: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("hotel_order_type").then(response => {
      this.ordersTypeIdOptions = response.data;
    });
    this.getDicts("hotel_order_status").then(response => {
      this.orderStateOptions = response.data;
    });
  },
  methods: {
    /** 查询订单管理列表 */
    getList() {
      this.loading = true;
      listOrders(this.queryParams).then(response => {
        this.ordersList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 订单类型ID字典翻译
    ordersTypeIdFormat(row, column) {
      return this.selectDictLabel(this.ordersTypeIdOptions, row.ordersTypeId);
    },
    // 预订状态字典翻译
    orderStateFormat(row, column) {
      return this.selectDictLabel(this.orderStateOptions, row.orderState);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        ordersId: null,
        ordersTypeId: null,
        userId: null,
        username: null,
        phone: null,
        hotelId: null,
        roomTypeId: null,
        roomTypeName: null,
        roomId: null,
        numOfRoom: null,
        orderDays: null,
        orderDate: null,
        orderState: null,
        orderCost: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        status: "0",
        remark: null,
        delFlag: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.ordersId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    // /** 新增按钮操作 */
    // handleAdd() {
    //   this.reset();
    //   this.open = true;
    //   this.title = "添加订单管理";
    // },
    // /** 修改按钮操作 */
    // handleUpdate(row) {
    //   this.reset();
    //   const ordersId = row.ordersId || this.ids
    //   getOrders(ordersId).then(response => {
    //     this.form = response.data;
    //     this.open = true;
    //     this.title = "修改订单管理";
    //   });
    // },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.ordersId != null) {
            updateOrders(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOrders(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ordersIds = row.ordersId || this.ids;
      this.$confirm('是否确认删除订单管理编号为"' + ordersIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delOrders(ordersIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有订单管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportOrders(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
