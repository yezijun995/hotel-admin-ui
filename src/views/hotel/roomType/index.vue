<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="类型名" prop="typeName">
        <el-input
          v-model="queryParams.typeName"
          placeholder="请输入类型名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="房间大小" prop="area">
        <el-input
          v-model="queryParams.area"
          placeholder="请输入房间大小"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="床位" prop="bedNum">
        <el-input
          v-model="queryParams.bedNum"
          placeholder="请输入床位"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="窗户" prop="window">
        <el-select v-model="queryParams.window" placeholder="请选择窗户" clearable size="small">
          <el-option
            v-for="dict in windowOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['hotel:roomType:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['hotel:roomType:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['hotel:roomType:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hotel:roomType:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="roomTypeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="roomTypeId" />
      <el-table-column label="类型名" align="center" prop="typeName" />
      <el-table-column label="房间大小" align="center" prop="area" />
      <el-table-column label="床位" align="center" prop="bedNum" />
      <el-table-column label="床位大小" align="center" prop="bedSize" :formatter="bedSizeFormat" />
      <el-table-column label="窗户" align="center" prop="window" :formatter="windowFormat" />
      <el-table-column label="价格" align="center" prop="price" />
      <el-table-column label="折扣" align="center" prop="discount" />
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hotel:roomType:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hotel:roomType:remove']"
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

    <!-- 添加或修改房间类型对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="类型名" prop="typeName">
          <el-input v-model="form.typeName" placeholder="请输入类型名" />
        </el-form-item>
        <el-form-item label="房间大小" prop="area">
          <el-input v-model="form.area" placeholder="请输入房间大小" oninput="value=value.replace(/^\.+|[^\d.]/g,'')">
            <template slot="append">m</template>
          </el-input>
        </el-form-item>
        <el-form-item label="床位" prop="bedNum">
          <el-input v-model="form.bedNum" placeholder="请输入床位" />
        </el-form-item>
        <el-form-item label="床位大小" prop="bedSize">
          <el-select v-model="form.bedSize" placeholder="请选择床位大小">
            <el-option
              v-for="dict in bedSizeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="窗户">
          <el-radio-group v-model="form.window">
            <el-radio
              v-for="dict in windowOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="折扣" prop="discount">
          <el-input v-model="form.discount" placeholder="请输入折扣" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
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
import { listRoomType, getRoomType, delRoomType, addRoomType, updateRoomType, exportRoomType } from "@/api/hotel/roomType";

export default {
  name: "RoomType",
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
      // 房间类型表格数据
      roomTypeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 床位大小字典
      bedSizeOptions: [],
      // 窗户字典
      windowOptions: [],
      // 状态字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        typeName: null,
        area: null,
        bedNum: null,
        window: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        typeName: [
          { required: true, message: "类型名不能为空", trigger: "blur" }
        ],
        area: [
          { required: true, message: "房间大小不能为空", trigger: "blur" }
        ],
        bedNum: [
          { required: true, message: "床位不能为空", trigger: "blur" }
        ],
        bedSize: [
          { required: true, message: "床位大小不能为空", trigger: "change" }
        ],
        window: [
          { required: true, message: "窗户不能为空", trigger: "blur" }
        ],
        price: [
          { required: true, message: "价格不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("hotel_room_bed").then(response => {
      this.bedSizeOptions = response.data;
    });
    this.getDicts("hotel_room_window").then(response => {
      this.windowOptions = response.data;
    });
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询房间类型列表 */
    getList() {
      this.loading = true;
      listRoomType(this.queryParams).then(response => {
        this.roomTypeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 床位大小字典翻译
    bedSizeFormat(row, column) {
      return this.selectDictLabel(this.bedSizeOptions, row.bedSize);
    },
    // 窗户字典翻译
    windowFormat(row, column) {
      return this.selectDictLabel(this.windowOptions, row.window);
    },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        roomTypeId: null,
        typeName: null,
        area: null,
        bedNum: null,
        bedSize: null,
        window: "0",
        price: null,
        discount: null,
        createor: null,
        createTime: null,
        updater: null,
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
      this.ids = selection.map(item => item.roomTypeId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加房间类型";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const roomTypeId = row.roomTypeId || this.ids
      getRoomType(roomTypeId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改房间类型";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.roomTypeId != null) {
            updateRoomType(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRoomType(this.form).then(response => {
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
      const roomTypeIds = row.roomTypeId || this.ids;
      this.$confirm('是否确认删除房间类型编号为"' + roomTypeIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRoomType(roomTypeIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有房间类型数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportRoomType(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
