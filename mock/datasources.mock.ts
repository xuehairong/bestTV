import { i } from "vite/dist/node/types.d-aGj9QkWt";
import { defineMock } from "./base";

export default defineMock([
  {
    url: "datasources/page",
    method: ["GET"],
    body: {
      code: "00000",
      data: {
        list: [
          {
            id: 2,
            a: "通用",
            b: "通用ABC",
            c: 0,
            d: 0,
            e: 1,
            f: 1,
            g: 1,
            h: "2024-07-07 20:38:47",
            i: "fwsegrwesgrwegrfwsg",
          },
          {
            id: 2,
            a: "企业",
            b: "企业ABC",
            c: 2,
            d: 1,
            e: 1,
            f: 0,
            g: 0,
            h: "2024-07-07 20:38:47",
            i: "fwsegrwesgrwegrfwsg",
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
    url: "datasources/:id/form",
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
    url: "datasources",
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
    url: "datasources/:id",
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
    url: "datasources/:id",
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
    url: "datasources",
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
