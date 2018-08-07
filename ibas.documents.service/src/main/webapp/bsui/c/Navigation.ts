/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
/// <reference path="../../3rdparty/ibas/index.d.ts" />
/// <reference path="../../3rdparty/openui5/index.d.ts" />
/// <reference path="../../index.d.ts" />
/// <reference path="./document/index.ts" />
namespace documents {
    export namespace ui {
        /**
         * 视图导航
         */
        export class Navigation extends ibas.ViewNavigation {

            /**
             * 创建实例
             * @param id 应用id
             */
            protected newView(id: string): ibas.IView {
                let view: ibas.IView = null;
                switch (id) {
                    case app.DocumentListApp.APPLICATION_ID:
                        view = new c.DocumentListView();
                        break;
                    case app.DocumentChooseApp.APPLICATION_ID:
                        view = new c.DocumentChooseView();
                        break;
                    case app.DocumentViewApp.APPLICATION_ID:
                        view = new c.DocumentViewView();
                        break;
                    case app.DocumentEditApp.APPLICATION_ID:
                        view = new c.DocumentEditView();
                        break;
                    case app.DocumentService.APPLICATION_ID:
                        view = new c.DocumentServiceView();
                        break;
                    default:
                        break;
                }
                return view;
            }
        }
    }
}