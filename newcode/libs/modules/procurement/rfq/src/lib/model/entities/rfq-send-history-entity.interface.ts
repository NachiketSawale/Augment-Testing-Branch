/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';


export interface IRfqSendHistoryEntity extends IEntityBase, IEntityIdentification {
	PrjDocumentFk: number;
	PrcCommunicationChannelFk: number;
	RfqStatusFk: number;
	RfqBpStatusPreFk: number;
	RfqBpStatusPostFk: number;
	Protocol?: string;
	RfqHeaderFk?: number;
	BusinesspartnerFk?: number;
	ContactFk?: number;
	Recipient?: string;
	Subject?: string;
	DateSent?: string;
	EmailLink?: string;
	Sender?: string;
	RfqCode?: string;
	RfqDescription?: string;
	BusinessPartnerName1?: string;
	DocumentTypeFk?: number;
	PrjDocumentDescription?: string;
	FileArchiveDocFk?: number;
	OriginFileName?: string;
}