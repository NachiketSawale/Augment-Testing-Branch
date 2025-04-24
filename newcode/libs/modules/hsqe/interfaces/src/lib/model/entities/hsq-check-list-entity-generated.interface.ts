/*
 * Copyright(c) RIB Software GmbH
 */

import { IDdTempIdsEntity } from './dd-temp-ids-entity.interface';
import { IHsqCheckList2FormEntity } from './hsq-check-list-2-form-entity.interface';
import { IHsqCheckList2MdlObectEntity } from './hsq-check-list-2-mdl-obect-entity.interface';
import { IHsqCheckListEntity } from './hsq-check-list-entity.interface';
import { IHsqCheckListCommentEntity } from './hsq-check-list-comment-entity.interface';
import { IHsqCheckListTypeEntity } from './hsq-check-list-type-entity.interface';
import { IHsqCheckList2ActivityEntity } from './hsq-check-list-2-activity-entity.interface';
import { IHsqCheckListDocumentEntity } from './hsq-check-list-document-entity.interface';
import { IHsqCheckList2LocationEntity } from './hsq-check-list-2-location-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
import { IBasicsCustomizeHsqeChecklistStatusEntity } from '@libs/basics/interfaces';

export interface IHsqCheckListEntityGenerated extends IEntityBase {
	/**
	 * BasClerkChkFk
	 */
	BasClerkChkFk?: number | null;

	/**
	 * BasClerkHsqFk
	 */
	BasClerkHsqFk?: number | null;

	/**
	 * BasCompanyFk
	 */
	BasCompanyFk: number;

	/**
	 * BpdBusinesspartnerFk
	 */
	BpdBusinesspartnerFk?: number | null;

	/**
	 * BpdContactFk
	 */
	BpdContactFk?: number | null;

	/**
	 * BpdSubsidiaryFk
	 */
	BpdSubsidiaryFk?: number | null;

	/**
	 * CheckListGroupFk
	 */
	CheckListGroupFk?: number | null;

	/**
	 * Code
	 */
	Code: string;

	/**
	 * ConHeaderFk
	 */
	ConHeaderFk?: number | null;

	/**
	 * DatePerformed
	 */
	DatePerformed?: string | null;

	/**
	 * DateReceived
	 */
	DateReceived?: string | null;

	/**
	 * DateRequired
	 */
	DateRequired?: string | null;

	/**
	 * DdTempIdsEntities
	 */
	DdTempIdsEntities?: IDdTempIdsEntity[] | null;

	/**
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/**
	 * EtmPlantFk
	 */
	EtmPlantFk?: number | null;

	/**
	 * HasChildren
	 */
	HasChildren: boolean;

	/**
	 * HsqCheckList2FormEntities
	 */
	HsqCheckList2FormEntities?: IHsqCheckList2FormEntity[] | null;

	/**
	 * HsqCheckList2MdlObectEntities
	 */
	HsqCheckList2MdlObectEntities?: IHsqCheckList2MdlObectEntity[] | null;

	/**
	 * HsqCheckListChildren
	 */
	HsqCheckListChildren?: IHsqCheckListEntity[] | null;

	/**
	 * HsqCheckListCommentEntities
	 */
	HsqCheckListCommentEntities?: IHsqCheckListCommentEntity[] | null;

	/**
	 * HsqCheckListFk
	 */
	HsqCheckListFk?: number | null;

	/**
	 * HsqCheckListParent
	 */
	HsqCheckListParent?: IHsqCheckListEntity | null;

	/**
	 * HsqCheckListTemplateFk
	 */
	HsqCheckListTemplateFk?: number | null;

	/**
	 * HsqCheckListTypeEntity
	 */
	HsqCheckListTypeEntity?: IHsqCheckListTypeEntity | null;

	/**
	 * HsqChecklist2activityEntities
	 */
	HsqChecklist2activityEntities?: IHsqCheckList2ActivityEntity[] | null;

	/**
	 * HsqChecklist2documentEntities
	 */
	HsqChecklist2documentEntities?: IHsqCheckListDocumentEntity[] | null;

	/**
	 * HsqChecklist2locationEntities
	 */
	HsqChecklist2locationEntities?: IHsqCheckList2LocationEntity[] | null;

	/**
	 * HsqChkListTypeFk
	 */
	HsqChkListTypeFk: number;

	/**
	 * HsqChlStatusEntity
	 */
	HsqChlStatusEntity?: IBasicsCustomizeHsqeChecklistStatusEntity | null;

	/**
	 * HsqChlStatusFk
	 */
	HsqChlStatusFk: number;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * IsSameContextProjectsByCompany
	 */
	IsSameContextProjectsByCompany: boolean;

	/**
	 * IsSearchItem
	 */
	IsSearchItem: boolean;

	/**
	 * PermissionObjectInfo
	 */
	PermissionObjectInfo?: string | null;

	/**
	 * PesHeaderFk
	 */
	PesHeaderFk?: number | null;

	/**
	 * PrcStructureFk
	 */
	PrcStructureFk?: number | null;

	/**
	 * PrjProjectFk
	 */
	PrjProjectFk?: number | null;

	/**
	 * UserDefined1
	 */
	UserDefined1?: string | null;

	/**
	 * UserDefined2
	 */
	UserDefined2?: string | null;

	/**
	 * UserDefined3
	 */
	UserDefined3?: string | null;

	/**
	 * UserDefined4
	 */
	UserDefined4?: string | null;

	/**
	 * UserDefined5
	 */
	UserDefined5?: string | null;
}
