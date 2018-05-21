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
             * 数据服务视图
             */
            export class BODocumentServiceView extends ibas.BODialogView implements app.IBODocumentServiceView {
                /** 上传文件 */
                uploadFileEvent: Function;
                /** 下载文件 */
                downloadFileEvent: Function;
                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    this.listTitle = new sap.m.Title("", {
                        level: sap.ui.core.TitleLevel.H4
                    });
                    this.list = new sap.m.List("", {
                        headerToolbar: new sap.m.Toolbar("", {
                            content: [
                                this.listTitle,
                                new sap.m.ToolbarSpacer("", { width: "80px" }),
                                new sap.ui.unified.FileUploader("", {
                                    name: "file",
                                    width: "auto",
                                    buttonOnly: true,
                                    buttonText: ibas.i18n.prop("documents_upload_document"),
                                    icon: "sap-icon://upload",
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
                                }),
                            ]
                        }),
                    });
                    return new sap.m.Dialog("", {
                        title: this.title,
                        type: sap.m.DialogType.Standard,
                        state: sap.ui.core.ValueState.None,
                        stretchOnPhone: true,
                        horizontalScrolling: true,
                        verticalScrolling: true,
                        content: [
                            this.list
                        ],
                        buttons: [
                            new sap.m.Button("", {
                                text: ibas.i18n.prop("shell_exit"),
                                type: sap.m.ButtonType.Transparent,
                                press: function (): void {
                                    that.fireViewEvents(that.closeEvent);
                                }
                            }),
                        ],
                    });
                }
                private list: sap.m.List;
                private listTitle: sap.m.Title;
                /** 显示文档 */
                showDocuments(documents: bo.Document[]): void {
                    let that: this = this;
                    for (let item of documents) {
                        this.list.addItem(new sap.m.FeedListItem("", {
                            icon: "sap-icon://document",
                            text: item.fileName,
                            info: item.version,
                            timestamp: item.fileSign,
                            iconPress(oControlEvent: sap.ui.base.Event): void {
                                // 下载资源
                                that.fireViewEvents(that.downloadFileEvent, item);
                            }
                        }));
                    }
                }
                /** 显示关联对象 */
                showBusinessObject(bo: ibas.IBusinessObject): void {
                    let text: string = bo.toString();
                    if (text.startsWith("{") && text.endsWith("}")) {
                        text = text.substring(1, text.length - 1);
                    }
                    this.listTitle.setText(ibas.i18n.prop("documents_bo_title", text));
                }

            }
        }
    }
}