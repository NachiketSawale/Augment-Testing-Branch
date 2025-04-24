/*
 * Copyright(c) RIB Software GmbH
 */

import { IDdTempIdsEntity } from './dd-temp-ids-entity.interface';
import { IDocument2BasClerkEntity } from './document-2bas-clerk-entity.interface';
import { IDocument2mdlObjectEntity } from './document-2mdl-object-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import { IDocumentBaseEntity } from '@libs/documents/interfaces';

export interface IDocumentEntityGenerated extends IEntityBase, IDocumentBaseEntity {
	/*
	 * ArchiveElementId
	 */
	ArchiveElementId?: string | null;

	/*
	 * Barcode
	 */
	Barcode?: string | null;

	/*
	 * BasCompanyFk
	 */
	BasCompanyFk?: number | null;

	/*
	 * BidHeaderFk
	 */
	BidHeaderFk?: number | null;

	/*
	 * BilHeaderFk
	 */
	BilHeaderFk?: number | null;

	/*
	 * BpdBusinessPartnerFk
	 */
	BpdBusinessPartnerFk?: number | null;

	/*
	 * BpdCertificateFk
	 */
	BpdCertificateFk?: number | null;

	/*
	 * BpdContactFk
	 */
	BpdContactFk?: number | null;

	/*
	 * BpdSubsidiaryFk
	 */
	BpdSubsidiaryFk?: number | null;

	/*
	 * CanDeleteStatus
	 */
	CanDeleteStatus?: boolean | null;

	/*
	 * CanWriteStatus
	 */
	CanWriteStatus?: boolean | null;

	/*
	 * Code
	 */
	Code?: string | null;

	/*
	 * CommentText
	 */
	CommentText?: string | null;

	/*
	 * ConHeaderFk
	 */
	ConHeaderFk?: number | null;

	/*
	 * DdTempIdsEntities
	 */
	DdTempIdsEntities?: IDdTempIdsEntity[] | null;

	/*
	 * Document2basClerkEntities
	 */
	Document2basClerkEntities?: IDocument2BasClerkEntity[] | null;

	/*
	 * Document2mdlObjectEntities
	 */
	Document2mdlObjectEntities?: IDocument2mdlObjectEntity[] | null;

	/*
	 * DocumentType
	 */
	DocumentType?: number | null;

	/*
	 * EstHeaderFk
	 */
	EstHeaderFk?: number | null;

	/*
	 * ExpirationDate
	 */
	ExpirationDate?: string | null;

	/*
	 * FileSize
	 */
	FileSize?: string | null;

	/*
	 * FileSizeInByte
	 */
	FileSizeInByte?: number | null;

	/*
	 * HasDocumentRevision
	 */
	HasDocumentRevision?: number | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * InvHeaderFk
	 */
	InvHeaderFk?: number | null;

	/*
	 * IsLockedType
	 */
	IsLockedType?: boolean | null;

	/*
	 * IsReadonly
	 */
	IsReadonly?: boolean | null;

	/*
	 * ItwoSiteId
	 */
	ItwoSiteId?: number | null;

	/*
	 * LgmDispatchHeaderFk
	 */
	LgmDispatchHeaderFk?: number | null;

	/*
	 * LgmJobFk
	 */
	LgmJobFk?: number | null;

	/*
	 * LgmSettlementFk
	 */
	LgmSettlementFk?: number | null;

	/*
	 * MdcControllingUnitFk
	 */
	MdcControllingUnitFk?: number | null;

	/*
	 * MdcMaterialCatalogFk
	 */
	MdcMaterialCatalogFk?: number | null;

	/*
	 * MdlObjectFk
	 */
	MdlObjectFk?: number | null;

	/*
	 * MntRequisitionFk
	 */
	MntRequisitionFk?: number | null;

	/*
	 * ModelFk
	 */
	ModelFk?: number | null;

	/*
	 * ObjUnitFk
	 */
	ObjUnitFk?: number | null;

	/*
	 * OrdHeaderFk
	 */
	OrdHeaderFk?: number | null;

	/*
	 * Origin
	 */
	Origin?: string | null;

	/*
	 * PermissionObjectInfo
	 */
	PermissionObjectInfo?: string | null;

	/*
	 * PesHeaderFk
	 */
	PesHeaderFk?: number | null;

	/*
	 * PpsHeaderFk
	 */
	PpsHeaderFk?: number | null;

	/*
	 * PpsItemFk
	 */
	PpsItemFk?: number | null;

	/*
	 * PpsProductFk
	 */
	PpsProductFk?: number | null;

	/*
	 * PpsUpstreamItemFk
	 */
	PpsUpstreamItemFk?: number | null;

	/*
	 * PrcPackageFk
	 */
	PrcPackageFk?: number | null;

	/*
	 * PrcStructureFk
	 */
	PrcStructureFk?: number | null;

	/*
	 * PreviewModelFk
	 */
	PreviewModelFk?: number | null;

	/*
	 * PrjChangeFk
	 */
	PrjChangeFk?: number | null;

	/*
	 * PrjDocumentCategoryFk
	 */
	PrjDocumentCategoryFk?: number | null;

	/*
	 * PrjDocumentFk
	 */
	PrjDocumentFk?: number | null;

	/*
	 * PrjDocumentStatusFk
	 */
	PrjDocumentStatusFk?: number | null;

	/*
	 * PrjDocumentTypeFk
	 */
	PrjDocumentTypeFk?: number | null;

	/*
	 * PrjLocationFk
	 */
	PrjLocationFk?: number | null;

	/*
	 * PrjProjectFk
	 */
	PrjProjectFk?: number | null;

	/*
	 * ProjectInfoRequestFk
	 */
	ProjectInfoRequestFk?: number | null;

	/*
	 * PsdActivityFk
	 */
	PsdActivityFk?: number | null;

	/*
	 * PsdScheduleFk
	 */
	PsdScheduleFk?: number | null;

	/*
	 * QtnHeaderFk
	 */
	QtnHeaderFk?: number | null;

	/*
	 * QtoHeaderFk
	 */
	QtoHeaderFk?: number | null;

	/*
	 * ReqHeaderFk
	 */
	ReqHeaderFk?: number | null;

	/*
	 * Revision
	 */
	Revision?: number | null;

	/*
	 * RfqHeaderFk
	 */
	RfqHeaderFk?: number | null;

	/*
	 * RubricCategoryFk
	 */
	RubricCategoryFk?: number | null;

	/*
	 * TrsRouteFk
	 */
	TrsRouteFk?: number | null;

	/*
	 * Url
	 */
	Url?: string | null;

	/*
	 * UserDefined1
	 */
	UserDefined1?: string | null;

	/*
	 * UserDefined2
	 */
	UserDefined2?: string | null;

	/*
	 * UserDefined3
	 */
	UserDefined3?: string | null;

	/*
	 * UserDefined4
	 */
	UserDefined4?: string | null;

	/*
	 * UserDefined5
	 */
	UserDefined5?: string | null;

	/*
	 * WipHeaderFk
	 */
	WipHeaderFk?: number | null;
}
