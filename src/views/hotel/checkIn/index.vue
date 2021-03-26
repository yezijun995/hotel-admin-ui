<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="订单号" prop="ordersId">
        <el-input
          v-model="queryParams.ordersId"
          placeholder="请输入订单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="房间号" prop="roomNumber">
        <el-input
          v-model="queryParams.roomNumber"
          placeholder="请输入房间号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="酒店名" prop="hotelName">
        <el-input
          v-model="queryParams.hotelName"
          placeholder="请输入酒店名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="入住人数" prop="perCount">
        <el-input
          v-model="queryParams.perCount"
          placeholder="请输入入住人数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="入住人" prop="persons">
        <el-input
          v-model="queryParams.persons"
          placeholder="请输入入住人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="入住时间" prop="checkInTime">
        <el-date-picker clearable size="small"
          v-model="queryParams.checkInTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择入住时间">
        </el-date-picker>
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
<!--          v-hasPermi="['hotel:checkIn:add']"-->
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
<!--          v-hasPermi="['hotel:checkIn:edit']"-->
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
<!--          v-hasPermi="['hotel:checkIn:remove']"-->
<!--        >删除</el-button>-->
<!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hotel:checkIn:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="checkInList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="checkInId" />
      <el-table-column label="订单号" align="center" prop="ordersId" />
      <el-table-column label="房间号" align="center" prop="roomNumber" />
      <el-table-column label="酒店名" align="center" prop="hotelName" />
      <el-table-column label="入住人数" align="center" prop="perCount" />
      <el-table-column label="入住人" align="center" prop="persons" />
      <el-table-column label="身份证号" align="center" prop="idCard" />
      <el-table-column label="入住时间" align="center" prop="checkInTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.checkInTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" :formatter="orderStateFormat" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 1"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="checkIn(scope.row)"
            v-hasPermi="['hotel:checkIn:checkIn']"
          >入住</el-button>
          <el-button v-if="scope.row.status == 1"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hotel:checkIn:remove']"
          >取消</el-button>

          <el-button v-if="scope.row.status == 2"
                     size="mini"
                     type="text"
                     icon="el-icon-bell"
                     @click="checkOut(scope.row)"
                     v-hasPermi="['hotel:checkIn:checkOut']"
          >退房</el-button>
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

    <!-- 添加或修改入住退房登记管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="订单号" prop="ordersId">
          <el-input v-model="form.ordersId" :disabled="true" placeholder="请输入订单号" />
        </el-form-item>
        <el-form-item label="房间号" prop="roomNumber">
          <el-input v-model="form.roomNumber" :disabled="true" placeholder="请输入房间号" />
        </el-form-item>
        <el-form-item label="酒店名" prop="hotelName">
          <el-input v-model="form.hotelName" :disabled="true" placeholder="请输入酒店名" />
        </el-form-item>
        <el-form-item label="入住人数" prop="perCount">
          <el-input v-model="form.perCount" placeholder="请输入入住人数" />
        </el-form-item>
        <el-form-item label="入住人" prop="persons">
          <el-input v-model="form.persons" placeholder="请输入入住人" />
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="form.idCard" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="入住时间" prop="checkInTime">
          <el-date-picker clearable size="small"
            v-model="form.checkInTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择入住时间">
          </el-date-picker>
        </el-form-item>
<!--        <el-form-item label="状态">-->
<!--          <el-radio-group v-model="form.status">-->
<!--            <el-radio label="1">请选择字典生成</el-radio>-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCheckIn, getCheckIn,checkOut, delCheckIn, addCheckIn, updateCheckIn, exportCheckIn, checkIn,cancel } from "@/api/hotel/checkIn";

export default {
  name: "CheckIn",
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
      // 入住退房登记管理表格数据
      checkInList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        ordersId: null,
        roomNumber: null,
        hotelName: null,
        perCount: null,
        persons: null,
        checkInTime: null,
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
    this.getDicts("hotel_order_status").then(response => {
      this.orderStateOptions = response.data;
    });
  },
  methods: {
    /** 查询入住退房登记管理列表 */
    getList() {
      this.loading = true;
      listCheckIn(this.queryParams).then(response => {
        this.checkInList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 预订状态字典翻译
    orderStateFormat(row, column) {
      return this.selectDictLabel(this.orderStateOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        checkInId: null,
        ordersId: null,
        roomNumber: null,
        hotelId: null,
        roomTypeId: null,
        hotelName: null,
        perCount: null,
        persons: null,
        idCard: null,
        checkInTime: null,
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
      this.ids = selection.map(item => item.checkInId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加入住退房登记管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const checkInId = row.checkInId || this.ids
      getCheckIn(checkInId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改入住退房登记管理";
      });
    },
    //入住按钮操作
    checkIn(row) {
      this.reset();
      const checkInId = row.checkInId || this.ids
      getCheckIn(checkInId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改入住退房登记管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.checkInId != null) {
            checkIn(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCheckIn(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    // /** 删除按钮操作 */
    // handleDelete(row) {
    //   const checkInIds = row.checkInId || this.ids;
    //   this.$confirm('是否确认删除入住退房登记管理编号为"' + checkInIds + '"的数据项?', "警告", {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning"
    //     }).then(function() {
    //       return delCheckIn(checkInIds);
    //     }).then(() => {
    //       this.getList();
    //       this.msgSuccess("删除成功");
    //     })
    // },
    /** 取消按钮操作 */
    handleDelete(row) {
      const checkInIds = row.checkInId || this.ids;
      this.$confirm('是否确认取消此入住退房登记?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return cancel(checkInIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 退房按钮操作 */
    checkOut(row) {
      const checkInIds = row.checkInId || this.ids;
      this.$confirm('是否确认退宿此入住登记?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return checkOut(checkInIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("退房成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有入住退房登记管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportCheckIn(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
