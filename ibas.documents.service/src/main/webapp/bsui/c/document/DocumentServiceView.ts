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
                /** 查看文件 */
                viewFileEvent: Function;
                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    this.list = new sap.m.List("", {
                        mode: sap.m.ListMode.Delete,
                        delete(event: sap.ui.base.Event): void {
                            let listItem: any = event.getParameter("listItem");
                            if (listItem instanceof sap.m.ListItemBase) {
                                that.fireViewEvents(that.deleteEvent, listItem.getBindingContext().getObject());
                            }
                        },
                        items: {
                            path: "/rows",
                            template: new sap.m.CustomListItem("", {
                                content: [
                                    new sap.m.HBox("", {
                                        items: [
                                            new sap.ui.core.Icon("", {
                                                width: "2.5rem",
                                                height: "2.5rem",
                                                size: "2.5rem",
                                                src: {
                                                    path: "name",
                                                    type: new sap.extension.data.Alphanumeric(),
                                                    formatter(name: string): string {
                                                        if (ibas.strings.isWith(name, undefined, ".pdf", true)) {
                                                            return "sap-icon://pdf-attachment";
                                                        } else if (ibas.strings.isWith(name, undefined, ".xlsx", true)) {
                                                            return "sap-icon://excel-attachment";
                                                        } else if (ibas.strings.isWith(name, undefined, ".docx", true)) {
                                                            return "sap-icon://doc-attachment";
                                                        } else if (ibas.strings.isWith(name, undefined, ".pptx", true)) {
                                                            return "sap-icon://ppt-attachment";
                                                        } else if (ibas.strings.isWith(name, undefined, ".txt", true)) {
                                                            return "sap-icon://attachment-text-file";
                                                        } else if (ibas.strings.isWith(name, undefined, ".jpg", true)
                                                            || ibas.strings.isWith(name, undefined, ".jpeg", true)
                                                            || ibas.strings.isWith(name, undefined, ".png", true)
                                                            || ibas.strings.isWith(name, undefined, ".bmp", true)
                                                            || ibas.strings.isWith(name, undefined, ".gif", true)) {
                                                            return "sap-icon://attachment-photo";
                                                        }
                                                        return "sap-icon://document";
                                                    }
                                                },
                                                press(event: sap.ui.base.Event): void {
                                                    // 下载资源
                                                    let soucre: any = event.getSource();
                                                    if (soucre instanceof sap.ui.core.Element) {
                                                        that.fireViewEvents(that.viewFileEvent, soucre.getBindingContext().getObject());
                                                    }
                                                },
                                            }).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginTopBottom"),
                                            new sap.m.VBox("", {
                                                items: [
                                                    new sap.m.Link("", {
                                                        wrapping: true,
                                                        text: {
                                                            path: "name",
                                                            type: new sap.extension.data.Alphanumeric()
                                                        },
                                                        press(event: sap.ui.base.Event): void {
                                                            // 下载资源
                                                            let soucre: any = event.getSource();
                                                            if (soucre instanceof sap.ui.core.Element) {
                                                                that.fireViewEvents(that.downloadFileEvent, soucre.getBindingContext().getObject());
                                                            }
                                                        },
                                                    }),
                                                    new sap.m.Label("", {
                                                        text: {
                                                            parts: [
                                                                {
                                                                    path: "version",
                                                                    type: new sap.extension.data.Alphanumeric()
                                                                },
                                                                {
                                                                    path: "createDate",
                                                                    type: new sap.extension.data.Date()
                                                                },
                                                                {
                                                                    path: "createTime",
                                                                    type: new sap.extension.data.Time()
                                                                }
                                                            ]
                                                        },
                                                    })

                                                ]
                                            }).addStyleClass("sapUiSmallMarginBegin sapUiSmallMarginTopBottom")
                                        ]
                                    })
                                ]
                            }),
                        },
                    });
                    return new sap.m.Dialog("", {
                        title: this.title,
                        type: sap.m.DialogType.Standard,
                        state: sap.ui.core.ValueState.None,
                        stretch: ibas.config.get(ibas.CONFIG_ITEM_PLANTFORM) === ibas.emPlantform.PHONE ? true : false,
                        horizontalScrolling: false,
                        verticalScrolling: true,
                        contentWidth: "60%", contentHeight: "40%",
                        subHeader: this.headerBar = new sap.m.Bar("", {
                            contentLeft: [
                                new sap.m.Title("", {
                                    titleStyle: sap.ui.core.TitleLevel.H4
                                }),
                            ],
                            contentRight: [
                                new sap.m.SearchField("", {
                                    width: "auto",
                                    search(event: sap.ui.base.Event): void {
                                        let source: any = event.getSource();
                                        if (source instanceof sap.m.SearchField) {
                                            let search: string = source.getValue();
                                            for (let item of that.list.getItems()) {
                                                item.setVisible(true);
                                                if (ibas.strings.isEmpty(search)) {
                                                    continue;
                                                }
                                                if (item instanceof sap.m.CustomListItem) {
                                                    let link: any = (<any>item.getContent()[0])?.getItems()[1]?.getItems()[0];
                                                    if (link instanceof sap.m.Link) {
                                                        let content: string = link.getText();
                                                        if (!ibas.strings.isEmpty(content)) {
                                                            if (content.indexOf(search) >= 0) {
                                                                continue;
                                                            }
                                                        }
                                                    }
                                                    item.setVisible(false);
                                                }
                                            }
                                        }
                                    }
                                }),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("documents_upload_document"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://upload",
                                    press: function (): void {
                                        ibas.files.open((files) => {
                                            that.fireViewEvents(that.uploadFileEvent, files);
                                        }, { multiple: true });
                                    }
                                }),
                            ]
                        }),
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
                    }).addStyleClass("sapUiNoContentPadding");
                }
                private list: sap.m.List;
                private headerBar: sap.m.Bar;
                /** 显示文档 */
                showDocuments(documents: bo.Document[]): void {
                    this.list.setModel(new sap.extension.model.JSONModel({ rows: documents }));
                }
                /** 显示关联对象 */
                showBusinessObject(bo: ibas.IBusinessObject): void {
                    let title: any = this.headerBar.getContentLeft()[0];
                    if (title instanceof sap.m.Title) {
                        title.setText(ibas.i18n.prop("documents_bo_title", ibas.businessobjects.describe(bo.toString())));
                    }
                }

            }
        }
    }
}