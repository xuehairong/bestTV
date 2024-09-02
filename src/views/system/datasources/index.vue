<!-- 数据源配置 -->
<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入名称"
            clearable
            class="!w-[200px]"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="全部"
            clearable
            class="!w-[100px]"
          >
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item prop="createTime" label="时间">
          <el-date-picker
            :editable="false"
            class="!w-[240px]"
            v-model="queryParams.time"
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
        <el-button
          type="success"
          v-hasPerm="['sys:datasources:add']"
          @click="handleOpenDialog()"
        >
          <i-ep-plus />
          新增
        </el-button>
        <el-button
          color="#626aef"
          v-hasPerm="['sys:datasources:refresh']"
          @click="handleRefreshCache()"
        >
          <el-icon><RefreshLeft /></el-icon>
          刷新缓存
        </el-button>
      </template>

      <el-table ref="dataTableRef" v-loading="loading" :data="pageData">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column key="a" label="名称" prop="a" min-width="100" />
        <el-table-column key="b" label="别名" prop="b" min-width="100" />
        <el-table-column key="c" label="类别" prop="c" min-width="100">
          <template #default="scope">
            <span v-if="scope.row.c == 0">通用</span>
            <span v-else-if="scope.row.c == 1">行业</span>
            <span v-else-if="scope.row.c == 2">企业</span>
          </template>
        </el-table-column>
        <el-table-column key="d" label="储存" prop="d" min-width="100">
          <template #default="scope">
            <span v-if="scope.row.d == 0">cloud</span>
            <span v-else-if="scope.row.d == 1">DB</span>
          </template>
        </el-table-column>
        <el-table-column key="e" label="是否为空" prop="e" min-width="100">
          <template #default="scope">
            <span v-if="scope.row.e == 0">是</span>
            <span v-else-if="scope.row.e == 1">否</span>
          </template>
        </el-table-column>
        <el-table-column key="f" label="状态" prop="f" min-width="100">
          <template #default="scope">
            <span v-if="scope.row.f == 0">启用</span>
            <span v-else-if="scope.row.f == 1">禁用</span>
          </template>
        </el-table-column>
        <el-table-column key="g" label="在线" prop="g" min-width="100">
          <template #default="scope">
            <span v-if="scope.row.g == 0">是</span>
            <span v-else-if="scope.row.g == 1">否</span>
          </template>
        </el-table-column>
        <el-table-column
          key="h"
          label="最后更新时间"
          prop="h"
          min-width="180"
        />
        <el-table-column key="i" label="备注" prop="i" min-width="180" />

        <el-table-column fixed="right" align="center" label="操作" width="220">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              link
              v-hasPerm="['sys:datasources:update']"
              @click="handleOpenDialog(scope.row.id)"
            >
              <i-ep-edit />
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              link
              v-hasPerm="['sys:datasources:delete']"
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

    <!-- 数据源配置表单弹窗 -->
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
        <el-form-item label="名称" prop="a">
          <el-input
            v-model="formData.a"
            placeholder="请输入名称"
            :maxlength="50"
          />
        </el-form-item>
        <el-form-item label="别名" prop="b">
          <el-input
            v-model="formData.b"
            placeholder="请输入别名"
            :maxlength="50"
          />
        </el-form-item>
        <el-form-item label="状态" prop="c">
          <el-select v-model="formData.c" placeholder="全部" clearable>
            <el-option label="启用" :value="0" />
            <el-option label="禁用" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="d">
          <el-input
            v-model="formData.d"
            :rows="3"
            show-word-limit
            type="textarea"
            placeholder="请输入备注"
          />
        </el-form-item>
        <el-form-item v-if="dialog.title == '新增'" label="文件" prop="e">
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
// 数据源配置
defineOptions({
  name: "Datasources",
  inheritAttrs: false,
});

import ConfigAPI, {
  DatasourcesPageVO,
  DatasourcesForm,
  DatasourcesPageQuery,
} from "@/api/datasources";

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<DatasourcesPageQuery>({
  pageNum: 1,
  pageSize: 10,
});

// 数据源配置表格数据
const pageData = ref<DatasourcesPageVO[]>([]);

// 弹窗
const dialog = reactive({
  title: "",
  visible: false,
});
// 数据源配置表单
const formData = reactive<DatasourcesForm>({
  id: undefined,
  a: "",
  b: "",
  c: 1,
  d: "",
});

//数据源配置表单校验
const rules = reactive({
  a: [{ required: true, message: "请输入名称", trigger: "blur" }],
  b: [{ required: true, message: "请输入别名", trigger: "blur" }],
  c: [{ required: true, message: "请选择状态", trigger: "blur" }],
  e: [{ required: true, message: "请选择文件", trigger: "blur" }],
});

/** 查询数据源配置 */
function handleQuery() {
  loading.value = true;
  ConfigAPI.getPage(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}
/** 重置数据源配置查询 */
function handleResetQuery() {
  queryFormRef.value.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

/** 打开弹窗 */
function handleOpenDialog(id?: number) {
  dialog.visible = true;
  if (id) {
    dialog.title = "编辑";
    ConfigAPI.getFormData(id).then((data) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增";
    formData.id = undefined;
  }
}

/** 刷新缓存 **/
function handleRefreshCache() {
  ConfigAPI.refreshCache().then(() => {
    ElMessage.success("刷新成功");
  });
}

/** 提交表单 */
function handleSubmit() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const id = formData.id;
      if (id) {
        ConfigAPI.update(id, formData)
          .then(() => {
            ElMessage.success("修改成功");
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        ConfigAPI.add(formData)
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

/** 删除 */
function handleDelete(id: number) {
  ElMessageBox.confirm("确认删除该项配置?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    () => {
      loading.value = true;
      ConfigAPI.deleteById(id)
        .then(() => {
          ElMessage.success("删除成功");
          handleResetQuery();
        })
        .finally(() => (loading.value = false));
    },
    () => {}
  );
}

onMounted(() => {
  handleQuery();
});
</script>
