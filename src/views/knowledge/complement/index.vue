<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="关键字" prop="keywords">
          <el-input
            v-model="queryParams.keywords"
            placeholder="用户名/昵称/手机号"
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
            <el-option label="正常" :value="1" />
            <el-option label="禁用" :value="0" />
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
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column
          key="id"
          label="编号"
          align="center"
          prop="id"
          width="80"
        />
        <el-table-column
          key="username"
          label="用户名"
          align="center"
          prop="username"
        />
        <el-table-column label="用户昵称" align="center" prop="nickname" />

        <el-table-column
          label="性别"
          width="100"
          align="center"
          prop="genderLabel"
        />

        <el-table-column
          label="手机号码"
          align="center"
          prop="mobile"
          width="120"
        />

        <el-table-column label="状态" align="center" prop="status" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status == 1 ? 'success' : 'info'">
              {{ scope.row.status == 1 ? "正常" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="180"
        />
        <el-table-column label="操作" fixed="right" width="220">
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
  </div>
</template>

<script setup lang="ts">
// 自动补充
defineOptions({
  name: "Complement",
  inheritAttrs: false,
});

import UserAPI, { UserForm, UserPageQuery, UserPageVO } from "@/api/user";

// 搜索表单
const queryFormRef = ref(ElForm);

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

// 编辑
async function handleOpenDialog(id?: number) {}

// 删除
async function handleDelete(id?: number) {}

onMounted(() => {
  handleQuery();
});
</script>
