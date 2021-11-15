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
        export class BORepositoryDocuments extends ibas.BORepositoryApplication implements IBORepositoryDocuments {
            /** 创建此模块的后端与前端数据的转换者 */
            protected createConverter(): ibas.IDataConverter {
                return new DataConverter;
            }
            /**
             * 获取地址
             */
            toUrl(document: bo.IDocument | string): string {
                if (!this.address.endsWith("/")) { this.address += "/"; }
                let url: string = this.address.replace("/services/rest/data/", "/services/rest/file/");
                url += ibas.strings.format("{0}?token={1}", document instanceof Document ? document.sign : document, this.token);
                return encodeURI(url);
            }
            /**
             * 上传文档
             * @param caller 调用者
             */
            upload(caller: IUploadFileCaller): void {
                if (!this.address.endsWith("/")) { this.address += "/"; }
                let fileRepository: ibas.FileRepositoryUploadAjax = new ibas.FileRepositoryUploadAjax();
                fileRepository.address = this.address.replace("/services/rest/data/", "/services/rest/file/");
                fileRepository.token = this.token;
                fileRepository.converter = this.createConverter();
                let formData: FormData = new FormData();
                if (!ibas.strings.isEmpty(caller.boKeys)) {
                    formData.append("bokeys", caller.boKeys);
                }
                if (!ibas.strings.isEmpty(caller.version)) {
                    formData.append("version", caller.version);
                }
                if (!ibas.strings.isEmpty(caller.tags)) {
                    formData.append("tags", caller.tags);
                }
                if (caller.file instanceof File) {
                    formData.append("file", caller.file, encodeURI(caller.file.name));
                }
                fileRepository.upload("upload", {
                    fileData: formData,
                    onCompleted: this.urlCompleted(caller).onCompleted,
                });
            }
            /**
             * 下载文档
             * @param caller 调用者
             */
            download(caller: IDownloadFileCaller): void {
                if (!this.address.endsWith("/")) { this.address += "/"; }
                let fileRepository: ibas.FileRepositoryDownloadAjax = new ibas.FileRepositoryDownloadAjax();
                fileRepository.address = this.address.replace("/services/rest/data/", "/services/rest/file/");
                fileRepository.token = this.token;
                fileRepository.converter = this.createConverter();
                fileRepository.download("download", caller);
            }
            /**
             * 查询 文档
             * @param fetcher 查询者
             */
            fetchDocument(fetcher: ibas.IFetchCaller<bo.IDocument>): void {
                super.fetch(bo.Document.name, this.urlCompleted(fetcher));
            }
            /**
             * 保存 文档
             * @param saver 保存者
             */
            saveDocument(saver: ibas.ISaveCaller<bo.IDocument>): void {
                super.save(bo.Document.name, this.urlCompleted(saver));
            }
            private urlCompleted<T extends ibas.IMethodCaller<any>>(caller: T): T {
                let onCompleted: (opRslt: ibas.IOperationResult<any>) => void = caller.onCompleted;
                caller.onCompleted = (opRslt: ibas.IOperationResult<any>) => {
                    for (let item of opRslt.resultObjects) {
                        if (item instanceof Document) {
                            item.url = () => {
                                if (ibas.strings.isEmpty(item.sign)) {
                                    return "";
                                }
                                return this.toUrl(item.sign);
                            };
                        }
                    }
                    if (onCompleted instanceof Function) {
                        onCompleted(opRslt);
                    }
                };
                return caller;
            }

        }
    }
}