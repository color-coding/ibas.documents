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
            enableSelectAll: false,
            visibleRowCount: 5,
            rows: "{/}",
            columns: [
                new sap.ui.table.Column("", {
                    label: ibas.i18n.prop("bo_document_filename"),
                    template: new sap.m.Text("", {
                        wrapping: false
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
            ]
        });
        return new sap.m.Dialog("", {
            title: this.title,
            type: sap.m.DialogType.Standard,
            state: sap.ui.core.ValueState.None,
            stretchOnPhone: true,
            horizontalScrolling: true,
            verticalScrolling: true,
            content: [this.table],
            buttons: [
                new sap.m.Button("", {
                    text: ibas.i18n.prop("sys_shell_upload"),
                    type: sap.m.ButtonType.Transparent,
                    press: function (): void {
                        that.fireViewEvents(that.uploadFileEvent,
                            // 获取表格选中的对象
                            openui5.utils.getTableSelecteds<bo.Document>(that.table).firstOrDefault()
                        );
                    }
                }),
                new sap.m.Button("", {
                    text: ibas.i18n.prop("sys_shell_download"),
                    type: sap.m.ButtonType.Transparent,
                    press: function (): void {
                        that.fireViewEvents(that.downloadFileEvent,
                            // 获取表格选中的对象
                            openui5.utils.getTableSelecteds<bo.Document>(that.table).firstOrDefault()
                        );
                    }
                }),
                new sap.m.Button("", {
                    text: ibas.i18n.prop("sys_shell_exit"),
                    type: sap.m.ButtonType.Transparent,
                    press: function (): void {
                        that.fireViewEvents(that.closeEvent);
                    }
                }),
            ],
        });
    }
    private table: sap.ui.table.Table;
    /** 显示文档 */
    showDocuments(documents: bo.Document[]): void {
        this.table.setModel(new sap.ui.model.json.JSONModel(documents));
    }
    /** 显示关联对象 */
    showBOKeys(keys: string): void {
        //
    }

}
