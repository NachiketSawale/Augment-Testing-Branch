/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsSharedPostConHistoryEntity extends IEntityBase,IEntityIdentification{
	PrjDocumentFk:number,
	PrcCommunicationChannelFk:number,
	ProjectNo?:string,
	ProjectName?:string,
	PrjProjectFk?:number|null,
	BusinessPartnerName1?:string,
	DocumentTypeFk?:number|null,
	PrjDocumentTypeFk?:number|null,
	PrjDocumentDescription?:string|null,
	FileArchiveDocFk?:number|null,
	OriginFileName?:string|null,
}