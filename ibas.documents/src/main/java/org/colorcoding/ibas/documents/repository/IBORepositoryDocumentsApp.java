package org.colorcoding.ibas.documents.repository;

import org.colorcoding.ibas.bobas.common.*;
import org.colorcoding.ibas.bobas.repository.*;
import org.colorcoding.ibas.documents.bo.document.*;

/**
* Documents仓库应用
*/
public interface IBORepositoryDocumentsApp extends IBORepositoryApplication {

    //--------------------------------------------------------------------------------------------//
    /**
     * 查询-文档
     * @param criteria 查询
     * @return 操作结果
     */
    IOperationResult<IDocument> fetchDocument(ICriteria criteria);

    /**
     * 保存-文档
     * @param bo 对象实例
     * @return 操作结果
     */
    IOperationResult<IDocument> saveDocument(IDocument bo);

    //--------------------------------------------------------------------------------------------//

}
