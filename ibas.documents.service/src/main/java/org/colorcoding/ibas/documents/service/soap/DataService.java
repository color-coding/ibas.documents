package org.colorcoding.ibas.documents.service.soap;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;

import org.colorcoding.ibas.bobas.common.*;
import org.colorcoding.ibas.bobas.cxf.WebServicePath;
import org.colorcoding.ibas.documents.repository.*;
import org.colorcoding.ibas.documents.bo.document.*;

/**
* Documents 数据服务JSON
*/
@WebService
@WebServicePath("data")
public class DataService extends BORepositoryDocuments {

    //--------------------------------------------------------------------------------------------//
    /**
     * 查询-文档
     * @param criteria 查询
     * @param token 口令
     * @return 操作结果
     */
    @WebMethod
    public OperationResult<Document> fetchDocument(@WebParam(name = "criteria") Criteria criteria, @WebParam(name = "token") String token) {
        return super.fetchDocument(criteria, token);
    }

    /**
     * 保存-文档
     * @param bo 对象实例
     * @param token 口令
     * @return 操作结果
     */
    @WebMethod
    public OperationResult<Document> saveDocument(@WebParam(name = "bo") Document bo, @WebParam(name = "token") String token) {
        return super.saveDocument(bo, token);
    }

    //--------------------------------------------------------------------------------------------//

}
