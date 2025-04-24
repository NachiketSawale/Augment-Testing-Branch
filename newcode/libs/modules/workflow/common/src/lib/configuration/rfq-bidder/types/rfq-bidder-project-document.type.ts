/*
 * Copyright(c) RIB Software GmbH
 */

import { Included } from './generic-wizard-included.type';

export type RfqBidderProjectDocument = {
	Id: number,
	DocumentDescription: string,
	DocumentOriginalFileName: string,
	DocumentStatus: string,
	DocumentStatusFk: number,
	DocumentType: string,
	ArchiveElementId?: number,
	ClerkDocType?: string,
	DocId: number,
	FileArchiveDocFk: number,
	PrcDocType?: string,
	PrcStructureCode?: number,
	PrcStructureDescription?:string,
	PrjDocType: string,
	Rubric: number,
	Url?: string
} & Included;