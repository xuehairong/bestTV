import { defineMock } from "./base";

export default defineMock([
  {
    url: "config/page",
    method: ["GET"],
    body: {
      code: "00000",
      data: {
        list: [
          {
            id: 2,
            username: "admin",
            nickname: "系统管理员",
            mobile: "17621210366",
            gender: 1,
            avatar:
              "https://oss.youlai.tech/youlai-boot/2023/05/16/811270ef31f548af9cffc026dfc3777b.gif",
            email: "",
            status: 1,
            deptId: 1,
            roleIds: [2],
          },
          {
            id: 3,
            username: "test",
            nickname: "测试小用户",
            mobile: "17621210366",
            gender: 1,
            avatar:
              "https://oss.youlai.tech/youlai-boot/2023/05/16/811270ef31f548af9cffc026dfc3777b.gif",
            email: "youlaitech@163.com",
            status: 1,
            deptId: 3,
            roleIds: [3],
          },
        ],
        total: 2,
      },
      msg: "一切ok",
    },
  },

  /**
   * 获取系统配置表单数据
   */
  {
    url: "config/:id/form",
    method: ["GET"],
    body: ({}) => {
      return {
        code: "00000",
        data: null,
        msg: "一切ok",
      };
    },
  },

  /** 添加系统配置*/
  {
    url: "config",
    method: ["POST"],
    body({}) {
      return {
        code: "00000",
        data: null,
        msg: "成功",
      };
    },
  },

  // 更新系统配置
  {
    url: "config/:id",
    method: ["PUT"],
    body({}) {
      return {
        code: "00000",
        data: null,
        msg: "成功",
      };
    },
  },

  // 删除系统配置
  {
    url: "config/:id",
    method: ["DELETE"],
    body({}) {
      return {
        code: "00000",
        data: null,
        msg: "成功",
      };
    },
  },

  {
    url: "config",
    method: ["PATCH"],
    body() {
      return {
        code: "00000",
        data: null,
        msg: "成功",
      };
    },
  },
]);
