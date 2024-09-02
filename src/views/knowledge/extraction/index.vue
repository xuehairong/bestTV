<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="名称" prop="keywords">
          <el-input
            v-model="queryParams.keywords"
            placeholder="名称"
            clearable
            style="width: 200px"
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
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="未抽取" name="未抽取">
          <el-table v-loading="loading" :data="pageData">
            <el-table-column key="id" label="名称" prop="id" min-width="100" />
            <el-table-column
              key="username"
              label="数据源"
              prop="username"
              min-width="100"
            />
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
                  @click="handleOpenDialog(scope.row.id, 0)"
                >
                  <i-ep-Document />
                  详情
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
        </el-tab-pane>
        <el-tab-pane label="已抽取" name="已抽取">
          <el-table v-loading="loading" :data="pageData">
            <el-table-column key="id" label="名称" prop="id" min-width="100" />
            <el-table-column
              key="username"
              label="数据源"
              prop="username"
              min-width="100"
            />
            <el-table-column
              key="username"
              label="三元组数量"
              prop="username"
              min-width="100"
            />
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
            <el-table-column
              label="复审截止日期"
              prop="createTime"
              width="180"
            />
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
                  @click="handleOpenDialog(scope.row.id, 0)"
                >
                  <i-ep-Document />
                  详情
                </el-button>
                <el-button
                  v-hasPerm="['sys:user:edit']"
                  type="primary"
                  link
                  size="small"
                  @click="handleOpenDialog(scope.row.id, 1)"
                >
                  <i-ep-edit />
                  编辑
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="handleQuery"
      />
    </el-card>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="detaildialog.visible"
      :title="detaildialog.title"
      width="700px"
      @close="handleCloseDialog"
    >
      <el-row>
        <el-col :span="12">
          <el-row class="py-5px">
            <el-col :span="6">标题：</el-col>
            <el-col :span="18">1</el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row class="py-5px">
            <el-col :span="6">导入人：</el-col>
            <el-col :span="18">1</el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row class="py-5px">
            <el-col :span="6">时间：</el-col>
            <el-col :span="18">1</el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row class="py-5px">
            <el-col :span="6">状态：</el-col>
            <el-col :span="18">1</el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row class="py-5px">
            <el-col :span="6">数据源：</el-col>
            <el-col :span="18">1</el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row class="py-5px">
            <el-col :span="6">备注：</el-col>
            <el-col :span="18">1</el-col>
          </el-row>
        </el-col>
        <el-col :span="24">
          <el-row>
            <el-col :span="24" class="py-5px">详情：</el-col>
            <el-col :span="24" class="py-5px">
              <div class="dashed">
                <el-scrollbar always="true" max-height="300px">
                  <p v-for="item in 20" :key="item" class="scrollbar-demo-item">
                    {{ item }}
                  </p>
                </el-scrollbar>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确定</el-button>
          <el-button @click="handleCloseDialog">取消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 编辑弹窗 -->
    <el-dialog
      v-model="editdialog.visible"
      :title="editdialog.title"
      width="800px"
      @close="handleCloseDialog"
    >
      <el-form
        ref="dataFormRef"
        :model="formData"
        label-suffix=":"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="内容" prop="b">
          <el-select v-model="formData.b" placeholder="全部" clearable>
            <el-option label="战狼是战争片" :value="0" />
            <el-option label="战狼是战争片" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="自定义" prop="c">
          <el-input
            v-model="formData.a"
            placeholder="Please input"
            class="input-with-select"
          >
            <template #prepend>
              <el-select
                v-model="formData.a"
                placeholder="Select"
                style="width: 180px"
              >
                <el-option label="命名实体识别NER" value="1" />
                <el-option label="关系抽取RE" value="2" />
                <el-option label="属性抽取AE" value="3" />
                <el-option label="事件抽取" value="4" />
              </el-select>
            </template>
            <template #append>
              <el-button>添加</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="选择" prop="d">
          <el-row class="w-full">
            <el-col :span="11">
              <el-card shadow="never">
                <template #header>
                  <div class="card-header">
                    <span>备选（自动提取）</span>
                  </div>
                </template>
                <div>
                  1-NER
                  <br />
                  <el-checkbox-group v-model="formData.b">
                    <el-checkbox label="Option A" value="Value A" />
                    <el-checkbox label="Option B" value="Value B" />
                  </el-checkbox-group>
                </div>
                <div>
                  2-RE
                  <br />
                  <el-checkbox-group v-model="formData.b">
                    <el-checkbox label="Option A" value="Value A" />
                    <el-checkbox label="Option B" value="Value B" />
                  </el-checkbox-group>
                </div>
                <div>
                  3-AE
                  <br />
                  <el-checkbox-group v-model="formData.b">
                    <el-checkbox label="Option A" value="Value A" />
                    <el-checkbox label="Option B" value="Value B" />
                  </el-checkbox-group>
                </div>
                <div>
                  4-事件抽取
                  <br />
                  <el-checkbox-group v-model="formData.b">
                    <el-checkbox label="Option A" value="Value A" />
                    <el-checkbox label="Option B" value="Value B" />
                  </el-checkbox-group>
                </div>
              </el-card>
            </el-col>
            <el-col :span="11" :offset="2">
              <el-card shadow="never">
                <template #header>
                  <div class="card-header">
                    <span>最终选定</span>
                  </div>
                </template>
                <div>
                  1-NER
                  <br />
                  <el-checkbox-group v-model="formData.b">
                    <el-checkbox label="Option A" value="Value A" />
                    <el-checkbox label="Option B" value="Value B" />
                  </el-checkbox-group>
                </div>
                <div>
                  2-RE
                  <br />
                  <el-checkbox-group v-model="formData.b">
                    <el-checkbox label="Option A" value="Value A" />
                    <el-checkbox label="Option B" value="Value B" />
                  </el-checkbox-group>
                </div>
                <div>
                  3-AE
                  <br />
                  <el-checkbox-group v-model="formData.b">
                    <el-checkbox label="Option A" value="Value A" />
                    <el-checkbox label="Option B" value="Value B" />
                  </el-checkbox-group>
                </div>
                <div>
                  4-事件抽取
                  <br />
                  <el-checkbox-group v-model="formData.b">
                    <el-checkbox label="Option A" value="Value A" />
                    <el-checkbox label="Option B" value="Value B" />
                  </el-checkbox-group>
                </div>
              </el-card>
            </el-col>
          </el-row>
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
// 知识抽取
defineOptions({
  name: "Extraction",
  inheritAttrs: false,
});

import type { TabsPaneContext } from "element-plus";
import UserAPI, { UserForm, UserPageQuery, UserPageVO } from "@/api/user";

// 搜索表单
const queryFormRef = ref(ElForm);
// 弹窗表单
const dataFormRef = ref(ElForm);

// Tabs 标签页
const activeName = ref("未抽取");

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
// 详情弹窗
const detaildialog = reactive({
  title: "详情",
  visible: false,
});
// 编辑弹窗
const editdialog = reactive({
  title: "编辑",
  visible: false,
});
// 弹窗表单
const formData = reactive<DatasourcesForm>({
  id: undefined,
  a: "",
  b: 0,
  c: "",
  d: "0",
  e: "",
  f: "",
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

// Tabs 标签页切换
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, tab.paneName, event, activeName.value);
};

// 打开弹窗
async function handleOpenDialog(id?: number, index?: number) {
  if (index == 0) {
    detaildialog.visible = true;
  } else if (index == 1) {
    editdialog.visible = true;
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
  detaildialog.visible = false;
  editdialog.visible = false;
  formData.id != undefined;
}

// 删除
async function handleDelete(id?: number) {}

onMounted(() => {
  handleQuery();
});
</script>

<style>
.dashed {
  border-radius: 7px;
  border: 2px dashed var(--el-border-color);
}
</style>
