/*
 * Copyright(c) RIB Software GmbH
 */

import { IInvHeaderEntityGenerated } from './inv-header-entity-generated.interface';

export interface IInvHeaderEntity extends IInvHeaderEntityGenerated {
	ContractTotalCo?: number;
	ContractTotalInvoice?: number;
	ContractTotalGrossCo?: number;
	ContractTotalInvoiceGross?: number;
	orderDateStatus?: number;
	CallOffMainContractFk?: number;
	CallOffMainContract?: string;
	CallOffMainContractDes?: string;
	PrcItemFk: number;
}
