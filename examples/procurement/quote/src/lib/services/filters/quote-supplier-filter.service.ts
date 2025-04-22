/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupContext, ILookupServerSideFilter, ServerSideFilterValueType } from '@libs/ui/common';
import { IQuoteHeaderEntity } from '../../model/entities/quote-header-entity.interface';
import { ISupplierLookupEntity } from '@libs/businesspartner/interfaces';

/**
 * Represents the Supplier lookup filter binding to the context IQuoteHeaderEntity.
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementQuoteSupplierFilterService implements ILookupServerSideFilter<ISupplierLookupEntity, IQuoteHeaderEntity> {
	/**
	 * Key
	 */
	public key: string = 'procurement-quote-supplier-filter';

	/**
	 * Executor
	 * @param context
	 */
	public execute(context: ILookupContext<ISupplierLookupEntity, IQuoteHeaderEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
		return {
			BusinessPartnerFk: context.entity?.BusinessPartnerFk,
			SubsidiaryFk: context.entity?.SubsidiaryFk
		};
	}
}
