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
import { IDocumentViewView } from "../../../bsapp/document/index";
import { BORepositoryDocuments } from "borep/BORepositories";

/**
 * 视图-Document
 */
export class DocumentViewView extends ibas.BOViewView implements IDocumentViewView {

    /** 下载文件 */
    downloadFileEvent: Function;
    /** 绘制视图 */
    draw(): any {
        let that: this = this;
        this.page = new sap.m.Page("", {
            showHeader: false,
            subHeader: new sap.m.Bar("", {
                contentLeft: [
                    new sap.m.Button("", {
                        text: ibas.i18n.prop("shell_data_edit"),
                        type: sap.m.ButtonType.Transparent,
                        icon: "sap-icon://edit",
                        press: function (): void {
                            that.fireViewEvents(that.editDataEvent);
                        }
                    }),
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
        this.id = this.page.getId();
        return this.page;
    }
    private page: sap.m.Page;

    /** 显示数据 */
    showDocument(data: bo.Document): void {
        this.page.setTitle(ibas.strings.format("{0} - {1}", this.page.getTitle(), data.fileName));
        if (data.fileName.toLowerCase().endsWith(".pdf")) {
            this.page.addContent(new sap.m.PDFViewer("", {
                showDownloadButton: false,
                source: new BORepositoryDocuments().toUrl(data),
            }));
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
