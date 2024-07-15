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
            export class DocumentViewView extends ibas.BOViewView implements app.IDocumentViewView {
                /** 下载文件 */
                downloadFileEvent: Function;
                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    return this.page = new sap.extension.m.Page("", {
                        showHeader: false,
                        showSubHeader: true,
                        subHeader: new sap.m.Bar("", {
                            contentLeft: [
                                new sap.m.Title("", {
                                    text: {
                                        parts: [
                                            {
                                                path: "objectKey",
                                                type: new sap.extension.data.Numeric()
                                            },
                                            {
                                                path: "name",
                                                type: new sap.extension.data.Alphanumeric()
                                            }
                                        ],
                                        formatter(objectKey: number, name: string): string {
                                            let builder: ibas.StringBuilder = new ibas.StringBuilder();
                                            builder.map(null, "");
                                            builder.map(undefined, "");
                                            builder.append("#");
                                            builder.append(objectKey);
                                            builder.append(" - ");
                                            builder.append(name);
                                            return builder.toString();
                                        }
                                    }
                                }).addStyleClass("sapUiTinyMarginBegin sapUiSmallMarginEnd"),
                                new sap.extension.m.PropertyObjectAttribute("", {
                                    title: ibas.i18n.prop("bo_document_version"),
                                    visible: {
                                        path: "version",
                                        formatter(data: any): boolean {
                                            return data ? true : false;
                                        }
                                    }
                                }).bindProperty("bindingValue", {
                                    path: "version",
                                    type: new sap.extension.data.Alphanumeric()
                                }).addStyleClass("sapUiSmallMarginBegin"),
                                new sap.extension.m.PropertyObjectAttribute("", {
                                    title: ibas.i18n.prop("bo_document_tags"),
                                    visible: {
                                        path: "tags",
                                        formatter(data: any): boolean {
                                            return data ? true : false;
                                        }
                                    },
                                    dataInfo: {
                                        code: bo.Document.BUSINESS_OBJECT_CODE,
                                    },
                                    propertyName: "tags",
                                }).bindProperty("bindingValue", {
                                    path: "tags",
                                    type: new sap.extension.data.Alphanumeric()
                                }).addStyleClass("sapUiSmallMarginBegin"),
                            ],
                            contentRight: [
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("documents_download_file"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://download",
                                    press: function (): void {
                                        that.fireViewEvents(that.downloadFileEvent);
                                    }
                                }),
                            ],
                        }),
                    });
                }
                private page: sap.extension.m.Page;
                /** 显示数据 */
                showDocument(data: bo.Document): void {
                    this.page.setModel(new sap.extension.model.JSONModel(data));
                    if (data.name.toLowerCase().endsWith(".pdf")) {
                        this.page.addContent(new sap.m.PDFViewer("", {
                            showDownloadButton: false,
                            isTrustedSource: true,
                            displayType: sap.m.PDFViewerDisplayType.Embedded,
                            source: data.url(),
                        }));
                    } else if (IMAGES.findIndex((value) => {
                        return data.name.toLowerCase().endsWith("." + value) ? true : false;
                    }) >= 0) {
                        this.page.addContent(new sap.m.FlexBox("", {
                            width: "100%",
                            height: "100%",
                            justifyContent: sap.m.FlexJustifyContent.Center,
                            renderType: sap.m.FlexRendertype.Div,
                            items: [
                                new sap.m.Image("", {
                                    width: "100%",
                                    src: data.url(),
                                    error(this: sap.m.Image, event: sap.ui.base.Event): void {
                                        (<any>this.getParent()).addContent(new sap.m.MessagePage("", {
                                            text: ibas.i18n.prop("documents_unrecognized_document"),
                                            description: "",
                                            showHeader: false,
                                            showNavButton: false,
                                            textDirection: sap.ui.core.TextDirection.Inherit
                                        }));
                                    },
                                })
                            ]
                        }));
                        this.page.setEnableScrolling(true);
                    } else {
                        this.page.addContent(new sap.m.MessagePage("", {
                            text: ibas.i18n.prop("documents_unrecognized_document"),
                            description: "",
                            showHeader: false,
                            showNavButton: false,
                            textDirection: sap.ui.core.TextDirection.Inherit
                        }));
                    }
                }
            }
        }
        const IMAGES: string[] = ["jpeg", "jpg", "png", "gif", "bmp", "raw"];
    }
}