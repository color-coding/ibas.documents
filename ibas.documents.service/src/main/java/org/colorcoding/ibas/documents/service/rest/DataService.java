package org.colorcoding.ibas.documents.service.rest;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

import org.colorcoding.ibas.bobas.common.*;
import org.colorcoding.ibas.documents.repository.*;
import org.colorcoding.ibas.documents.bo.document.*;

/**
* Documents 数据服务JSON
*/
@Path("data")
public class DataService extends BORepositoryDocuments {

    //--------------------------------------------------------------------------------------------//
    /**
     * 查询-文档
     * @param criteria 查询
     * @param token 口令
     * @return 操作结果
     */
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("fetchDocument")
    public OperationResult<Document> fetchDocument(Criteria criteria, @QueryParam("token") String token) {
        return super.fetchDocument(criteria, token);
    }

    /**
     * 保存-文档
     * @param bo 对象实例
     * @param token 口令
     * @return 操作结果
     */
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("saveDocument")
    public OperationResult<Document> saveDocument(Document bo, @QueryParam("token") String token) {
        return super.saveDocument(bo, token);
    }

    //--------------------------------------------------------------------------------------------//

}
