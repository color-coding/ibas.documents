/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace documents {
    export namespace app {

        /** 列表应用-文档 */
        export class DocumentListApp extends ibas.BOListApplication<IDocumentListView, bo.Document> {

            /** 应用标识 */
            static APPLICATION_ID: string = "45f83db5-d003-4008-a2c5-92eeedb5cde9";
            /** 应用名称 */
            static APPLICATION_NAME: string = "documents_app_document_list";
            /** 业务对象编码 */
            static BUSINESS_OBJECT_CODE: string = bo.Document.BUSINESS_OBJECT_CODE;
            /** 构造函数 */
            constructor() {
                super();
                this.id = DocumentListApp.APPLICATION_ID;
                this.name = DocumentListApp.APPLICATION_NAME;
                this.boCode = DocumentListApp.BUSINESS_OBJECT_CODE;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 注册视图 */
            protected registerView(): void {
                super.registerView();
                // 其他事件
                this.view.editDataEvent = this.editData;
                this.view.deleteDataEvent = this.deleteData;
                this.view.downloadFileEvent = this.dowloadFile;
                this.view.uploadFileEvent = this.uploadFile;
            }
            /** 视图显示后 */
            protected viewShowed(): void {
                // 视图加载完成
                super.viewShowed();
            }
            /** 查询数据 */
            protected fetchData(criteria: ibas.ICriteria): void {
                this.busy(true);
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
                            that.view.showData(opRslt.resultObjects);
                        } catch (error) {
                            that.messages(error);
                        }
                    }
                });
                this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_fetching_data"));
            }
            /** 新建数据 */
            protected newData(): void {
                let app: DocumentEditApp = new DocumentEditApp();
                app.navigation = this.navigation;
                app.viewShower = this.viewShower;
                app.run();
            }
            /** 查看数据，参数：目标数据 */
            protected viewData(data: bo.Document): void {
                // 检查目标数据
                if (ibas.objects.isNull(data)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("shell_data_view")
                    ));
                    return;
                }
                app.views(data);
            }
            /** 编辑数据，参数：目标数据 */
            protected editData(data: bo.Document): void {
                // 检查目标数据
                if (ibas.objects.isNull(data)) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("shell_data_edit")
                    ));
                    return;
                }
                let app: DocumentEditApp = new DocumentEditApp();
                app.navigation = this.navigation;
                app.viewShower = this.viewShower;
                app.run(data);
            }
            /** 删除数据，参数：目标数据集合 */
            protected deleteData(data: bo.Document | bo.Document[]): void {
                let beDeleteds: ibas.IList<bo.Document> = ibas.arrays.create(data);
                // 没有选择删除的对象
                if (beDeleteds.length === 0) {
                    this.messages(ibas.emMessageType.WARNING, ibas.i18n.prop("shell_please_chooose_data",
                        ibas.i18n.prop("shell_data_delete")
                    ));
                    return;
                }
                beDeleteds.forEach((value) => {
                    value.delete();
                });
                let that: this = this;
                this.messages({
                    type: ibas.emMessageType.QUESTION,
                    title: ibas.i18n.prop(this.name),
                    message: ibas.i18n.prop("shell_multiple_data_delete_continue", beDeleteds.length),
                    actions: [ibas.emMessageAction.YES, ibas.emMessageAction.NO],
                    onCompleted(action: ibas.emMessageAction): void {
                        if (action !== ibas.emMessageAction.YES) {
                            return;
                        }
                        let boRepository: bo.BORepositoryDocuments = new bo.BORepositoryDocuments();
                        ibas.queues.execute(beDeleteds, (data, next) => {
                            // 处理数据
                            boRepository.saveDocument({
                                beSaved: data,
                                onCompleted(opRslt: ibas.IOperationResult<bo.Document>): void {
                                    if (opRslt.resultCode !== 0) {
                                        next(new Error(ibas.i18n.prop("shell_data_delete_error", data, opRslt.message)));
                                    } else {
                                        next();
                                    }
                                }
                            });
                            that.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_data_deleting", data));
                        }, (error) => {
                            // 处理完成
                            if (error instanceof Error) {
                                that.messages(ibas.emMessageType.ERROR, error.message);
                            } else {
                                that.messages(ibas.emMessageType.SUCCESS,
                                    ibas.i18n.prop("shell_data_delete") + ibas.i18n.prop("shell_sucessful"));
                            }
                            that.busy(false);
                        });
                        that.busy(true);
                    }
                });
            }
            /** 上传文件 */
            protected uploadFile(files: File[]): void {
                files = ibas.arrays.create(files);
                if (files.length > 0) {
                    this.messages({
                        type: ibas.emMessageType.QUESTION,
                        title: ibas.i18n.prop(this.name),
                        message: ibas.i18n.prop("documents_multiple_file_upload_continue", files.length),
                        actions: [ibas.emMessageAction.YES, ibas.emMessageAction.NO],
                        onCompleted: (action) => {
                            if (action !== ibas.emMessageAction.YES) {
                                return;
                            }
                            let criteria: ibas.Criteria = new ibas.Criteria();
                            this.busy(true);
                            this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_uploading_file"));
                            let boRepository: bo.BORepositoryDocuments = new bo.BORepositoryDocuments();
                            ibas.queues.execute(files, (data, next) => {
                                // 处理数据
                                boRepository.upload({
                                    file: data,
                                    onCompleted: (opRslt) => {
                                        if (opRslt.resultCode !== 0) {
                                            next(new Error(opRslt.message));
                                        } else {
                                            for (let item of opRslt.resultObjects) {
                                                let condition: ibas.ICondition = criteria.conditions.create();
                                                condition.alias = bo.Document.PROPERTY_OBJECTKEY_NAME;
                                                condition.value = String(item.objectKey);
                                                if (criteria.conditions.length > 0) {
                                                    condition.relationship = ibas.emConditionRelationship.OR;
                                                }
                                            }
                                            next();
                                        }
                                    }
                                });
                            }, (error) => {
                                // 处理完成
                                if (error instanceof Error) {
                                    this.messages(ibas.emMessageType.ERROR, error.message);
                                }
                                if (criteria.conditions.length > 0) {
                                    this.fetchData(criteria);
                                }
                                this.busy(false);
                            });
                        }
                    });
                }
            }
            protected dowloadFile(documents: bo.Document[]): void {
                documents = ibas.arrays.create(documents);
                if (documents.length > 0) {
                    this.messages({
                        type: ibas.emMessageType.QUESTION,
                        title: ibas.i18n.prop(this.name),
                        message: ibas.i18n.prop("documents_multiple_file_download_continue", documents.length),
                        actions: [ibas.emMessageAction.YES, ibas.emMessageAction.NO],
                        onCompleted: (action) => {
                            if (action !== ibas.emMessageAction.YES) {
                                return;
                            }
                            this.busy(true);
                            this.proceeding(ibas.emMessageType.INFORMATION, ibas.i18n.prop("shell_downloading_file"));
                            let criteria: ibas.Criteria = new ibas.Criteria();
                            let condition: ibas.ICondition = criteria.conditions.create();
                            condition.alias = ibas.CRITERIA_CONDITION_ALIAS_FILE_NAME;
                            let boRepository: bo.BORepositoryDocuments = new bo.BORepositoryDocuments();
                            ibas.queues.execute(documents, (data, next) => {
                                condition.value = data.sign;
                                boRepository.download({
                                    criteria: criteria,
                                    onCompleted: (opRslt) => {
                                        if (opRslt.resultCode !== 0) {
                                            next(new Error(opRslt.message));
                                        } else {
                                            for (let item of opRslt.resultObjects) {
                                                if (!ibas.objects.isNull(item)) {
                                                    ibas.files.save(item, data.name);
                                                }
                                            }
                                            next();
                                        }
                                    }
                                });
                            }, (error) => {
                                // 处理完成
                                if (error instanceof Error) {
                                    this.messages(ibas.emMessageType.ERROR, error.message);
                                }
                                this.busy(false);
                            });
                        }
                    });

                }
            }
        }
        /** 视图-文档 */
        export interface IDocumentListView extends ibas.IBOListView {
            /** 编辑数据事件，参数：编辑对象 */
            editDataEvent: Function;
            /** 删除数据事件，参数：删除对象集合 */
            deleteDataEvent: Function;
            /** 显示数据 */
            showData(datas: bo.Document[]): void;
            /** 上传文件 */
            uploadFileEvent: Function;
            /** 下载文件 */
            downloadFileEvent: Function;
        }
    }
}