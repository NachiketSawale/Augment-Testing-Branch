/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IDfmDefectEntityGenerated extends IEntityBase {

	/*
	 * BasBlobsDetailFk
	 */
	BasBlobsDetailFk?: number | null;

	/*
	 * BasClerkFk
	 */
	BasClerkFk?: number | null;

	/*
	 * BasClerkRespFk
	 */
	BasClerkRespFk?: number | null;

	/*
	 * BasCompanyFk
	 */
	BasCompanyFk: number;

	/*
	 * BasCurrencyFk
	 */
	BasCurrencyFk: number;

	/*
	 * BasDefectPriorityFk
	 */
	BasDefectPriorityFk: number;

	/*
	 * BasDefectSeverityFk
	 */
	BasDefectSeverityFk: number;

	/*
	 * BasDefectTypeFk
	 */
	BasDefectTypeFk: number;

	/*
	 * BasWarrantyStatusFk
	 */
	BasWarrantyStatusFk?: number | null;

	/*
	 * BlobContent
	 */
	BlobContent?: string | null;

	/*
	 * BpdBusinesspartnerFk
	 */
	BpdBusinesspartnerFk?: number | null;

	/*
	 * BpdContactFk
	 */
	BpdContactFk?: number | null;

	/*
	 * BpdSubsidiaryFk
	 */
	BpdSubsidiaryFk?: number | null;

	/*
	 * ChangeFk
	 */
	ChangeFk?: number | null;

	/*
	 * Code
	 */
	Code: string;

	/*
	 * CommentCount
	 */
	CommentCount?: number | null;

	/*
	 * ConHeaderFk
	 */
	ConHeaderFk?: number | null;

	/*
	 * DateFinished
	 */
	DateFinished?: string | null;

	/*
	 * DateIssued
	 */
	DateIssued: string;

	/*
	 * DateRequired
	 */
	DateRequired?: string | null;

	/*
	 * Defect2ChangeTypeFk
	 */
	Defect2ChangeTypeFk: number;

	/*
	 * Description
	 */
	Description?: string | null;

	/*
	 * Detail
	 */
	Detail?: string | null;

	/*
	 * DfmChecklistEntities
	 */
	DfmChecklistEntities?: number[] | null;

	/*
	 * DfmDefect2basClerkEntities
	 */
	DfmDefect2basClerkEntities?: number[] | null;

	/*
	 * DfmDefect2inforequestEntities
	 */
	DfmDefect2inforequestEntities?: number[] | null;

	/*
	 * DfmDefectEntities_DfmDefectFk
	 */
	DfmDefectEntities_DfmDefectFk?: number[] | null;

	/*
	 * DfmDefectFk
	 */
	DfmDefectFk?: number | null;

	/*
	 * DfmGroupFk
	 */
	DfmGroupFk?: number | null;

	/*
	 * DfmPhotoEntities
	 */
	DfmPhotoEntities?: number[] | null;

	/*
	 * DfmRaisedbyFk
	 */
	DfmRaisedbyFk: number;

	/*
	 * DfmStatusFk
	 */
	DfmStatusFk: number;

	/*
	 * DfmStatushistoryEntities
	 */
	DfmStatushistoryEntities?: number[] | null;

	/*
	 * EstimateCost
	 */
	EstimateCost?: number | null;

	/*
	 * EstimateLaborHours
	 */
	EstimateLaborHours?: number | null;

	/*
	 * ExternalCode
	 */
	ExternalCode?: string | null;

	/*
	 * ExternalSourceTypeFk
	 */
	ExternalSourceTypeFk?: number | null;

	/*
	 * HasComment
	 */
	HasComment?: boolean | null;

	/*
	 * HasPicture
	 */
	HasPicture?: boolean | null;

	/*
	 * HsqChecklistFk
	 */
	HsqChecklistFk?: number | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * IsEditableByStatus
	 */
	IsEditableByStatus?: boolean | null;

	/*
	 * IsReadonlyStatus
	 */
	IsReadonlyStatus?: boolean | null;

	/*
	 * Isexternal
	 */
	Isexternal: boolean;

	/*
	 * MdcControllingunitFk
	 */
	MdcControllingunitFk?: number | null;

	/*
	 * MdlMarkerFk
	 */
	MdlMarkerFk?: number | null;

	/*
	 * MdlModelFk
	 */
	MdlModelFk?: number | null;

	/*
	 * MdlObjectsetFk
	 */
	MdlObjectsetFk?: number | null;

	/*
	 * ObjectSetKey
	 */
	ObjectSetKey?: string | null;

	/*
	 * OrdHeaderFk
	 */
	OrdHeaderFk?: number | null;

	/*
	 * PermissionObjectInfo
	 */
	PermissionObjectInfo?: string | null;

	/*
	 * PesHeaderFk
	 */
	PesHeaderFk?: number | null;

	/*
	 * PictureCount
	 */
	PictureCount?: number | null;

	/*
	 * PrcStructureFk
	 */
	PrcStructureFk?: number | null;

	/*
	 * PrjLocationFk
	 */
	PrjLocationFk?: number | null;

	/*
	 * PrjProjectFk
	 */
	PrjProjectFk: number;

	/*
	 * PsdActivityFk
	 */
	PsdActivityFk?: number | null;

	/*
	 * PsdScheduleFk
	 */
	PsdScheduleFk?: number | null;

	/*
	 * RubricCategoryFk
	 */
	RubricCategoryFk: number;

	/*
	 * Userdate1
	 */
	Userdate1?: string | null;

	/*
	 * Userdate2
	 */
	Userdate2?: string | null;

	/*
	 * Userdate3
	 */
	Userdate3?: string | null;

	/*
	 * Userdate4
	 */
	Userdate4?: string | null;

	/*
	 * Userdate5
	 */
	Userdate5?: string | null;

	/*
	 * Userdefined1
	 */
	Userdefined1?: string | null;

	/*
	 * Userdefined2
	 */
	Userdefined2?: string | null;

	/*
	 * Userdefined3
	 */
	Userdefined3?: string | null;

	/*
	 * Userdefined4
	 */
	Userdefined4?: string | null;

	/*
	 * Userdefined5
	 */
	Userdefined5?: string | null;
}
