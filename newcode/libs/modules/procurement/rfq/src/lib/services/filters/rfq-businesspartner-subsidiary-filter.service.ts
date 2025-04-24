/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupContext, ILookupServerSideFilter, ServerSideFilterValueType } from '@libs/ui/common';
import { IRfqBusinessPartnerEntity } from '../../model/entities/rfq-businesspartner-entity.interface';
import { ISubsidiaryLookupEntity } from '@libs/businesspartner/interfaces';

/**
 * Represents the Subsidiary lookup filter binding to the context IRfqBusinessPartnerEntity.
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementRfqBusinesspartnerSubsidiaryFilterService implements ILookupServerSideFilter<ISubsidiaryLookupEntity, IRfqBusinessPartnerEntity> {
	/**
	 * Key
	 */
	public key: string = 'procurement-rfq-businesspartner-subsidiary-filter';

	/**
	 * Executor
	 * @param context
	 */
	public execute(context: ILookupContext<ISubsidiaryLookupEntity, IRfqBusinessPartnerEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
		return {
			BusinessPartnerFk: context.entity?.BusinessPartnerFk,
			SupplierFk: context.entity?.SupplierFk
		};
	}
}
