/*
 * Copyright(c) RIB Software GmbH
 */

import { CommunicationType } from '../../enum';

export interface ISendEmailOrFaxDialogModel {
	CommunicationType: CommunicationType;
	BatchId: string,
	CompanyId: number | undefined,
	RecipientList: IRecipient[];
	Username: string,
	Password: string | null,
	SendIsDisabled: boolean,
	IsLoading: boolean,
}

export interface IRecipient {
	IsCheckToSend: boolean,
	Id: number,
	BpId?: number,
	BusinessPartnerId?: number,
	BusinessPartnerName1: string | null,
	BatchId: string | null,
	Email: string | null;
	Telefax: string | null;
}
