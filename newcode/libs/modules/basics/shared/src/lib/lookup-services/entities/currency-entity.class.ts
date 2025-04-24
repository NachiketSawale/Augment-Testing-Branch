/*
 * Copyright(c) RIB Software GmbH
 */

import {IDescriptionInfo} from '@libs/platform/common';

/**
 * Currency entity
 */
export class CurrencyEntity {
	/**
	 * description info
	 */
	public DescriptionInfo!: IDescriptionInfo;

	/**
	 * constructor
	 * @param Id
	 * @param Currency
	 */
	public constructor(public Id: number, public Currency: string) {

	}
}