/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace documents {
    export namespace bo {
        /** 文档 */
        export interface IDocument extends ibas.IBOSimple, ibas.IBOUserFields {

            /** 编号 */
            objectKey: number;

            /** 类型 */
            objectCode: string;

            /** 实例号（版本） */
            logInst: number;

            /** 编号系列 */
            series: number;

            /** 数据源 */
            dataSource: string;

            /** 创建日期 */
            createDate: Date;

            /** 创建时间 */
            createTime: number;

            /** 修改日期 */
            updateDate: Date;

            /** 修改时间 */
            updateTime: number;

            /** 创建用户 */
            createUserSign: number;

            /** 修改用户 */
            updateUserSign: number;

            /** 创建动作标识 */
            createActionId: string;

            /** 更新动作标识 */
            updateActionId: string;

            /** 数据所有者 */
            dataOwner: number;

            /** 团队成员 */
            teamMembers: string;

            /** 数据所属组织 */
            organization: string;

            /** 审批状态 */
            approvalStatus: ibas.emApprovalStatus;

            /** 已激活的 */
            activated: ibas.emYesNo;

            /** 标识 */
            sign: string;

            /** 名称 */
            name: string;

            /** 版本 */
            version: string;

            /** 标签 */
            tags: string;

            /** 业务对象标识 */
            boKeys: string;

            /** 参考1 */
            reference1: string;

            /** 参考2 */
            reference2: string;

            /** 备注 */
            remarks: string;

            /** 地址 */
            url(): string;
        }
    }

}


