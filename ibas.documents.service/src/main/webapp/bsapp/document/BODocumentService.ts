/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import { Document } from "../../borep/bo/index";
import { BORepositoryDocuments } from "../../borep/BORepositories";

/** 业务对象文档服务 */
export class BODocumentService extends ibas.Application<IBODocumentServiceView> implements ibas.IService<ibas.IBOServiceContract> {

    /** 应用标识 */
    static APPLICATION_ID: string = "bda600a8-7d36-4e7e-97cd-364fb032b752";
    /** 应用名称 */
    static APPLICATION_NAME: string = "documents_bo_document_service";

    constructor() {
        super();
        this.id = BODocumentService.APPLICATION_ID;
        this.name = BODocumentService.APPLICATION_NAME;
        this.description = ibas.i18n.prop(this.name);
    }
    /** 注册视图 */
    protected registerView(): void {
        super.registerView();
        this.view.uploadFileEvent = this.uploadFile;
        this.view.downloadFileEvent = this.downloadFile;
    }
    /** 视图显示后 */
    protected viewShowed(): void {
        // 视图加载完成
        this.view.showBOKeys(this.bo.toString());
        let criteria: ibas.ICriteria = new ibas.Criteria();
        let condition: ibas.ICondition = criteria.conditions.create();
        condition.alias = Document.PROPERTY_ACTIVATED_NAME;
        condition.value = "Y";
        condition = criteria.conditions.create();
        condition.alias = Document.PROPERTY_BOKEYS_NAME;
        condition.value = this.bo.toString();
        let that: this = this;
        let boRepository: BORepositoryDocuments = new BORepositoryDocuments();
        boRepository.fetchDocument({
            criteria: criteria,
            onCompleted(opRslt: ibas.IOperationResult<Document>): void {
                try {
                    if (opRslt.resultCode !== 0) {
                        throw new Error(opRslt.message);
                    }
                    that.view.showDocuments(opRslt.resultObjects);
                } catch (error) {
                    that.messages(error);
                }
            }
        });
    }
    /** 运行,覆盖原方法 */
    run(): void {
        if (!ibas.objects.isNull(arguments) && arguments.length === 1) {
            let contract: ibas.IBOServiceContract = <ibas.IBOServiceContract>arguments[0];
            if (!ibas.objects.isNull(contract.data)) {
                // 传入的数据可能是数组
                if (contract.data instanceof Array) {
                    // 数组只处理第一个
                    this.bo = contract.data[0];
                } else {
                    this.bo = contract.data;
                }
                super.run();
                return;
            }
        }
        // 输入数据无效，服务不运行
        this.proceeding(ibas.emMessageType.WARNING,
            ibas.i18n.prop("documents_bo_document_service") + ibas.i18n.prop("sys_invalid_parameter", "data"));
    }
    /** 关联的数据 */
    private bo: ibas.IBusinessObject;
    /** 上传文件 */
    uploadFile(data: FormData): void {
        if (ibas.objects.isNull(data)) {
            return;
        }
        this.busy(true);
        let that: this = this;
        let boRepository: BORepositoryDocuments = new BORepositoryDocuments();
        boRepository.upload({
            fileData: data,
            onCompleted(opRslt: ibas.IOperationResult<ibas.FileData>): void {
                try {
                    if (opRslt.resultCode !== 0) {
                        throw new Error(opRslt.message);
                    }
                    let fileData: ibas.FileData = opRslt.resultObjects.firstOrDefault();
                    if (!ibas.objects.isNull(fileData)) {
                        let document: Document = new Document();
                        document.fileName = fileData.originalName;
                        document.fileSign = fileData.fileName;
                        document.boKeys = that.bo.toString();
                        boRepository.saveDocument({
                            beSaved: document,
                            onCompleted(opRslt: ibas.IOperationResult<Document>): void {
                                try {
                                    that.busy(false);
                                    if (opRslt.resultCode !== 0) {
                                        throw new Error(opRslt.message);
                                    }
                                    that.viewShowed();
                                    that.messages(ibas.emMessageType.SUCCESS,
                                        ibas.i18n.prop("sys_shell_upload") + ibas.i18n.prop("sys_shell_sucessful"));
                                } catch (error) {
                                    that.messages(error);
                                }
                            }
                        });
                    }
                } catch (error) {
                    that.messages(error);
                }
            }
        });
        this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("sys_shell_uploading_file"));
    }
    /** 下载文件 */
    downloadFile(document: Document): void {
        if (ibas.objects.isNull(document)) {
            return;
        }
        this.busy(true);
        let criteria: ibas.ICriteria = new ibas.Criteria();
        let condition: ibas.ICondition = criteria.conditions.create();
        condition.alias = ibas.CRITERIA_CONDITION_ALIAS_FILE_NAME;
        condition.value = document.fileSign;
        let that: this = this;
        let boRepository: BORepositoryDocuments = new BORepositoryDocuments();
        boRepository.download({
            criteria: criteria,
            onCompleted(opRslt: ibas.IOperationResult<Blob>): void {
                try {
                    that.busy(false);
                    if (opRslt.resultCode !== 0) {
                        throw new Error(opRslt.message);
                    }
                    let data: Blob = opRslt.resultObjects.firstOrDefault();
                    if (!ibas.objects.isNull(data)) {
                        ibas.files.save(data, document.fileName);
                    }
                } catch (error) {
                    that.messages(error);
                }
            }
        });
        this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("sys_shell_downloading_file"));
    }
}
/** 业务对象文档服务-视图 */
export interface IBODocumentServiceView extends ibas.IView {
    /** 显示关联对象 */
    showBOKeys(keys: string): void;
    /** 显示已存在文档 */
    showDocuments(documents: Document[]): void;
    /** 上传文件 */
    uploadFileEvent: Function;
    /** 下载文件 */
    downloadFileEvent: Function;
}
/** 业务对象文档服务映射 */
export class BODocumentServiceMapping extends ibas.ServiceMapping {

    constructor() {
        super();
        this.id = BODocumentService.APPLICATION_ID;
        this.name = BODocumentService.APPLICATION_NAME;
        this.description = ibas.i18n.prop(this.name);
        this.proxy = ibas.BOServiceProxy;
        this.icon = ibas.i18n.prop("documents_bo_document_icon");
    }
    /** 创建服务并运行 */
    create(): ibas.IService<ibas.IServiceContract> {
        return new BODocumentService();
    }
}
/** 业务对象文档服务映射 */
export class BOListDocumentServiceMapping extends ibas.ServiceMapping {

    constructor() {
        super();
        this.id = BODocumentService.APPLICATION_ID.substring(0, BODocumentService.APPLICATION_ID.length - 2) + "4";
        this.name = BODocumentService.APPLICATION_NAME;
        this.description = ibas.i18n.prop(this.name);
        this.proxy = ibas.BOListServiceProxy;
        this.icon = ibas.i18n.prop("documents_bo_document_icon");
    }
    /** 创建服务并运行 */
    create(): ibas.IService<ibas.IServiceContract> {
        return new BODocumentService();
    }
}