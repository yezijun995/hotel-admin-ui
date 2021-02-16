<template>
  <div class="app-container">
    <el-col :span="4" :xs="24">
      <div class="head-container">
        <el-input
          v-model="hotelName"
          placeholder="请输入酒店名称"
          clearable
          size="small"
          prefix-icon="el-icon-search"
          style="margin-bottom: 20px"
        />
      </div>
      <div class="head-container">
        <el-tree
          :data="hotelOptions"
          :props="defaultProps"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          ref="tree"
          default-expand-all
          @node-click="handleNodeClick"
        />
      </div>
    </el-col>

    <el-col :span="20" :xs="24">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="房间号" prop="number">
          <el-input
            v-model="queryParams.number"
            placeholder="请输入房间号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="房间类型" prop="typeId">
          <el-select v-model="queryParams.typeName" placeholder="请选择类型名" clearable size="small">
            <el-option
              v-for="roomType in typeOptions"
              :key="roomType.id"
              :label="roomType.label"
              :value="roomType.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input
            v-model="queryParams.price"
            placeholder="请输入价格"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="折扣" prop="discount">
          <el-input
            v-model="queryParams.discount"
            placeholder="请输入折扣"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="房间状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择房间状态" clearable size="small">
            <el-option
              v-for="dict in statusOptions"
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
            v-hasPermi="['room:room:add']"
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
            v-hasPermi="['room:room:edit']"
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
            v-hasPermi="['room:room:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['room:room:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="roomList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="roomId" />
        <el-table-column label="房间号" align="center" prop="number" />
        <el-table-column label="类型名" align="center" prop="typeName" />
        <el-table-column label="价格" align="center" prop="price" />
        <el-table-column label="折扣" align="center" prop="discount" />
        <el-table-column label="房间状态" align="center" prop="status" :formatter="statusFormat" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['room:room:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['room:room:remove']"
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

      <!-- 添加或修改房间管理对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="房间号" prop="number">
            <el-input v-model="form.number" placeholder="请输入房间号" />
          </el-form-item>
          <el-form-item label="房间类型" prop="typeId">
            <el-select v-model="form.typeId" placeholder="请选择房间类型">
              <el-option
                v-for="roomType in typeOptions"
                :key="roomType.id"
                :label="roomType.label"
                :value="roomType.id"/>
<!--              <treeselect v-model="form.typeId" :options="typeOptions" :show-count="true" placeholder="请选择房间类型" />-->
            </el-select>
          </el-form-item>
          <el-form-item label="归属酒店" prop="hotelId">
            <treeselect v-model="form.hotelId" :options="hotelOptions" :show-count="true" placeholder="请选择归属酒店" />
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input v-model="form.price" placeholder="请输入价格" />
          </el-form-item>
          <el-form-item label="折扣" prop="discount">
            <el-input v-model="form.discount" placeholder="请输入折扣" />
          </el-form-item>
          <el-form-item label="房间状态">
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
    </el-col>

  </div>
</template>

<script>
import { listRoom, getRoom, delRoom, addRoom, updateRoom, exportRoom } from "@/api/hotel/room";
import { hotelTreeselect } from "@/api/hotel/wineshop";
import { roomTypeTreeselect } from "@/api/hotel/roomType";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "Room",
  components: {
    Treeselect
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
      // 房间管理表格数据
      roomList: [],
      // 酒店名称
      hotelName: undefined,
      // 酒店树选项
      hotelOptions: undefined,
      // 酒店类型树
      typeOptions: undefined,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 房间状态字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        number: null,
        typeName: null,
        typeId: undefined,
        hotelId: undefined,
        price: null,
        discount: null,
        status: null,
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表单校验
      rules: {
        number: [
          { required: true, message: "房间号不能为空", trigger: "blur" }
        ],
        typeName: [
          { required: true, message: "类型名不能为空", trigger: "change" }
        ],
        hotelName: [
          { required: true, message: "酒店名不能为空", trigger: "change" }
        ],
        price: [
          { required: true, message: "价格不能为空", trigger: "blur" }
        ],
      }
    };
  },
  watch: {
    // 根据名称筛选酒店树
    hotelName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getHotelTreeselect();
    this.getRoomTypeTreeselect();
    this.getDicts("hotel_room").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询房间管理列表 */
    getList() {
      this.loading = true;
      listRoom(this.queryParams).then(response => {
        this.roomList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 房间状态字典翻译
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
        roomId: null,
        number: null,
        typeId: null,
        hotelId: null,
        typeName: null,
        hotelName: null,
        price: null,
        discount: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        status: "0",
        remark: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 查询酒店下拉树结构 */
    getHotelTreeselect() {
      hotelTreeselect().then(response => {
        this.hotelOptions = response.data;
      });
    },
    /** 查询房间类型下拉树结构 */
    getRoomTypeTreeselect() {
      roomTypeTreeselect().then(response => {
        this.typeOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.hotelId = data.id;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.roomId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getHotelTreeselect();
      this.getRoomTypeTreeselect()
      this.open = true;
      this.title = "添加房间管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getHotelTreeselect();
      this.getRoomTypeTreeselect()
      const roomId = row.roomId || this.ids
      getRoom(roomId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改房间管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.roomId != null) {
            updateRoom(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRoom(this.form).then(response => {
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
      const roomIds = row.roomId || this.ids;
      this.$confirm('是否确认删除房间管理编号为"' + roomIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRoom(roomIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有房间管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportRoom(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
