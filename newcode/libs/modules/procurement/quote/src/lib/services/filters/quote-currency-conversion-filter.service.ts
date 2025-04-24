/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupContext, ILookupServerSideFilter, ServerSideFilterValueType } from '@libs/ui/common';
import { CurrencyEntity } from '@libs/basics/shared';
import { IQuoteHeaderEntity } from '../../model/entities/quote-header-entity.interface';

/**
 * Represents the Currency lookup filter binding to the context IQuoteHeaderEntity.
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementQuoteCurrencyConversionFilterService implements ILookupServerSideFilter<CurrencyEntity, IQuoteHeaderEntity> {
	/**
	 * Key
	 */
	public key: string = 'bas-currency-conversion-filter';

	/**
	 * Executor
	 * @param context
	 */
	public execute(context: ILookupContext<CurrencyEntity, IQuoteHeaderEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
		return {
			companyFk: context.entity?.CompanyFk
		};
	}
}
