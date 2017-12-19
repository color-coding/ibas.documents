/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import * as openui5 from "openui5/index";
import * as bo from "../../../borep/bo/index";
import { IBODocumentServiceView } from "../../../bsapp/document/index";

/**
 * 数据服务视图
 */
export class BODocumentServiceView extends ibas.BODialogView implements IBODocumentServiceView {
    /** 上传文件 */
    uploadFileEvent: Function;
    /** 下载文件 */
    downloadFileEvent: Function;
    /** 绘制视图 */
    darw(): any {
        let that: this = this;
        this.table = new sap.ui.table.Table("", {
            selectionMode: sap.ui.table.SelectionMode.None,
            visibleRowCount: 5,
            rows: "{/}",
            columns: [
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("bo_document_filename"),
                    template: new sap.m.Link("", {
                        width: "100%",
                        press(): void {
                            that.fireViewEvents(that.downloadFileEvent,
                                this.getBindingContext().getObject()
                            );
                        },
                    }).bindProperty("text", {
                        path: "fileName"
                    })
                }),
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("bo_document_version"),
                    template: new sap.m.Text("", {
                        wrapping: false
                    }).bindProperty("text", {
                        path: "version"
                    })
                }),
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("bo_document_tags"),
                    template: new sap.m.Text("", {
                        wrapping: false
                    }).bindProperty("text", {
                        path: "tags"
                    })
                }),
                /*
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("bo_document_reference1"),
                    template: new sap.m.Text("", {
                        wrapping: false
                    }).bindProperty("text", {
                        path: "reference1"
                    })
                }),
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("bo_document_reference2"),
                    template: new sap.m.Text("", {
                        wrapping: false
                    }).bindProperty("text", {
                        path: "reference2"
                    })
                }),
                */
            ]
        });
        this.link = new sap.m.Link("", {
            width: "100%"
        });
        return new sap.m.Dialog("", {
            title: this.title,
            type: sap.m.DialogType.Standard,
            state: sap.ui.core.ValueState.None,
            stretchOnPhone: true,
            horizontalScrolling: true,
            verticalScrolling: true,
            subHeader: new sap.m.Toolbar("", {
                content: [
                    this.link,
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
            content: [this.table],
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
    private table: sap.ui.table.Table;
    private link: sap.m.Link;
    /** 显示文档 */
    showDocuments(documents: bo.Document[]): void {
        this.table.setModel(new sap.ui.model.json.JSONModel(documents));
    }
    /** 显示关联对象 */
    showBOKeys(keys: string): void {
        this.link.setText(ibas.i18n.prop("documents_bo_keys", keys));
    }

}
