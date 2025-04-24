/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePrcStockTransactionTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	IsDefault: boolean;
	IsAllowedManual: boolean;
	IsReceipt: boolean;
	IsConsumed: boolean;
	IsProvision: boolean;
	IsReservation: boolean;
	Sorting: number;
	IsLive: boolean;
	Icon: number;
	IsDispatching: boolean;
	IsDelta: boolean;
	IsJournal: boolean;
}
