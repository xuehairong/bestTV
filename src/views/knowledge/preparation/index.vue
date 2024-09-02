<!-- 知识准备 -->
<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="关键字" prop="keywords">
          <el-input
            v-model="queryParams.keywords"
            placeholder="名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <el-form-item label="数据源" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="全部"
            clearable
            class="!w-[200px]"
          >
            <el-option label="1" :value="1" />
            <el-option label="2" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item label="创建时间">
          <el-date-picker
            :editable="false"
            class="!w-[240px]"
            v-model="queryParams.createTime"
            type="daterange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="截止时间"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <i-ep-search />
            搜索
          </el-button>
          <el-button @click="handleResetQuery">
            <i-ep-refresh />
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never" class="table-container">
      <template #header>
        <div class="flex-x-between">
          <div>
            <el-button
              v-hasPerm="['sys:user:add']"
              type="success"
              @click="handleOpenDialog()"
            >
              <i-ep-plus />
              新增
            </el-button>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" :data="pageData">
        <el-table-column key="id" label="名称" prop="id" min-width="100" />
        <el-table-column
          key="username"
          label="数据源"
          prop="username"
          min-width="100"
        >
          <template #default="scope">
            <span v-if="scope.row.g == 0">数据源1</span>
            <span v-else-if="scope.row.g == 1">数据源2</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="nickname" min-width="100">
          <template #default="scope">
            <span v-if="scope.row.g == 0">未抽取</span>
            <span v-else-if="scope.row.g == 1">抽取中</span>
            <span v-else-if="scope.row.g == 2">已抽取</span>
          </template>
        </el-table-column>
        <el-table-column
          label="导入人"
          width="100"
          prop="genderLabel"
          min-width="100"
        />
        <el-table-column label="创建时间" prop="createTime" width="180" />
        <el-table-column label="备注" prop="status" min-width="100" />
        <el-table-column
          label="操作"
          fixed="right"
          align="center"
          min-width="220"
        >
          <template #default="scope">
            <el-button
              v-hasPerm="['sys:user:edit']"
              type="primary"
              link
              size="small"
              @click="handleOpenDialog(scope.row.id)"
            >
              <i-ep-edit />
              编辑
            </el-button>
            <el-button
              v-hasPerm="['sys:user:delete']"
              type="danger"
              link
              size="small"
              @click="handleDelete(scope.row.id)"
            >
              <i-ep-delete />
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="handleQuery"
      />
    </el-card>

    <!-- 弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      @close="handleCloseDialog"
    >
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="rules"
        label-suffix=":"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="标题" prop="a">
          <el-input
            v-model="formData.a"
            placeholder="请输入标题"
            :maxlength="50"
          />
        </el-form-item>
        <el-form-item label="数据源" prop="b">
          <el-select v-model="formData.b" placeholder="全部" clearable>
            <el-option label="行业" :value="0" />
            <el-option label="企业" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="c">
          <el-input
            v-model="formData.c"
            :rows="3"
            show-word-limit
            type="textarea"
            placeholder="请输入备注"
          />
        </el-form-item>
        <el-form-item v-if="dialog.title == '新增'" label="导入方式" prop="d">
          <el-radio-group v-model="formData.d">
            <el-radio value="0">文本导入</el-radio>
            <el-radio value="1">文件导入</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="dialog.title == '新增' && formData.d == '0'"
          label="文本"
          prop="e"
        >
          <el-input
            v-model="formData.e"
            :rows="5"
            show-word-limit
            type="textarea"
            placeholder="请输入文本"
          />
        </el-form-item>
        <el-form-item
          v-if="dialog.title == '新增' && formData.d == '1'"
          label="文件"
          prop="false"
        >
          <el-upload
            class="upload-demo w-full"
            drag
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            multiple
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              Drop file here or
              <em>click to upload</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                jpg/png files with a size less than 500kb
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确定</el-button>
          <el-button @click="handleCloseDialog">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// 知识准备
defineOptions({
  name: "Preparation",
  inheritAttrs: false,
});

import UserAPI, { UserForm, UserPageQuery, UserPageVO } from "@/api/user";

// 搜索表单
const queryFormRef = ref(ElForm);
// 弹窗表单
const dataFormRef = ref(ElForm);

// 列表加载
const loading = ref(false);
// 列表
const pageData = ref<UserPageVO[]>();
// 总页数
const total = ref(0);
/** 用户查询参数  */
const queryParams = reactive<UserPageQuery>({
  pageNum: 1,
  pageSize: 10,
});
// 弹窗
const dialog = reactive({
  title: "",
  visible: false,
});
// 数据源配置表单
const formData = reactive<DatasourcesForm>({
  id: undefined,
  a: "",
  b: 0,
  c: "",
  d: "0",
  e: "",
  f: "",
});

//数据源配置表单校验
const rules = reactive({
  a: [{ required: true, message: "请输入标题", trigger: "blur" }],
  b: [{ required: true, message: "请选择数据源", trigger: "blur" }],
  d: [{ required: true, message: "请选择状态", trigger: "blur" }],
  e: [{ required: true, message: "请输入文本", trigger: "blur" }],
  f: [{ required: true, message: "请选择文件", trigger: "blur" }],
});

/** 查询 */
function handleQuery() {
  loading.value = true;
  UserAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置查询 */
function handleResetQuery() {
  queryFormRef.value.resetFields();
  queryParams.pageNum = 1;
  queryParams.deptId = undefined;
  queryParams.createTime = undefined;
  handleQuery();
}

// 打开弹窗
async function handleOpenDialog(id?: number) {
  dialog.visible = true;
  if (id) {
    dialog.title = "编辑";
    UserAPI.getFormData(id).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增";
    formData.id = undefined;
  }
}

/** 提交表单 */
function handleSubmit() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const id = formData.id;
      if (id) {
        UserAPI.update(id, formData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        UserAPI.add(formData)
          .then(() => {
            ElMessage.success("新增成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}

/** 关闭弹窗 */
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.id != undefined;
}

// 删除
async function handleDelete(id?: number) {}

onMounted(() => {
  handleQuery();
});
</script>
