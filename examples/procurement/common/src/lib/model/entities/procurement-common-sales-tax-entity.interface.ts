/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IProcurementCommonSalesTaxEntity extends IEntityBase, IEntityIdentification {
	InvHeaderFk: number;
	MdcSalesTaxGroupFk: number;
	PrcStructureFk?: number;
	Amount?: number;
	AmountOc?: number;
	AmountNet?: number;
	AmountNetOc?: number;
	AmountTax?: number;
	AmountTaxOc?: number;
	TaxPercent: number;
}