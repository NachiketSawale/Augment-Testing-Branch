/*
 * Copyright(c) RIB Software GmbH
 */
export interface IPrcRfqEmailFaxRecipient {
	Id: number;
	BusinessPartnerName1: string;
	BusinessPartnerId: number;
	FirstName: string;
	LastName: string;
	To: string;
	Cc: string;
	IsTo: boolean;
	IsCc: boolean;
	ContactRemarks?: string |null;
}
