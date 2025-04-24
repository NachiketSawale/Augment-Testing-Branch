/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

export interface IPrcStockTransactionTypeEntity extends IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	IsDelta: boolean;
	IsDefault: boolean;
	IsAllowedManual: boolean
}
