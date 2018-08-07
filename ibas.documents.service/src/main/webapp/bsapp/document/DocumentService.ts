/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace documents {
    export namespace app {
        /** 业务对象文档服务 */
        export class DocumentService extends ibas.ServiceApplication<IDocumentServiceView, ibas.IBOServiceContract> {
            /** 应用标识 */
            static APPLICATION_ID: string = "bda600a8-7d36-4e7e-97cd-364fb032b752";
            /** 应用名称 */
            static APPLICATION_NAME: string = "documents_bo_document_service";

            constructor() {
                super();
                this.id = DocumentService.APPLICATION_ID;
                this.name = DocumentService.APPLICATION_NAME;
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
                this.view.showBusinessObject(this.bo);
                let criteria: ibas.ICriteria = new ibas.Criteria();
                let condition: ibas.ICondition = criteria.conditions.create();
                condition.alias = bo.Document.PROPERTY_ACTIVATED_NAME;
                condition.value = ibas.emYesNo.YES.toString();
                condition = criteria.conditions.create();
                condition.alias = bo.Document.PROPERTY_BOKEYS_NAME;
                condition.value = this.bo.toString();
                let that: this = this;
                let boRepository: bo.BORepositoryDocuments = new bo.BORepositoryDocuments();
                boRepository.fetchDocument({
                    criteria: criteria,
                    onCompleted(opRslt: ibas.IOperationResult<bo.Document>): void {
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
            /** 运行服务 */
            runService(contract: ibas.IBOServiceContract): void {
                if (!ibas.objects.isNull(contract)) {
                    // 传入的数据可能是数组
                    if (contract.data instanceof Array) {
                        // 数组只处理第一个
                        this.bo = contract.data[0];
                    } else {
                        this.bo = contract.data;
                    }
                }
                if (ibas.objects.isNull(this.bo)) {
                    // 输入数据无效，服务不运行
                    this.proceeding(ibas.emMessageType.WARNING,
                        ibas.i18n.prop("documents_bo_document_service") + ibas.i18n.prop("sys_invalid_parameter", "data"));
                } else {
                    super.show();
                }
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
                let boRepository: bo.BORepositoryDocuments = new bo.BORepositoryDocuments();
                boRepository.upload({
                    fileData: data,
                    onCompleted(opRslt: ibas.IOperationResult<ibas.FileData>): void {
                        try {
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            let fileData: ibas.FileData = opRslt.resultObjects.firstOrDefault();
                            if (!ibas.objects.isNull(fileData)) {
                                let document: bo.Document = new bo.Document();
                                document.name = fileData.originalName;
                                document.sign = fileData.fileName;
                                document.boKeys = that.bo.toString();
                                boRepository.saveDocument({
                                    beSaved: document,
                                    onCompleted(opRslt: ibas.IOperationResult<bo.Document>): void {
                                        try {
                                            that.busy(false);
                                            if (opRslt.resultCode !== 0) {
                                                throw new Error(opRslt.message);
                                            }
                                            that.viewShowed();
                                            that.messages(ibas.emMessageType.SUCCESS,
                                                ibas.i18n.prop("shell_upload") + ibas.i18n.prop("shell_sucessful"));
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
                this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_uploading_file"));
            }
            /** 下载文件 */
            downloadFile(document: bo.Document): void {
                if (ibas.objects.isNull(document)) {
                    return;
                }
                this.busy(true);
                let criteria: ibas.ICriteria = new ibas.Criteria();
                let condition: ibas.ICondition = criteria.conditions.create();
                condition.alias = ibas.CRITERIA_CONDITION_ALIAS_FILE_NAME;
                condition.value = document.sign;
                let that: this = this;
                let boRepository: bo.BORepositoryDocuments = new bo.BORepositoryDocuments();
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
                                ibas.files.save(data, document.name);
                            }
                        } catch (error) {
                            that.messages(error);
                        }
                    }
                });
                this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_downloading_file"));
            }
        }
        /** 业务对象文档服务-视图 */
        export interface IDocumentServiceView extends ibas.IView {
            /** 显示关联对象 */
            showBusinessObject(bo: ibas.IBusinessObject): void;
            /** 显示已存在文档 */
            showDocuments(documents: bo.Document[]): void;
            /** 上传文件 */
            uploadFileEvent: Function;
            /** 下载文件 */
            downloadFileEvent: Function;
        }
        /** 业务对象文档服务映射 */
        export class DocumentServiceMapping extends ibas.ServiceMapping {

            constructor() {
                super();
                this.id = DocumentService.APPLICATION_ID;
                this.name = DocumentService.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
                this.proxy = ibas.BOServiceProxy;
                this.icon = ibas.i18n.prop("documents_bo_document_icon");
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IServiceContract> {
                return new DocumentService();
            }
        }
    }
}