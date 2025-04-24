/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupContext, ILookupServerSideFilter, ServerSideFilterValueType } from '@libs/ui/common';
import { IQuoteHeaderEntity } from '../../model/entities/quote-header-entity.interface';
import { ISubsidiaryLookupEntity } from '@libs/businesspartner/interfaces';

/**
 * Represents the Subsidiary lookup filter binding to the context IQuoteHeaderEntity.
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementQuoteSubsidiaryFilterService implements ILookupServerSideFilter<ISubsidiaryLookupEntity, IQuoteHeaderEntity> {
	/**
	 * Key
	 */
	public key: string = 'procurement-quote-subsidiary-filter';

	/**
	 * Executor
	 * @param context
	 */
	public execute(context: ILookupContext<ISubsidiaryLookupEntity, IQuoteHeaderEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
		return {
			BusinessPartnerFk: context.entity?.BusinessPartnerFk,
			SupplierFk: context.entity?.SupplierFk
		};
	}
}
