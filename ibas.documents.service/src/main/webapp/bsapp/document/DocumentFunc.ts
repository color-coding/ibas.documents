/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace documents {
    export namespace app {

        export class DocumentFunc extends ibas.ModuleFunction {

            /** 功能标识 */
            static FUNCTION_ID = "4522574b-2578-48bb-8134-fb26cd4fb0c9";
            /** 功能名称 */
            static FUNCTION_NAME = "documents_func_document";
            /** 构造函数 */
            constructor() {
                super();
                this.id = DocumentFunc.FUNCTION_ID;
                this.name = DocumentFunc.FUNCTION_NAME;
                this.description = ibas.i18n.prop(this.name);
            }
            /** 默认功能 */
            default(): ibas.IApplication<ibas.IView> {
                let app: DocumentListApp = new DocumentListApp();
                app.navigation = this.navigation;
                return app;
            }
        }
    }
}