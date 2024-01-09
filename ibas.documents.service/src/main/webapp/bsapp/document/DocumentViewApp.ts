/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace documents {
    export namespace app {
        export function views(document: bo.IDocument): void {
            if (ibas.objects.isNull(document)) {
                throw new Error(ibas.i18n.prop("sys_invalid_parameter", "document"));
            }
            if (ibas.objects.isNull(document.name)) {
                throw new Error(ibas.i18n.prop("sys_invalid_parameter", "document.name"));
            }
            let index: number = document.name.lastIndexOf(".");
            if (!(index > 0)) {
                throw new Error(ibas.i18n.prop("sys_invalid_parameter", "document.name"));
            }
            let extName: string = document.name.substring(index + 1);
            if (!ibas.strings.isEmpty(extName)) {
                for (let service of ibas.servicesManager.getServices({
                    /** 服务契约代理 */
                    proxy: new DocumentViewServiceProxy({
                        document: document
                    }),
                }).sort((a, b) => {
                    if (ibas.strings.isEmpty(a.category)) {
                        return 1;
                    }
                    if (ibas.strings.isEmpty(b.category)) {
                        return -1;
                    }
                    return 0;
                })) {
                    if (ibas.strings.isEmpty(service.category) || service.category.indexOf(extName) >= 0) {
                        service.run(); break;
                    }
                }
            }
        }
        /** 查看应用-文档 */
        export class DocumentViewApp extends ibas.ServiceApplication<IDocumentViewView, IDocumentViewServiceContract> {
            /** 应用标识 */
            static APPLICATION_ID: string = "cc996b82-4897-42fb-938f-33b147d00e6a";
            /** 应用名称 */
            static APPLICATION_NAME: string = "documents_app_document_view";
            /** 构造函数 */
            constructor() {
                super();
                this.id = DocumentViewApp.APPLICATION_ID;
                this.name = DocumentViewApp.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
                this.view.downloadFileEvent = this.downloadFile;
            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
                this.view.showDocument(this.document);
            }
            private document: bo.IDocument;
            protected runService(contract: IDocumentViewServiceContract): void {
                if (contract && contract.document) {
                    this.document = contract.document;
                    this.show();
                } else {
                    throw new Error(ibas.i18n.prop(["shell_please_chooose_data", "shell_data_view"]));
                }
            }
            /** 下载文件 */
            downloadFile(): void {
                this.busy(true);
                let criteria: ibas.ICriteria = new ibas.Criteria();
                let condition: ibas.ICondition = criteria.conditions.create();
                condition.alias = ibas.CRITERIA_CONDITION_ALIAS_FILE_NAME;
                condition.value = this.document.sign;
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
                                ibas.files.save(data, that.document.name);
                            }
                        } catch (error) {
                            that.messages(error);
                        }
                    }
                });
                this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_downloading_file"));
            }
        }
        /** 视图-文档 */
        export interface IDocumentViewView extends ibas.IBOViewView {
            /** 显示数据 */
            showDocument(data: bo.IDocument): void;
            /** 下载文件 */
            downloadFileEvent: Function;
        }
        /** 文档连接服务映射 */
        export class DocumentViewServiceMapping extends ibas.ServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = DocumentViewApp.APPLICATION_ID;
                this.name = DocumentViewApp.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
                this.proxy = DocumentViewServiceProxy;
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IBOLinkServiceCaller> {
                return new DocumentViewApp();
            }
        }

        /** 文档查看链接者 */
        export class DocumentViewLinker extends ibas.ServiceApplication<ibas.IBOViewView, ibas.IBOLinkServiceContract>  {
            /** 应用标识 */
            static APPLICATION_ID: string = "ab9ed70c-b440-4b6c-8099-1436b42e40fa";
            /** 应用名称 */
            static APPLICATION_NAME: string = "documents_app_document_view";
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string = bo.Document.BUSINESS_OBJECT_CODE;
            /** 构造函数 */
            constructor() {
                super();
                this.id = DocumentViewLinker.APPLICATION_ID;
                this.name = DocumentViewLinker.APPLICATION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 视图显示后 */
            protected viewShowed(): void {
            }
            protected runService(contract: ibas.IBOLinkServiceContract): void {
                if (contract && !ibas.strings.isEmpty(contract.linkValue)) {
                    let criteria: ibas.Criteria = new ibas.Criteria();
                    criteria.result = 1;
                    let condition: ibas.ICondition = criteria.conditions.create();
                    condition.alias = documents.bo.Document.PROPERTY_OBJECTKEY_NAME;
                    condition.value = contract.linkValue.toString();
                    let that: this = this;
                    let boRepository: bo.BORepositoryDocuments = new bo.BORepositoryDocuments();
                    boRepository.fetchDocument({
                        criteria: criteria,
                        onCompleted(opRslt: ibas.IOperationResult<bo.Document>): void {
                            try {
                                that.busy(false);
                                if (opRslt.resultCode !== 0) {
                                    throw new Error(opRslt.message);
                                }
                                if (opRslt.resultObjects.length === 0) {
                                    that.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_data_fetched_none"));
                                }
                                views(opRslt.resultObjects.firstOrDefault());
                            } catch (error) {
                                that.messages(error);
                            }
                        }
                    });
                } else {
                    throw new Error(ibas.i18n.prop("shell_please_chooose_data", ibas.i18n.prop("shell_data_view")));
                }
            }
        }
        /** 文档查看链接者映射 */
        export class DocumentViewLinkerMapping extends ibas.BOLinkServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = DocumentViewLinker.APPLICATION_ID;
                this.name = DocumentViewLinker.APPLICATION_NAME;
                this.boCode = bo.Document.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IBOLinkServiceCaller> {
                return new DocumentViewLinker();
            }
        }
    }
}