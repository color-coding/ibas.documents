package org.colorcoding.ibas.documents.repository;

import org.colorcoding.ibas.bobas.common.*;
import org.colorcoding.ibas.bobas.ownership.*;
import org.colorcoding.ibas.bobas.repository.*;
import org.colorcoding.ibas.documents.bo.document.*;

/**
* Documents仓库
*/
@PermissionGroup("Documents")
public class BORepositoryDocuments extends BORepositoryServiceApplication implements IBORepositoryDocumentsSvc, IBORepositoryDocumentsApp {

    //--------------------------------------------------------------------------------------------//
    /**
     * 查询-文档
     * @param criteria 查询
     * @param token 口令
     * @return 操作结果
     */
    public OperationResult<Document> fetchDocument(ICriteria criteria, String token) {
        return super.fetch(criteria, token, Document.class);
    }

    /**
     * 查询-文档（提前设置用户口令）
     * @param criteria 查询
     * @return 操作结果
     */
    public IOperationResult<IDocument> fetchDocument(ICriteria criteria) {
        return new OperationResult<IDocument>(this.fetchDocument(criteria, this.getUserToken()));
    }

    /**
     * 保存-文档
     * @param bo 对象实例
     * @param token 口令
     * @return 操作结果
     */
    public OperationResult<Document> saveDocument(Document bo, String token) {
        return super.save(bo, token);
    }

    /**
     * 保存-文档（提前设置用户口令）
     * @param bo 对象实例
     * @return 操作结果
     */
    public IOperationResult<IDocument> saveDocument(IDocument bo) {
        return new OperationResult<IDocument>(this.saveDocument((Document) bo, this.getUserToken()));
    }

    //--------------------------------------------------------------------------------------------//

}
