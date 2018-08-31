/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace documents {
    export namespace ui {
        export namespace c {
            /**
             * 视图-Document
             */
            export class DocumentEditView extends ibas.BOEditView implements app.IDocumentEditView {
                /** 删除数据事件 */
                deleteDataEvent: Function;
                /** 新建数据事件，参数1：是否克隆 */
                createDataEvent: Function;
                /** 上传文件 */
                uploadFileEvent: Function;
                /** 下载文件 */
                downloadFileEvent: Function;

                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    this.form = new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                        content: [
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("documents_title_general") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_document_name") }),
                            new sap.ui.unified.FileUploader("", {
                                name: "file",
                                width: "100%",
                                placeholder: ibas.i18n.prop("shell_browse"),
                                change(event: sap.ui.base.Event): void {
                                    if (ibas.objects.isNull(event.getParameters())
                                        || ibas.objects.isNull(event.getParameters().files)
                                        || event.getParameters().files.length === 0) {
                                        return;
                                    }
                                    let fileData: FormData = new FormData();
                                    fileData.append("file", event.getParameters().files[0], encodeURI(event.getParameters().newValue));
                                    that.application.viewShower.messages({
                                        type: ibas.emMessageType.QUESTION,
                                        title: that.application.description,
                                        actions: [
                                            ibas.emMessageAction.YES,
                                            ibas.emMessageAction.NO
                                        ],
                                        message: ibas.i18n.prop("documents_whether_upload_file"),
                                        onCompleted(action: ibas.emMessageAction): void {
                                            if (action === ibas.emMessageAction.YES) {
                                                that.fireViewEvents(that.uploadFileEvent, fileData);
                                            }
                                        }
                                    });
                                }
                            }).bindProperty("value", {
                                path: "/name"
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_document_version") }),
                            new sap.m.Input("", {
                                type: sap.m.InputType.Text
                            }).bindProperty("value", {
                                path: "/version"
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_document_tags") }),
                            new sap.m.Input("", {
                                type: sap.m.InputType.Text
                            }).bindProperty("value", {
                                path: "/tags"
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_document_reference1") }),
                            new sap.m.Input("", {
                                type: sap.m.InputType.Text
                            }).bindProperty("value", {
                                path: "/reference1"
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_document_reference2") }),
                            new sap.m.Input("", {
                                type: sap.m.InputType.Text
                            }).bindProperty("value", {
                                path: "/reference2"
                            }),
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("documents_title_others") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_document_objectkey") }),
                            new sap.m.Input("", {
                                enabled: false,
                                type: sap.m.InputType.Text
                            }).bindProperty("value", {
                                path: "/objectKey",
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_document_objectcode") }),
                            new sap.m.Input("", {
                                enabled: false,
                                type: sap.m.InputType.Text
                            }).bindProperty("value", {
                                path: "/objectCode",
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_document_sign") }),
                            new sap.m.Input("", {
                                enabled: false,
                                type: sap.m.InputType.Text
                            }).bindProperty("value", {
                                path: "/sign",
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_document_bokeys") }),
                            new sap.m.Input("", {
                                enabled: false,
                                type: sap.m.InputType.Text
                            }).bindProperty("value", {
                                path: "/boKeys",
                                formatter(data: any): any {
                                    return ibas.businessobjects.describe(data);
                                }
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_document_activated") }),
                            new sap.m.Select("", {
                                items: openui5.utils.createComboBoxItems(ibas.emYesNo)
                            }).bindProperty("selectedKey", {
                                path: "/activated",
                                type: "sap.ui.model.type.Integer"
                            }),
                        ]
                    });
                    this.page = new sap.m.Page("", {
                        showHeader: false,
                        subHeader: new sap.m.Toolbar("", {
                            content: [
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_save"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://save",
                                    press: function (): void {
                                        that.fireViewEvents(that.saveDataEvent);
                                    }
                                }),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_delete"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://delete",
                                    press: function (): void {
                                        that.fireViewEvents(that.deleteDataEvent);
                                    }
                                }),
                                new sap.m.ToolbarSeparator(""),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("documents_download_file"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://download",
                                    press: function (): void {
                                        that.fireViewEvents(that.downloadFileEvent);
                                    }
                                }),
                            ]
                        }),
                        content: [this.form]
                    });
                    this.id = this.page.getId();
                    return this.page;
                }
                private page: sap.m.Page;
                private form: sap.ui.layout.form.SimpleForm;
                /** 改变视图状态 */
                private changeViewStatus(data: bo.Document): void {
                    if (ibas.objects.isNull(data)) {
                        return;
                    }
                    // 新建时：禁用删除，
                    if (data.isNew) {
                        if (this.page.getSubHeader() instanceof sap.m.Toolbar) {
                            openui5.utils.changeToolbarSavable(<sap.m.Toolbar>this.page.getSubHeader(), true);
                            openui5.utils.changeToolbarDeletable(<sap.m.Toolbar>this.page.getSubHeader(), false);
                        }
                    }
                    // 不可编辑：已批准，
                    if (data.approvalStatus === ibas.emApprovalStatus.APPROVED) {
                        if (this.page.getSubHeader() instanceof sap.m.Toolbar) {
                            openui5.utils.changeToolbarSavable(<sap.m.Toolbar>this.page.getSubHeader(), false);
                            openui5.utils.changeToolbarDeletable(<sap.m.Toolbar>this.page.getSubHeader(), false);
                        }
                        openui5.utils.changeFormEditable(this.form, false);
                    }
                }

                /** 显示数据 */
                showDocument(data: bo.Document): void {
                    this.form.setModel(new sap.ui.model.json.JSONModel(data));
                    // 监听属性改变，并更新控件
                    openui5.utils.refreshModelChanged(this.form, data);
                    // 改变视图状态
                    this.changeViewStatus(data);
                }
            }
        }
    }
}