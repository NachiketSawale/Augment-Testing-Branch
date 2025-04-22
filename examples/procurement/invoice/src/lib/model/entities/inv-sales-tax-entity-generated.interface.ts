/*
 * Copyright(c) RIB Software GmbH
 */

import { IInvSalesTaxEntity } from './inv-sales-tax-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import { IMdcSalesTaxCodeEntity } from '@libs/basics/interfaces';

export interface IInvSalesTaxEntityGenerated extends IEntityBase {
	/*
	 * Amount
	 */
	Amount?: number | null;

	/*
	 * AmountNet
	 */
	AmountNet?: number | null;

	/*
	 * AmountNetOc
	 */
	AmountNetOc?: number | null;

	/*
	 * AmountOc
	 */
	AmountOc?: number | null;

	/*
	 * AmountTax
	 */
	AmountTax?: number | null;

	/*
	 * AmountTaxOc
	 */
	AmountTaxOc?: number | null;

	/*
	 * Code
	 */
	Code?: string | null;

	/*
	 * Description
	 */
	Description?: string | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * InvHeaderFk
	 */
	InvHeaderFk: number;

	/*
	 * MdcSalesTaxCodes
	 */
	MdcSalesTaxCodes?: IMdcSalesTaxCodeEntity[] | null;

	/*
	 * MdcSalesTaxGroupFk
	 */
	MdcSalesTaxGroupFk: number;

	/*
	 * PrcStructureFk
	 */
	PrcStructureFk?: number | null;

	/*
	 * SalesTaxCodes
	 */
	//SalesTaxCodes?: IISalesTaxCodeEntity[] | null;

	/*
	 * SalesTaxItems
	 */
	SalesTaxItems?: IInvSalesTaxEntity[] | null;

	/*
	 * TaxPercent
	 */
	TaxPercent: number;

	/*
	 * TaxPercentCalculation
	 */
	TaxPercentCalculation?: number | null;

	/*
	 * TempSalesTaxCodes
	 */
	TempSalesTaxCodes?: IMdcSalesTaxCodeEntity[] | null;
}
