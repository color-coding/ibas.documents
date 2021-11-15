/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace documents {
    export namespace app {

        /** 应用-文档 */
        export class DocumentEditApp extends ibas.BOEditApplication<IDocumentEditView, bo.Document> {

            /** 应用标识 */
            static APPLICATION_ID: string = "dbaf1533-d9fc-4246-8fbd-a113b948c4a1";
            /** 应用名称 */
            static APPLICATION_NAME: string = "documents_app_document_edit";
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string = bo.Document.BUSINESS_OBJECT_CODE;
            /** 构造函数 */
            constructor() {
                super();
                this.id = DocumentEditApp.APPLICATION_ID;
                this.name = DocumentEditApp.APPLICATION_NAME;
                this.boCode = DocumentEditApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
                this.view.deleteDataEvent = this.deleteData;
                this.view.uploadFileEvent = this.uploadFile;
                this.view.viewDataEvent = this.viewData;
            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
                super.viewShowed();
                if (ibas.objects.isNull(this.editData)) {
                    // 创建编辑对象实例
                    this.editData = new bo.Document();
                    this.proceeding(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_data_created_new"));
                }
                this.view.showDocument(this.editData);
            }
            /** 运行,覆盖原方法 */
            run(): void;
            run(data: bo.Document): void;
            run(): void {
                let that: this = this;
                if (ibas.objects.instanceOf(arguments[0], bo.Document)) {
                    let data: bo.Document = arguments[0];
                    // 新对象直接编辑
                    if (data.isNew) {
                        that.editData = data;
                        that.show();
                        return;
                    }
                    // 尝试重新查询编辑对象
                    let criteria: ibas.ICriteria = data.criteria();
                    if (!ibas.objects.isNull(criteria) && criteria.conditions.length > 0) {
                        // 有效的查询对象查询
                        let boRepository: bo.BORepositoryDocuments = new bo.BORepositoryDocuments();
                        boRepository.fetchDocument({
                            criteria: criteria,
                            onCompleted(opRslt: ibas.IOperationResult<bo.Document>): void {
                                let data: bo.Document;
                                if (opRslt.resultCode === 0) {
                                    data = opRslt.resultObjects.firstOrDefault();
                                }
                                if (ibas.objects.instanceOf(data, bo.Document)) {
                                    // 查询到了有效数据
                                    that.editData = data;
                                    that.show();
                                } else {
                                    // 数据重新检索无效
                                    that.messages({
                                        type: ibas.emMessageType.WARNING,
                                        message: ibas.i18n.prop("shell_data_deleted_and_created"),
                                        onCompleted(): void {
                                            that.show();
                                        }
                                    });
                                }
                            }
                        });
                        // 开始查询数据
                        return;
                    }
                }
                super.run.apply(this, arguments);
            }
            /** 保存数据 */
            protected saveData(): void {
                if (ibas.objects.isNull(this.editData) || ibas.strings.isEmpty(this.editData.sign)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("documents_please_upload_file"));
                    return;
                }
                this.busy(true);
                let that: this = this;
                let boRepository: bo.BORepositoryDocuments = new bo.BORepositoryDocuments();
                boRepository.saveDocument({
                    beSaved: this.editData,
                    onCompleted(opRslt: ibas.IOperationResult<bo.Document>): void {
                        try {
                            that.busy(false);
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            if (opRslt.resultObjects.length === 0) {
                                // 删除成功，释放当前对象
                                that.messages(ibas.emMessageType.SUCCESS,
                                    ibas.i18n.prop("shell_data_delete") + ibas.i18n.prop("shell_sucessful"));
                                that.editData = undefined;
                            } else {
                                // 替换编辑对象
                                that.editData = opRslt.resultObjects.firstOrDefault();
                                that.messages(ibas.emMessageType.SUCCESS,
                                    ibas.i18n.prop("shell_data_save") + ibas.i18n.prop("shell_sucessful"));
                            }
                            // 刷新当前视图
                            that.viewShowed();
                        } catch (error) {
                            that.messages(error);
                        }
                    }
                });
                this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_saving_data"));
            }
            /** 删除数据 */
            protected deleteData(): void {
                let that: this = this;
                this.messages({
                    type: ibas.emMessageType.QUESTION,
                    title: ibas.i18n.prop(this.name),
                    message: ibas.i18n.prop("shell_delete_continue"),
                    actions: [ibas.emMessageAction.YES, ibas.emMessageAction.NO],
                    onCompleted(action: ibas.emMessageAction): void {
                        if (action === ibas.emMessageAction.YES) {
                            that.editData.delete();
                            that.saveData();
                        }
                    }
                });
            }
            /** 上传文件 */
            uploadFile(data: File): void {
                this.busy(true);
                let that: this = this;
                let boRepository: bo.BORepositoryDocuments = new bo.BORepositoryDocuments();
                boRepository.upload({
                    file: data,
                    onCompleted(opRslt: ibas.IOperationResult<bo.Document>): void {
                        try {
                            that.busy(false);
                            if (opRslt.resultCode !== 0) {
                                throw new Error(opRslt.message);
                            }
                            that.messages(ibas.emMessageType.SUCCESS,
                                ibas.i18n.prop("shell_upload") + ibas.i18n.prop("shell_sucessful"));
                            that.editData = opRslt.resultObjects.firstOrDefault();
                            that.viewShowed();
                        } catch (error) {
                            that.messages(error);
                        }
                    }
                });
                this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_uploading_file"));
            }
            private viewData(): void {
                app.views(this.editData);
            }
        }
        /** 视图-文档 */
        export interface IDocumentEditView extends ibas.IBOEditView {
            /** 显示数据 */
            showDocument(data: bo.Document): void;
            /** 删除数据事件 */
            deleteDataEvent: Function;
            /** 上传文件 */
            uploadFileEvent: Function;
            /** 查看数据 */
            viewDataEvent: Function;
        }
    }
}