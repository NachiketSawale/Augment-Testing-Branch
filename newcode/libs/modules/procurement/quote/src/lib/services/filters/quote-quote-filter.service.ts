/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupContext, ILookupServerSideFilter, ServerSideFilterValueType } from '@libs/ui/common';
import { IQuoteHeaderLookUpEntity } from '@libs/procurement/shared';
import { IQuoteHeaderEntity } from '../../model/entities/quote-header-entity.interface';

/**
 * Represents the Quote lookup filter binding to the context IQuoteHeaderEntity.
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementQuoteQuoteFilterService implements ILookupServerSideFilter<IQuoteHeaderLookUpEntity, IQuoteHeaderEntity> {
	/**
	 * Key
	 */
	public key: string = 'procurement-quote-qtn-header-filter';

	/**
	 * Executor
	 * @param context
	 */
	public execute(context: ILookupContext<IQuoteHeaderLookUpEntity, IQuoteHeaderEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
		return {
			QtnHeaderFk: null,
			CompanyFk: context.entity?.CompanyFk
		};
	}
}
