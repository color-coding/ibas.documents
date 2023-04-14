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
            export class DocumentEditView extends ibas.BOEditView implements app.IDocumentEditView {
                /** 删除数据事件 */
                deleteDataEvent: Function;
                /** 查看数据 */
                viewDataEvent: Function;
                /** 上传文件 */
                uploadFileEvent: Function;
                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    let formTop: sap.ui.layout.form.SimpleForm = new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                        content: [
                            new sap.m.Toolbar("", { visible: false }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_document_name") }),
                            new sap.extension.m.Input("", {
                            }).bindProperty("bindingValue", {
                                path: "name",
                                type: new sap.extension.data.Alphanumeric()
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_document_version") }),
                            new sap.extension.m.Input("", {
                            }).bindProperty("bindingValue", {
                                path: "version",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 10
                                })
                            }),
                            new sap.m.Toolbar("", { visible: false }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_document_activated") }),
                            new sap.extension.m.EnumSelect("", {
                                enumType: ibas.emYesNo
                            }).bindProperty("bindingValue", {
                                path: "activated",
                                type: new sap.extension.data.YesNo(),
                            }),
                        ]
                    });
                    let formMiddle: sap.ui.layout.form.SimpleForm = new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                        content: [
                            new sap.m.IconTabBar("", {
                                headerBackgroundDesign: sap.m.BackgroundDesign.Transparent,
                                backgroundDesign: sap.m.BackgroundDesign.Transparent,
                                expandable: false,
                                items: [
                                    new sap.m.IconTabFilter("", {
                                        text: ibas.i18n.prop("documents_title_general"),
                                        content: [
                                            new sap.ui.layout.form.SimpleForm("", {
                                                editable: true,
                                                content: [
                                                    new sap.m.Toolbar("", { visible: false }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_document_tags") }),
                                                    new sap.extension.m.MultiComboBox("", {
                                                        loadItems(this: sap.m.MultiComboBox): void {
                                                            let boRepository: shell.bo.IBORepositoryShell = ibas.boFactory.create(shell.bo.BO_REPOSITORY_SHELL);
                                                            boRepository.fetchBizObjectInfo({
                                                                user: ibas.variablesManager.getValue(ibas.VARIABLE_NAME_USER_CODE),
                                                                boCode: ibas.config.applyVariables(bo.Document.BUSINESS_OBJECT_CODE),
                                                                onCompleted: (opRslt) => {
                                                                    try {
                                                                        if (opRslt.resultCode !== 0) {
                                                                            throw new Error(opRslt.message);
                                                                        }
                                                                        for (let data of opRslt.resultObjects) {
                                                                            for (let property of data.properties) {
                                                                                if (ibas.strings.equalsIgnoreCase(bo.Document.PROPERTY_TAGS_NAME, property.name)) {
                                                                                    if (property.values instanceof Array) {
                                                                                        for (let item of property.values) {
                                                                                            if (ibas.strings.isEmpty(item.value)) {
                                                                                                continue;
                                                                                            }
                                                                                            this.addItem(new sap.extension.m.SelectItem("", {
                                                                                                key: item.value,
                                                                                                text: ibas.strings.isEmpty(item.description) ? item.value : item.description,
                                                                                            }));
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                            return;
                                                                        }
                                                                    } catch (error) {
                                                                        ibas.logger.log(error);
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    }).bindProperty("bindingValue", {
                                                        path: "tags",
                                                        type: new sap.extension.data.Alphanumeric()
                                                    }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_document_reference1") }),
                                                    new sap.extension.m.Input("", {
                                                    }).bindProperty("bindingValue", {
                                                        path: "reference1",
                                                        type: new sap.extension.data.Alphanumeric({
                                                            maxLength: 100
                                                        })
                                                    }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_document_reference2") }),
                                                    new sap.extension.m.Input("", {
                                                    }).bindProperty("bindingValue", {
                                                        path: "reference2",
                                                        type: new sap.extension.data.Alphanumeric({
                                                            maxLength: 200
                                                        })
                                                    }),
                                                    new sap.m.Toolbar("", { visible: false }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_document_sign") }),
                                                    new sap.extension.m.Input("", {
                                                        editable: false,
                                                    }).bindProperty("bindingValue", {
                                                        path: "sign",
                                                        type: new sap.extension.data.Alphanumeric({
                                                            maxLength: 60
                                                        })
                                                    }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_document_bokeys") }),
                                                    new sap.m.FlexBox("", {
                                                        width: "100%",
                                                        justifyContent: sap.m.FlexJustifyContent.Start,
                                                        renderType: sap.m.FlexRendertype.Bare,
                                                        items: [
                                                            new sap.extension.m.Input("", {
                                                                editable: false,
                                                            }).bindProperty("bindingValue", {
                                                                path: "boKeys",
                                                                formatter(data: any): any {
                                                                    return ibas.businessobjects.describe(data);
                                                                }
                                                            }),
                                                            new sap.m.Button("", {
                                                                width: "auto",
                                                                icon: "sap-icon://detail-view",
                                                                press(this: sap.m.Button): void {
                                                                    let boKeys: string = this.getBindingContext()?.getObject()?.boKeys;
                                                                    if (!ibas.strings.isEmpty(boKeys)) {
                                                                        let criteria: ibas.ICriteria = ibas.criterias.valueOf(boKeys);
                                                                        if (!ibas.objects.isNull(criteria)) {
                                                                            let done: boolean = ibas.servicesManager.runLinkService({
                                                                                boCode: criteria.businessObject,
                                                                                linkValue: criteria
                                                                            });
                                                                            if (!done) {
                                                                                that.application.viewShower.proceeding(
                                                                                    that,
                                                                                    ibas.emMessageType.WARNING,
                                                                                    ibas.i18n.prop("documents_not_found_businessojbect_link_service",
                                                                                        ibas.businessobjects.describe(criteria.businessObject))
                                                                                );
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }).addStyleClass("sapUiTinyMarginBegin"),
                                                        ]
                                                    }),
                                                    new sap.m.Label("", { text: ibas.i18n.prop("bo_document_url") }),
                                                    new sap.m.FlexBox("", {
                                                        width: "100%",
                                                        justifyContent: sap.m.FlexJustifyContent.Start,
                                                        renderType: sap.m.FlexRendertype.Bare,
                                                        items: [
                                                            this.urlInput = new sap.extension.m.Input("", {
                                                                editable: false,
                                                                bindingValue: "{=${}.url()}",
                                                            }),
                                                            new sap.m.Button("", {
                                                                width: "auto",
                                                                icon: "sap-icon://copy",
                                                                press(): void {
                                                                    let target: any = document.getElementById(that.urlInput.getId() + "-inner");
                                                                    target.select(); // 选择文本
                                                                    document.execCommand("Copy"); // 执行浏览器复制命令
                                                                }
                                                            }).addStyleClass("sapUiTinyMarginBegin"),
                                                        ]
                                                    }),
                                                ]
                                            })
                                        ]
                                    }),
                                ]
                            })
                        ]
                    });
                    let formBottom: sap.ui.layout.form.SimpleForm = new sap.ui.layout.form.SimpleForm("", {
                        editable: true,
                        content: [
                            new sap.m.Toolbar("", { visible: false }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_document_dataowner") }),
                            new sap.extension.m.DataOwnerInput("", {
                                showValueHelp: true,
                                organization: {
                                    path: "organization",
                                    type: new sap.extension.data.Alphanumeric({
                                        maxLength: 8
                                    })
                                }
                            }).bindProperty("bindingValue", {
                                path: "dataOwner",
                                type: new sap.extension.data.Numeric()
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_document_teammembers") }),
                            new sap.extension.m.UserInput("", {
                                showValueHelp: true,
                                chooseType: ibas.emChooseType.MULTIPLE,
                            }).bindProperty("bindingValue", {
                                path: "teamMembers",
                                type: new sap.extension.data.Alphanumeric()
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_document_organization") }),
                            new sap.extension.m.DataOrganizationInput("", {
                                showValueHelp: true,
                            }).bindProperty("bindingValue", {
                                path: "organization",
                                type: new sap.extension.data.Alphanumeric({
                                    maxLength: 8
                                })
                            }),
                            new sap.m.Label("", { text: ibas.i18n.prop("bo_document_remarks") }),
                            new sap.extension.m.TextArea("", {
                                rows: 3
                            }).bindProperty("bindingValue", {
                                path: "remarks",
                                type: new sap.extension.data.Alphanumeric()
                            }),
                            new sap.m.Toolbar("", { visible: false }),
                        ]
                    });
                    return this.page = new sap.extension.m.DataPage("", {
                        showHeader: false,
                        dataInfo: {
                            code: bo.Document.BUSINESS_OBJECT_CODE,
                        },
                        subHeader: new sap.m.Toolbar("", {
                            content: [
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_save"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://save",
                                    press: function (): void {
                                        that.fireViewEvents(that.saveDataEvent);
                                    }
                                }),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_delete"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://delete",
                                    press: function (): void {
                                        that.fireViewEvents(that.deleteDataEvent);
                                    }
                                }),
                                new sap.m.ToolbarSeparator(""),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("documents_upload_document"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://upload",
                                    press: function (): void {
                                        ibas.files.open((files) => {
                                            that.fireViewEvents(that.uploadFileEvent, files[0]);
                                        }, { multiple: false });
                                    }
                                }),
                                new sap.m.ToolbarSpacer(""),
                                new sap.m.Button("", {
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://inspection",
                                    text: ibas.i18n.prop("documents_view_file"),
                                    press: function (): void {
                                        that.fireViewEvents(that.viewDataEvent);
                                    }
                                }),
                            ]
                        }),
                        content: [
                            formTop,
                            formMiddle,
                            formBottom,
                        ]
                    });
                }
                private page: sap.extension.m.Page;
                private urlInput: sap.extension.m.Input;

                /** 显示数据 */
                showDocument(data: bo.Document): void {
                    this.page.setModel(new sap.extension.model.JSONModel(data));
                    // 改变页面状态
                    sap.extension.pages.changeStatus(this.page);
                }
            }
        }

    }
}