/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace documents {
    export namespace app {

        /** 查看应用-文档 */
        export class DocumentViewApp extends ibas.BOViewService<IDocumentViewView> {

            /** 应用标识 */
            static APPLICATION_ID: string = "cc996b82-4897-42fb-938f-33b147d00e6a";
            /** 应用名称 */
            static APPLICATION_NAME: string = "documents_app_document_view";
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string = bo.Document.BUSINESS_OBJECT_CODE;
            /** 构造函数 */
            constructor() {
                super();
                this.id = DocumentViewApp.APPLICATION_ID;
                this.name = DocumentViewApp.APPLICATION_NAME;
                this.boCode = DocumentViewApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
                this.view.editDataEvent = this.editData;
                this.view.downloadFileEvent = this.downloadFile;
            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
                this.view.showDocument(this.viewData);
            }
            /** 编辑数据，参数：目标数据 */
            protected editData(): void {
                let app: DocumentEditApp = new DocumentEditApp();
                app.navigation = this.navigation;
                app.viewShower = this.viewShower;
                app.run(this.viewData);
            }
            /** 运行,覆盖原方法 */
            run(): void;
            run(data: bo.Document): void;
            run(): void {
                if (ibas.objects.instanceOf(arguments[0], bo.Document)) {
                    this.viewData = arguments[0];
                    this.show();
                } else {
                    super.run.apply(this, arguments);
                }
            }
            private viewData: bo.Document;
            /** 查询数据 */
            protected fetchData(criteria: ibas.ICriteria | string): void {
                this.busy(true);
                let that: this = this;
                if (typeof criteria === "string") {
                    criteria = new ibas.Criteria();
                    // 添加查询条件

                }
                let boRepository: bo.BORepositoryDocuments = new bo.BORepositoryDocuments();
                boRepository.fetchDocument({
                    criteria: criteria,
                    onCompleted(opRslt: ibas.IOperationResult<bo.Document>): void {
                        try {
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            that.viewData = opRslt.resultObjects.firstOrDefault();
                            that.viewShowed();
                        } catch (error) {
                            that.messages(error);
                        }
                    }
                });
                this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_fetching_data"));
            }
            /** 下载文件 */
            downloadFile(): void {
                this.busy(true);
                let criteria: ibas.ICriteria = new ibas.Criteria();
                let condition: ibas.ICondition = criteria.conditions.create();
                condition.alias = ibas.CRITERIA_CONDITION_ALIAS_FILE_NAME;
                condition.value = this.viewData.fileSign;
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
                                ibas.files.save(data, that.viewData.fileName);
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
            showDocument(data: bo.Document): void;
            /** 下载文件 */
            downloadFileEvent: Function;
        }
        /** 文档连接服务映射 */
        export class DocumentLinkServiceMapping extends ibas.BOLinkServiceMapping {
            /** 构造函数 */
            constructor() {
                super();
                this.id = DocumentViewApp.APPLICATION_ID;
                this.name = DocumentViewApp.APPLICATION_NAME;
                this.boCode = DocumentViewApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 创建服务实例 */
            create(): ibas.IService<ibas.IBOLinkServiceCaller> {
                return new DocumentViewApp();
            }
        }
    }
}