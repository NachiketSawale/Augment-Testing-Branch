/*
 * Copyright(c) RIB Software GmbH
 */

import { IProjectMainCurrencyRateEntity } from '@libs/project/interfaces';

export class SetProjectCurrencyRate {
	public CurrencyHomeFk: number;
	public CurrencyForeignFk: number;
	public CurrencyRateTypeFk: number;

	public constructor(currency: IProjectMainCurrencyRateEntity) {
		this.CurrencyHomeFk = currency.CurrencyHomeFk;
		this.CurrencyForeignFk = currency.CurrencyForeignFk;
		this.CurrencyRateTypeFk = currency.CurrencyRateTypeFk;
	}
}
