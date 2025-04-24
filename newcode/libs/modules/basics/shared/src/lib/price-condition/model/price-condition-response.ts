/*
 * Copyright(c) RIB Software GmbH
 */

import { IMaterialPriceConditionEntity } from '@libs/basics/interfaces';

/**
 * price condition response model
 */
export class BasicsSharedPriceConditionResponse {
	/**
	 * price conditions
	 */
	public PriceConditions: IMaterialPriceConditionEntity[] = [];

	/**
	 * Is Success
	 */
	public IsSuccess: boolean = false;
	/**
	 * Vat Percent
	 */
	public VatPercent: number=0;

	/**
	 * Field model
	 */
	public Field: string = '';
}
