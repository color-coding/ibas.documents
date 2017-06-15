package org.colorcoding.ibas.documents.test.bo;

import org.colorcoding.ibas.bobas.common.ICriteria;
import org.colorcoding.ibas.bobas.common.IOperationResult;
import org.colorcoding.ibas.documents.bo.document.Document;
import org.colorcoding.ibas.documents.repository.BORepositoryDocuments;
import org.colorcoding.ibas.documents.repository.IBORepositoryDocumentsApp;

import junit.framework.TestCase;

/**
 * 文档 测试
 * 
 */
public class testDocument extends TestCase {
	/**
	 * 获取连接口令
	 */
	String getToken() {
		return "";
	}

	/**
	 * 基本项目测试
	 * 
	 * @throws Exception
	 */
	public void testBasicItems() throws Exception {
		Document bo = new Document();
		// 测试属性赋值

		// 测试对象的保存和查询
		IOperationResult<?> operationResult = null;
		ICriteria criteria = null;
		IBORepositoryDocumentsApp boRepository = new BORepositoryDocuments();
		// 设置用户口令
		boRepository.setUserToken(this.getToken());

		// 测试保存
		operationResult = boRepository.saveDocument(bo);
		assertEquals(operationResult.getMessage(), operationResult.getResultCode(), 0);
		Document boSaved = (Document) operationResult.getResultObjects().firstOrDefault();

		// 测试查询
		criteria = boSaved.getCriteria();
		criteria.setResultCount(10);
		operationResult = boRepository.fetchDocument(criteria);
		assertEquals(operationResult.getMessage(), operationResult.getResultCode(), 0);

	}

}
