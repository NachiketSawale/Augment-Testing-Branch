/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCurrencyRateEntity extends IEntityIdentification {
	Id: number;
	DescriptionInfo: IDescriptionInfo;
	CurrencyRateTypeFk: number | null;
	CurrencyConversionFk: number | null;
	CurrencyHomeFk: number;
	CurrencyForeignFk: number;
	RateDate: Date;
	Rate: number;
	CommentText: string;
	Basis: number;
	InsertedAt: Date;
	InsertedBy: number;
	UpdatedAt?: Date | null;
	UpdatedBy?: number | null;
	Version: number;
}