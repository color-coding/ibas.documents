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
            toUrl(document: bo.IDocument | string): string;
            /**
             * 上传文档
             * @param caller 调用者
             */
            upload(caller: IUploadFileCaller): void;
            /**
             * 文件下载
             * @param caller 调用者
             */
            download(caller: IDownloadFileCaller): void;
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
        /**
         * 上传文件调用者
         */
        export interface IUploadFileCaller extends ibas.IMethodCaller<IDocument> {
            /** 业务对象键值 */
            boKeys?: string;
            /** 版本 */
            version?: string;
            /** 标签 */
            tags?: string;
            /** 文件数据 */
            file: File;
        }
        /**
         * 下载文件调用者
         */
        export interface IDownloadFileCaller extends ibas.IDownloadFileCaller<Blob> {

        }
    }
}
