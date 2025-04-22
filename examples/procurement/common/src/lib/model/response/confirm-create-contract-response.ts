/*
 * Copyright(c) RIB Software GmbH
 */

import { IConHeaderEntity } from '@libs/procurement/interfaces';
import { IChangedItem } from '../interfaces/change-item.interface';

export interface IConfirmCreateContractResponse {
	contracts?: IConHeaderEntity[];
	changeItems?: IChangedItem[];
	validChangeOrderContracts?:IConHeaderEntity[]
}
