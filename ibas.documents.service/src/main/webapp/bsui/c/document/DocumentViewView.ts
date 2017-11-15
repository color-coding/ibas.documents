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
                contentRight: [
                    new sap.m.Button("", {
                        type: sap.m.ButtonType.Transparent,
                        icon: "sap-icon://action",
                        press: function (event: any): void {
                            that.fireViewEvents(that.callServicesEvent, {
                                displayServices(services: ibas.IServiceAgent[]): void {
                                    if (ibas.objects.isNull(services) || services.length === 0) {
                                        return;
                                    }
                                    let popover: sap.m.Popover = new sap.m.Popover("", {
                                        showHeader: false,
                                        placement: sap.m.PlacementType.Bottom,
                                    });
                                    for (let service of services) {
                                        popover.addContent(new sap.m.Button({
                                            text: ibas.i18n.prop(service.name),
                                            type: sap.m.ButtonType.Transparent,
                                            icon: service.icon,
                                            press: function (): void {
                                                service.run();
                                                popover.close();
                                            }
                                        }));
                                    }
                                    (<any>popover).addStyleClass("sapMOTAPopover sapTntToolHeaderPopover");
                                    popover.openBy(event.getSource(), true);
                                }
                            });
                        }
                    })
                ]
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
            let boRepository: BORepositoryDocuments = new BORepositoryDocuments();
            let url: string = boRepository.toUrl(data);
            this.page.addContent(new sap.m.PDFViewer("", {
                showDownloadButton: false,
                source: url
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
