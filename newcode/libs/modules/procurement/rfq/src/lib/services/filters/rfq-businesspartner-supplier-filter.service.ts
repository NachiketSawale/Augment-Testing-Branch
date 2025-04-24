/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupContext, ILookupServerSideFilter, ServerSideFilterValueType } from '@libs/ui/common';
import { IRfqBusinessPartnerEntity } from '../../model/entities/rfq-businesspartner-entity.interface';
import { ISupplierLookupEntity } from '@libs/businesspartner/interfaces';

/**
 * Represents the Supplier lookup filter binding to the context IRfqBusinessPartnerEntity.
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementRfqBusinesspartnerSupplierFilterService implements ILookupServerSideFilter<ISupplierLookupEntity, IRfqBusinessPartnerEntity> {
	/**
	 * Key
	 */
	public key: string = 'procurement-rfq-businesspartner-supplier-filter';

	/**
	 * Executor
	 * @param context
	 */
	public execute(context: ILookupContext<ISupplierLookupEntity, IRfqBusinessPartnerEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
		return {
			BusinessPartnerFk: context.entity?.BusinessPartnerFk,
			SubsidiaryFk: context.entity?.SubsidiaryFk
		};
	}
}
