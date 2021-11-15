package org.colorcoding.ibas.documents.service.rest;

import java.io.File;
import java.io.OutputStream;
import java.net.URLDecoder;

import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.colorcoding.ibas.bobas.common.Criteria;
import org.colorcoding.ibas.bobas.common.ICondition;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.bobas.common.OperationResult;
import org.colorcoding.ibas.bobas.data.FileData;
import org.colorcoding.ibas.bobas.i18n.I18N;
import org.colorcoding.ibas.bobas.repository.FileRepository;
import org.colorcoding.ibas.bobas.repository.InvalidTokenException;
import org.colorcoding.ibas.bobas.repository.jersey.FileRepositoryService;
import org.colorcoding.ibas.documents.MyConfiguration;
import org.colorcoding.ibas.documents.bo.document.Document;
import org.colorcoding.ibas.documents.bo.document.IDocument;
import org.colorcoding.ibas.documents.repository.BORepositoryDocuments;
import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import org.glassfish.jersey.media.multipart.FormDataMultiPart;

@Path("file")
public class FileService extends FileRepositoryService {
	/**
	 * 工作目录
	 */
	public final static String WORK_FOLDER = MyConfiguration.getConfigValue(MyConfiguration.CONFIG_ITEM_DOCUMENT_FOLDER,
			MyConfiguration.getDataFolder() + File.separator + "documents_files");

	public FileService() {
		// 设置工作目录，资源目录下的报表目录
		this.getRepository().setRepositoryFolder(FileService.WORK_FOLDER);
	}

	@POST
	@Path("upload")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Produces(MediaType.APPLICATION_JSON)
	public OperationResult<Document> upload(FormDataMultiPart formData, @QueryParam("token") String token) {
		try {
			FormDataBodyPart bodyPart = formData.getField("file");
			if (bodyPart == null) {
				throw new Exception(I18N.prop("msg_dc_not_submit_file"));
			}
			BORepositoryDocuments boRepository = new BORepositoryDocuments();
			boRepository.setUserToken(token);
			IOperationResult<FileData> opRsltFile = this.save(bodyPart, token);
			if (opRsltFile.getError() != null) {
				throw opRsltFile.getError();
			}
			FileData fileData = opRsltFile.getResultObjects().firstOrDefault();
			if (fileData == null) {
				throw new Exception(I18N.prop("msg_dc_not_found_file",
						URLDecoder.decode(bodyPart.getContentDisposition().getFileName(), "UTF-8")));
			}
			Document document = new Document();
			document.setDataOwner(this.getCurrentUser().getId());
			document.setOrganization(this.getCurrentUser().getBelong());
			document.setName(fileData.getOriginalName());
			document.setSign(fileData.getFileName());
			bodyPart = formData.getField("tags");
			if (bodyPart != null) {
				document.setTags(bodyPart.getValue());
			}
			bodyPart = formData.getField("version");
			if (bodyPart != null) {
				document.setVersion(bodyPart.getValue());
			}
			bodyPart = formData.getField("bokeys");
			if (bodyPart != null) {
				document.setBOKeys(bodyPart.getValue());
			}
			return boRepository.saveDocument(document, token);
		} catch (Exception e) {
			return new OperationResult<>(e);
		}
	}

	@POST
	@Path("download")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	public void download(Criteria criteria, @QueryParam("token") String token, @Context HttpServletResponse response) {
		try {
			if (criteria == null || criteria.getConditions().isEmpty()) {
				throw new WebApplicationException(400);
			}
			if (criteria.getResultCount() <= 0) {
				criteria.setResultCount(1);
			}
			// 获取文件
			IOperationResult<FileData> operationResult = this.fetch(criteria, token);
			if (operationResult.getError() != null) {
				throw operationResult.getError();
			}
			FileData fileData = operationResult.getResultObjects().firstOrDefault();
			if (fileData == null) {
				throw new WebApplicationException(Response.Status.NOT_FOUND);
			}
			criteria = new Criteria();
			criteria.setResultCount(1);
			ICondition condition = criteria.getConditions().create();
			condition.setAlias(Document.PROPERTY_SIGN.getName());
			condition.setValue(fileData.getFileName());
			// 查询文档记录
			BORepositoryDocuments boRepository = new BORepositoryDocuments();
			boRepository.setUserToken(token);
			IDocument document = boRepository.fetchDocument(criteria).getResultObjects().firstOrDefault();
			if (document == null) {
				throw new WebApplicationException(Response.Status.NOT_FOUND);
			}
			// 设置文件名
			response.setHeader("Content-Disposition", String.format("attachment;filename=%s", document.getName()));
			// 设置内容类型
			response.setContentType(MediaType.APPLICATION_OCTET_STREAM);
			// 写入响应输出流
			OutputStream os = response.getOutputStream();
			os.write(fileData.getFileBytes());
			os.flush();
		} catch (InvalidTokenException e) {
			throw new WebApplicationException(Response.Status.UNAUTHORIZED);
		} catch (WebApplicationException e) {
			throw e;
		} catch (Exception e) {
			throw new WebApplicationException(e);
		}
	}

	@GET
	@Path("{resource}")
	public void resource(@PathParam("resource") String resource, @QueryParam("token") String token,
			@Context HttpServletResponse response) {
		try {
			Criteria criteria = new Criteria();
			criteria.setResultCount(1);
			ICondition condition = criteria.getConditions().create();
			condition.setAlias(Document.PROPERTY_SIGN.getName());
			condition.setValue(resource);
			// 查询文档记录
			BORepositoryDocuments boRepository = new BORepositoryDocuments();
			boRepository.setUserToken(token);
			IDocument document = boRepository.fetchDocument(criteria).getResultObjects().firstOrDefault();
			if (document == null) {
				throw new WebApplicationException(Response.Status.NOT_FOUND);
			}
			criteria = new Criteria();
			criteria.setResultCount(1);
			condition = criteria.getConditions().create();
			condition.setAlias(FileRepository.CRITERIA_CONDITION_ALIAS_FILE_NAME);
			condition.setValue(resource);
			// 获取文件
			IOperationResult<FileData> operationResult = this.fetch(criteria, token);
			if (operationResult.getError() != null) {
				throw operationResult.getError();
			}
			FileData fileData = operationResult.getResultObjects().firstOrDefault();
			if (fileData == null) {
				throw new WebApplicationException(Response.Status.NOT_FOUND);
			}
			// 设置内容类型
			response.setContentType(this.getContentType(fileData));
			// 写入响应输出流
			OutputStream os = response.getOutputStream();
			os.write(fileData.getFileBytes());
			os.flush();
		} catch (InvalidTokenException e) {
			throw new WebApplicationException(Response.Status.UNAUTHORIZED);
		} catch (WebApplicationException e) {
			throw e;
		} catch (Exception e) {
			throw new WebApplicationException(e);
		}
	}
}
