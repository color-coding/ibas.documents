/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import * as bo from "./bo/index";
import { IBORepositoryDocuments } from "../api/index";
import { DataConverter4dc } from "./DataConverters";

/** Documents 业务仓库 */
export class BORepositoryDocuments extends ibas.BORepositoryApplication implements IBORepositoryDocuments {

    /** 创建此模块的后端与前端数据的转换者 */
    protected createConverter(): ibas.IDataConverter {
        return new DataConverter4dc;
    }

    /**
     * 查询 文档
     * @param fetcher 查询者
     */
    fetchDocument(fetcher: ibas.FetchCaller<bo.Document>): void {
        super.fetch(bo.Document.name, fetcher);
    }
    /**
     * 保存 文档
     * @param saver 保存者
     */
    saveDocument(saver: ibas.SaveCaller<bo.Document>): void {
        super.save(bo.Document.name, saver);
    }

}
