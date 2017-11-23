/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import * as bo from "./bo/index";
import { IBORepositoryDocuments, BO_REPOSITORY_DOCUMENTS } from "../api/index";
import { DataConverter4dc } from "./DataConverters";

/** Documents 业务仓库 */
export class BORepositoryDocuments extends ibas.BORepositoryApplication implements IBORepositoryDocuments {

    /** 创建此模块的后端与前端数据的转换者 */
    protected createConverter(): ibas.IDataConverter {
        return new DataConverter4dc;
    }
    /**
     * 获取地址
     */
    toUrl(document: bo.Document): string {
        if (!this.address.endsWith("/")) { this.address += "/"; }
        let url: string = this.address.replace("/services/rest/data/", "/services/rest/file/");
        url += ibas.strings.format("{0}?token={1}", document.fileSign, this.token);
        return encodeURI(url);
    }
    /**
     * 上传文档
     * @param caller 调用者
     */
    upload(caller: ibas.UploadFileCaller<ibas.FileData>): void {
        if (!this.address.endsWith("/")) { this.address += "/"; }
        let fileRepository: ibas.FileRepositoryUploadAjax = new ibas.FileRepositoryUploadAjax();
        fileRepository.address = this.address.replace("/services/rest/data/", "/services/rest/file/");
        fileRepository.token = this.token;
        fileRepository.converter = this.createConverter();
        fileRepository.upload("upload", caller);
    }
    /**
     * 下载文档
     * @param caller 调用者
     */
    download(caller: ibas.DownloadFileCaller<Blob>): void {
        if (!this.address.endsWith("/")) { this.address += "/"; }
        let fileRepository: ibas.FileRepositoryDownloadAjax = new ibas.FileRepositoryDownloadAjax();
        fileRepository.address = this.address.replace("/services/rest/data/", "/services/rest/file/");
        fileRepository.token = this.token;
        fileRepository.converter = this.createConverter();
        fileRepository.download("download", caller);
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
// 注册业务对象仓库到工厂
ibas.boFactory.register(BO_REPOSITORY_DOCUMENTS, BORepositoryDocuments);
