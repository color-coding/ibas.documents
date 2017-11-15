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
    darw(): any {
        let that: this = this;
        this.page = new sap.m.Page("", {
            showHeader: false,
            subHeader: new sap.m.Bar("", {
                contentLeft: [
                    new sap.m.Button("", {
                        text: ibas.i18n.prop("sys_shell_data_edit"),
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
            let criteria: ibas.ICriteria = new ibas.Criteria();
            let condition: ibas.ICondition = criteria.conditions.create();
            condition.alias = ibas.CRITERIA_CONDITION_ALIAS_FILE_NAME;
            condition.value = data.fileSign;
            let that: this = this;
            let boRepository: BORepositoryDocuments = new BORepositoryDocuments();
            boRepository.download({
                criteria: criteria,
                onCompleted(opRslt: ibas.IOperationResult<Blob>): void {
                    let blob: Blob = opRslt.resultObjects.firstOrDefault();
                    if (!ibas.objects.isNull(blob)) {
                        let fileReader: FileReader = new FileReader();
                        fileReader.onload = function (e: ProgressEvent): void {
                            let dataUrl: string = (<any>e.target).result;
                            let datas: string[] = dataUrl.split(","),
                                mime: string = "data:application/pdf",
                                // atob() 函数用来解码一个已经被base-64编码过的数据
                                decodedDatas: string = atob(datas[1]),
                                length: number = decodedDatas.length,
                                uint8Array: Uint8Array = new Uint8Array(length);
                            while (length--) {
                                uint8Array[length] = decodedDatas.charCodeAt(length);
                            }
                            let newBlob: Blob = new Blob([uint8Array], { type: mime });
                            // 成功获取
                            let url: string = window.URL.createObjectURL(newBlob);
                            that.page.addContent(new sap.m.PDFViewer("", {
                                showDownloadButton: false,
                                source: url
                            }));
                        };
                        fileReader.readAsDataURL(blob);
                    } else {
                        that.page.addContent(new sap.m.MessagePage("", {
                            text: ibas.i18n.prop("documents_not_found_file", data.fileName),
                            description: "",
                            showHeader: false,
                            showNavButton: false,
                            textDirection: sap.ui.core.TextDirection.Inherit
                        }));
                    }
                }
            });
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
