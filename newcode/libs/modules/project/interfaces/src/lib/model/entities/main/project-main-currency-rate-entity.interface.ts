/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IProjectMainCurrencyRateEntity extends IEntityBase {

	Id: number;
	ProjectFk: number;
	CurrencyConversionFk: number;
	CurrencyRateTypeFk: number;
	CurrencyHomeFk: number;
	CurrencyForeignFk: number;
	RateDate: Date;
	Rate: number;
	Basis: number;
	Comment: string;
}