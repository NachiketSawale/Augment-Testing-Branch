/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeBillCategoryDefaultEntity extends IEntityBase, IEntityIdentification {
	RubricCategoryFk: number;
	VoucherTypeFk: number;
	InvoiceTypeFk: number;
}
