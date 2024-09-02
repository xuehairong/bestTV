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
            <el-option label="正常" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item label="时间">
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
              @click="handleOpenDialog(0, 1)"
            >
              <i-ep-plus />
              批量审核
            </el-button>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" :data="pageData">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column key="id" label="名称" prop="id" min-width="100" />
        <el-table-column
          key="username"
          label="三元组数量"
          prop="username"
          min-width="100"
        />
        <el-table-column label="状态" prop="status" min-width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status == 1 ? 'success' : 'info'">
              {{ scope.row.status == 1 ? "正常" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="审核进度" prop="nickname" min-width="100" />
        <el-table-column label="时间" prop="createTime" min-width="180" />
        <el-table-column label="备注" prop="nickname" min-width="180" />
        <el-table-column label="操作" fixed="right" align="center" width="220">
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
              审核
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

    <!-- 审核弹窗 -->
    <el-dialog
      v-model="editdialog.visible"
      :title="editdialog.title"
      width="750px"
      @close="handleCloseDialog"
      style="background-color: antiquewhite"
    >
      <p class="text-center demonstration">card vertical layout</p>
      <div style="height: 100%" @mousewheel="rollScroll($event)">
        <el-carousel
          height="400px"
          direction="vertical"
          type="card"
          :autoplay="false"
          @mousewheel="rollScroll($event)"
        >
          <el-carousel-item
            v-for="item in 20"
            :key="item"
            style="padding: 10px"
          >
            <el-card style="height: 180px" shadow="hover">
              <el-button type="primary" @click="">确定</el-button>
              <el-button @click="">取消</el-button>
              {{ item }}
            </el-card>
          </el-carousel-item>
        </el-carousel>
      </div>
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
// 知识审核
defineOptions({
  name: "Audit",
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

// 详情弹窗
const detaildialog = reactive({
  title: "详情",
  visible: false,
});
// 审核弹窗
const editdialog = reactive({
  title: "审核",
  visible: false,
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
async function handleOpenDialog(id?: number, index?: number) {
  if (index == 0) {
    detaildialog.visible = true;
  } else if (index == 1) {
    editdialog.visible = true;
  }
}

function rollScroll(this: any, event: { wheelDelta: any; detail: any }) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  let _that = this;
  // chrome、ie使用的wheelDelta，火狐使用detail
  let scrollVal = event.wheelDelta || event.detail;
  // 节流
  if (!_that.timeOut) {
    _that.timeOut = setTimeout(() => {
      _that.timeOut = null;
      scrollVal > 0 ? _that.$refs.carousel.prev() : _that.$refs.carousel.next();
    }, 300);
  } else {
  }
}

/** 提交表单 */
function handleSubmit() {}

/** 关闭弹窗 */
function handleCloseDialog() {
  detaildialog.visible = false;
  editdialog.visible = false;
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
