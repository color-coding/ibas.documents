/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace documents {
    export namespace bo {
        /** Documents 业务仓库 */
        export interface IBORepositoryDocuments extends ibas.IBORepositoryApplication {

            /**
             * 获取地址
             */
            toUrl(document: bo.IDocument): string;
            /**
             * 上传文档
             * @param caller 调用者
             */
            upload(caller: ibas.IUploadFileCaller<ibas.FileData>): void;
            /**
             * 文件下载
             * @param caller 调用者
             */
            download(caller: ibas.IDownloadFileCaller<Blob>): void;
            /**
             * 查询 文档
             * @param fetcher 查询者
             */
            fetchDocument(fetcher: ibas.IFetchCaller<bo.IDocument>): void;
            /**
             * 保存 文档
             * @param saver 保存者
             */
            saveDocument(saver: ibas.ISaveCaller<bo.IDocument>): void;

        }
    }
}
