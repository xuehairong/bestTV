import request from "@/utils/request";

const DATASOURCES_BASE_URL = "/api/v1/datasources";

class DatasourcesAPI {
  /** 获取系统配置分页数据 */
  static getPage(queryParams?: DatasourcesPageQuery) {
    return request<any, PageResult<DatasourcesPageVO[]>>({
      url: `${DATASOURCES_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  }
  /**
   * 获取系统配置表单数据
   *
   * @param id ConfigID
   * @returns Config表单数据
   */
  static getFormData(id: number) {
    return request<any, DatasourcesForm>({
      url: `${DATASOURCES_BASE_URL}/${id}/form`,
      method: "get",
    });
  }

  /** 添加系统配置*/
  static add(data: DatasourcesForm) {
    return request({
      url: `${DATASOURCES_BASE_URL}`,
      method: "post",
      data: data,
    });
  }

  /**
   * 更新系统配置
   *
   * @param id ConfigID
   * @param data Config表单数据
   */
  static update(id: number, data: DatasourcesForm) {
    return request({
      url: `${DATASOURCES_BASE_URL}/${id}`,
      method: "put",
      data: data,
    });
  }

  /**
   * 删除系统配置
   *
   * @param ids 系统配置ID
   */
  static deleteById(id: number) {
    return request({
      url: `${DATASOURCES_BASE_URL}/${id}`,
      method: "delete",
    });
  }

  static refreshCache() {
    return request({
      url: `${DATASOURCES_BASE_URL}`,
      method: "patch",
    });
  }
}

export default DatasourcesAPI;

/** 分页查询 */
export interface DatasourcesPageQuery extends PageQuery {
  /** 名称 */
  name?: string;
  /** 状态 */
  status?: number;
  /* 时间 */
  time?: [string, string];
}

/** 数据源列表 */
export interface DatasourcesPageVO {
  /** 主键 */
  id?: number;
  /** 名称 */
  a?: string;
  /** 别名 */
  b?: string;
  /** 类别 */
  c?: number;
  /** 储存 */
  d?: number;
  /** 是否为空 */
  e?: number;
  /** 状态 */
  f?: number;
  /** 在线 */
  g?: number;
  /** 最后更新时间 */
  h?: string;
  /** 备注 */
  i?: string;
}

/** 系统配置表单对象 */
export interface DatasourcesForm {
  /** id */
  id?: number;
  /** 名称 */
  a?: string;
  /** 别名 */
  b?: string;
  /** 状态 */
  c?: number;
  /** 描述、备注 */
  d?: string;
  /** 文件 */
  e?: string;
}
