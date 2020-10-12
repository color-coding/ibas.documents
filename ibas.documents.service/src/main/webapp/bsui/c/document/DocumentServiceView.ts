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
             * 文档服务视图
             */
            export class DocumentServiceView extends ibas.DialogView implements app.IDocumentServiceView {
                /** 上传文件 */
                uploadFileEvent: Function;
                /** 下载文件 */
                downloadFileEvent: Function;
                /** 删除事件 */
                deleteEvent: Function;
                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    this.listTitle = new sap.m.Title("", {
                        titleStyle: sap.ui.core.TitleLevel.H5
                    });
                    this.list = new sap.m.List("", {
                        headerToolbar: new sap.m.Toolbar("", {
                            content: [
                                this.listTitle,
                                new sap.m.ToolbarSpacer("", {}),
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
                        mode: sap.m.ListMode.Delete,
                        delete(event: sap.ui.base.Event): void {
                            let listItem: any = event.getParameter("listItem");
                            if (listItem instanceof sap.m.FeedListItem) {
                                that.fireViewEvents(that.deleteEvent, listItem.getBindingContext().getObject());
                            }
                        },
                        items: {
                            path: "/rows",
                            template: new sap.m.FeedListItem("", {
                                icon: "sap-icon://document",
                                text: "{name}",
                                info: "{version}",
                                timestamp: "{sign}",
                                iconPress(event: sap.ui.base.Event): void {
                                    // 下载资源
                                    let listItem: any = event.getSource();
                                    if (listItem instanceof sap.m.FeedListItem) {
                                        that.fireViewEvents(that.downloadFileEvent, listItem.getBindingContext().getObject());
                                    }
                                },
                            })
                        },
                    });
                    return new sap.extension.m.Dialog("", {
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
                    this.list.setModel(new sap.extension.model.JSONModel({ rows: documents }));
                }
                /** 显示关联对象 */
                showBusinessObject(bo: ibas.IBusinessObject): void {
                    this.listTitle.setText(ibas.i18n.prop("documents_bo_title", ibas.businessobjects.describe(bo.toString())));
                }

            }
        }
    }
}