package org.colorcoding.ibas.documents.service.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.OperationResult;
import org.colorcoding.ibas.documents.MyConfiguration;
import org.colorcoding.ibas.documents.bo.document.Document;
import org.colorcoding.ibas.documents.repository.BORepositoryDocuments;

/**
 * Documents 数据服务JSON
 */
@Path("data")
public class DataService extends BORepositoryDocuments {

	// --------------------------------------------------------------------------------------------//
	/**
	 * 查询-文档
	 * 
	 * @param criteria 查询
	 * @param token    口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("fetchDocument")
	public OperationResult<Document> fetchDocument(Criteria criteria,
			@HeaderParam("authorization") String authorization, @QueryParam("token") String token) {
		return super.fetchDocument(criteria, MyConfiguration.optToken(authorization, token));
	}

	/**
	 * 保存-文档
	 * 
	 * @param bo    对象实例
	 * @param token 口令
	 * @return 操作结果
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("saveDocument")
	public OperationResult<Document> saveDocument(Document bo, @HeaderParam("authorization") String authorization,
			@QueryParam("token") String token) {
		return super.saveDocument(bo, MyConfiguration.optToken(authorization, token));
	}

	// --------------------------------------------------------------------------------------------//

}
