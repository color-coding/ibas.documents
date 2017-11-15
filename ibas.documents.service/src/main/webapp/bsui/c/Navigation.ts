/**
 * @license
 * Copyright color-coding studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ibas from "ibas/index";
import * as documentApps from "../../bsapp/document/index";
import * as documentViews from "./document/index";

/**
 * 视图导航
 */
export default class Navigation extends ibas.ViewNavigation {

    /**
     * 创建实例
     * @param id 应用id
     */
    protected newView(id: string): ibas.IView {
        let view: ibas.IView = null;
        switch (id) {
            case documentApps.DocumentListApp.APPLICATION_ID:
                view = new documentViews.DocumentListView();
                break;
            case documentApps.DocumentChooseApp.APPLICATION_ID:
                view = new documentViews.DocumentChooseView();
                break;
            case documentApps.DocumentViewApp.APPLICATION_ID:
                view = new documentViews.DocumentViewView();
                break;
            case documentApps.DocumentEditApp.APPLICATION_ID:
                view = new documentViews.DocumentEditView();
                break;
            case documentApps.BODocumentService.APPLICATION_ID:
                view = new documentViews.BODocumentServiceView();
                break;
            default:
                break;
        }
        return view;
    }
}
