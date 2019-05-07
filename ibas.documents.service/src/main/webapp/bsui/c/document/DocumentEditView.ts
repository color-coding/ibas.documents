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
                    let formTop: sap.ui.layout.form.SimpleForm = new sap.ui.layout.form.SimpleForm("", {
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
                                path: "name"
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_document_version") }),
                            new sap.extension.m.Input("", {
                            }).bindProperty("bindingValue", {
                                path: "version",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 10
                                })
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_document_tags") }),
                            new sap.extension.m.Input("", {
                            }).bindProperty("bindingValue", {
                                path: "tags",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 100
                                })
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_document_reference1") }),
                            new sap.extension.m.Input("", {
                            }).bindProperty("bindingValue", {
                                path: "reference1",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 100
                                })
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_document_reference2") }),
                            new sap.extension.m.Input("", {
                            }).bindProperty("bindingValue", {
                                path: "reference2",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 200
                                })
                            }),
                            new sap.ui.core.Title("", { text: ibas.i18n.prop("documents_title_others") }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_document_activated") }),
                            new sap.extension.m.EnumSelect("", {
                                enumType: ibas.emYesNo
                            }).bindProperty("bindingValue", {
                                path: "activated",
                                type: new sap.extension.data.YesNo()
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_document_sign") }),
                            new sap.extension.m.Input("", {
                                editable: false,
                            }).bindProperty("bindingValue", {
                                path: "sign",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 60
                                })
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_document_bokeys") }),
                            new sap.extension.m.Input("", {
                                editable: false,
                            }).bindProperty("bindingValue", {
                                path: "boKeys",
                                formatter(data: any): any {
                                    return ibas.businessobjects.describe(data);
                                }
                            }),
                        ]
                    });
                    return this.page = new sap.extension.m.DataPage("", {
                        showHeader: false,
                        dataInfo: {
                            code: bo.Document.BUSINESS_OBJECT_CODE,
                        },
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
                        content: [
                            formTop,
                        ]
                    });
                }
                private page: sap.extension.m.Page;

                /** 显示数据 */
                showDocument(data: bo.Document): void {
                    this.page.setModel(new sap.extension.model.JSONModel(data));
                    // 改变页面状态
                    sap.extension.pages.changeStatus(this.page);
                }
            }
        }
    }
}