package org.colorcoding.ibas.documents.repository;

import org.colorcoding.ibas.bobas.common.*;
import org.colorcoding.ibas.bobas.repository.*;
import org.colorcoding.ibas.documents.bo.document.*;

/**
* Documents仓库服务
*/
public interface IBORepositoryDocumentsSvc extends IBORepositorySmartService {


    //--------------------------------------------------------------------------------------------//
    /**
     * 查询-文档
     * @param criteria 查询
     * @param token 口令
     * @return 操作结果
     */
    OperationResult<Document> fetchDocument(ICriteria criteria, String token);

    /**
     * 保存-文档
     * @param bo 对象实例
     * @param token 口令
     * @return 操作结果
     */
    OperationResult<Document> saveDocument(Document bo, String token);

    //--------------------------------------------------------------------------------------------//

}
