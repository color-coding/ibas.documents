/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/// <reference path="../../c/document/index.ts" />
namespace documents {
    export namespace ui {
        export namespace m {
            /**
             * 文档服务视图
             */
            export class DocumentServiceView extends c.DocumentServiceView {
                draw(): any {
                    let dialog: sap.m.Dialog = super.draw();
                    let toolbar: any = dialog.getSubHeader();
                    if (toolbar instanceof sap.m.Bar) {
                        (<any>toolbar.getContentRight()[0]).setWidth("8rem");
                        (<any>toolbar.getContentRight()[1]).setText(null);
                    }
                    return dialog;
                }
            }
        }
    }
}