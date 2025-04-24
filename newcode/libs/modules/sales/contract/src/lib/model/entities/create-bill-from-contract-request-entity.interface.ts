/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ICreateBillFromContractRequestEntityGenerated extends IEntityBase {
	TypeFk : number;
	RubricCategoryFk : number;
	PreviousBillFk? :number;
	ConfigurationFk? : number;
	BillNo: string;
	Description: string;
	UseTransferContractQuantityOpt: boolean;
}