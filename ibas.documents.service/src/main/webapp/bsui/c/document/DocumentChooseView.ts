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
            export class DocumentChooseView extends ibas.BOChooseView implements app.IDocumentChooseView {
                /** 返回查询的对象 */
                get queryTarget(): any {
                    return bo.Document;
                }
                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    this.table = new sap.extension.table.DataTable("", {
                        chooseType: this.chooseType,
                        visibleRowCount: sap.extension.table.visibleRowCount(15),
                        dataInfo: this.queryTarget,
                        rows: "{/rows}",
                        columns: [
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_document_objectkey"),
                                template: new sap.extension.m.Text("", {
                                }).bindProperty("bindingValue", {
                                    path: "objectKey",
                                    type: new sap.extension.data.Numeric()
                                }),
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_document_name"),
                                template: new sap.extension.m.Text("", {
                                }).bindProperty("bindingValue", {
                                    path: "name",
                                    type: new sap.extension.data.Alphanumeric()
                                }),
                                width: "24rem",
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_document_version"),
                                template: new sap.extension.m.Text("", {
                                }).bindProperty("bindingValue", {
                                    path: "version",
                                    type: new sap.extension.data.Alphanumeric()
                                }),
                                width: "8rem",
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_document_activated"),
                                template: new sap.extension.m.Text("", {
                                }).bindProperty("bindingValue", {
                                    path: "activated",
                                    type: new sap.extension.data.YesNo(true)
                                }),
                                width: "6rem",
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_document_createtime"),
                                template: new sap.extension.m.Text("", {
                                }).bindProperty("bindingValue", {
                                    parts: [
                                        {
                                            path: "createDate",
                                            type: new sap.extension.data.Date()
                                        },
                                        {
                                            path: "createTime",
                                            type: new sap.extension.data.Time()
                                        }
                                    ]
                                }),
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_document_bokeys"),
                                template: new sap.extension.m.Text("", {
                                }).bindProperty("bindingValue", {
                                    path: "boKeys",
                                    formatter(data: any): any {
                                        return ibas.businessobjects.describe(data);
                                    }
                                }),
                                width: "16rem",
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_document_dataowner"),
                                template: new sap.extension.m.UserText("", {
                                }).bindProperty("bindingValue", {
                                    path: "dataOwner",
                                    type: new sap.extension.data.Alphanumeric()
                                }),
                            }),
                            new sap.extension.table.DataColumn("", {
                                label: ibas.i18n.prop("bo_document_remarks"),
                                template: new sap.extension.m.Text("", {
                                }).bindProperty("bindingValue", {
                                    path: "remarks",
                                    type: new sap.extension.data.Alphanumeric()
                                }),
                                width: "20rem",
                            }),
                        ],
                        nextDataSet(event: sap.ui.base.Event): void {
                            // 查询下一个数据集
                            let data: any = event.getParameter("data");
                            if (ibas.objects.isNull(data)) {
                                return;
                            }
                            if (ibas.objects.isNull(that.lastCriteria)) {
                                return;
                            }
                            let criteria: ibas.ICriteria = that.lastCriteria.next(data);
                            if (ibas.objects.isNull(criteria)) {
                                return;
                            }
                            ibas.logger.log(ibas.emMessageLevel.DEBUG, "result: {0}", criteria.toString());
                            that.fireViewEvents(that.fetchDataEvent, criteria);
                        }
                    });
                    return new sap.m.Dialog("", {
                        title: this.title,
                        type: sap.m.DialogType.Standard,
                        state: sap.ui.core.ValueState.None,
                        horizontalScrolling: true,
                        verticalScrolling: true,
                        content: [
                            this.table
                        ],
                        buttons: [
                            new sap.m.Button("", {
                                text: ibas.i18n.prop("shell_data_new"),
                                visible: this.mode === ibas.emViewMode.VIEW ? false : true,
                                type: sap.m.ButtonType.Transparent,
                                press: function (): void {
                                    that.fireViewEvents(that.newDataEvent);
                                }
                            }),
                            new sap.m.Button("", {
                                text: ibas.i18n.prop("shell_data_choose"),
                                type: sap.m.ButtonType.Transparent,
                                press: function (): void {
                                    that.fireViewEvents(that.chooseDataEvent, that.table.getSelecteds());
                                }
                            }),
                            new sap.m.Button("", {
                                text: ibas.i18n.prop("shell_exit"),
                                type: sap.m.ButtonType.Transparent,
                                press: function (): void {
                                    that.fireViewEvents(that.closeEvent);
                                }
                            }),
                        ]
                    }).addStyleClass("sapUiNoContentPadding");
                }
                private table: sap.extension.table.Table;
                /** 显示数据 */
                showData(datas: bo.Document[]): void {
                    let model: sap.ui.model.Model = this.table.getModel();
                    if (model instanceof sap.extension.model.JSONModel) {
                        // 已绑定过数据
                        model.addData(datas);
                    } else {
                        // 未绑定过数据
                        this.table.setModel(new sap.extension.model.JSONModel({ rows: datas }));
                    }
                    this.table.setBusy(false);
                }
                /** 记录上次查询条件，表格滚动时自动触发 */
                query(criteria: ibas.ICriteria): void {
                    super.query(criteria);
                    // 清除历史数据
                    if (this.isDisplayed) {
                        this.table.setBusy(true);
                        this.table.setFirstVisibleRow(0);
                        this.table.setModel(null);
                    }
                }
            }
        }
    }
}