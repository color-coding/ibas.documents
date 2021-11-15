/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace documents {
    /** 模块-标识 */
    export const CONSOLE_ID: string = "14f7a312-5d63-488e-bed4-ea093be6f183";
    /** 模块-名称 */
    export const CONSOLE_NAME: string = "Documents";
    /** 模块-版本 */
    export const CONSOLE_VERSION: string = "0.1.0";

    export namespace config {
        /**
         * 获取此模块配置
         * @param key 配置项
         * @param defalut 默认值
         */
        export function get<T>(key: string, defalut?: T): T {
            return ibas.config.get(ibas.strings.format("{0}|{1}", CONSOLE_ID, key), defalut);
        }
    }
    export namespace bo {
        /** 业务仓库名称 */
        export const BO_REPOSITORY_DOCUMENTS: string = ibas.strings.format(ibas.MODULE_REPOSITORY_NAME_TEMPLATE, CONSOLE_NAME);
        /** 业务对象编码-文档 */
        export const BO_CODE_DOCUMENT: string = "${Company}_DC_DOCUMENT";
    }
    export namespace app {
        /** 文档查看服务契约 */
        export interface IDocumentViewServiceContract extends ibas.IServiceContract {
            /** 文档 */
            document: bo.IDocument;
        }
        /**
         * 文档查看服务代理
         */
        export class DocumentViewServiceProxy extends ibas.ServiceProxy<IDocumentViewServiceContract> {
        }
    }
}