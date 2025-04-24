/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupContext, ILookupServerSideFilter, ServerSideFilterValueType } from '@libs/ui/common';
import { IRfqBusinessPartnerEntity } from '../../model/entities/rfq-businesspartner-entity.interface';
import { IBusinessPartnerSearchMainEntity } from '@libs/businesspartner/interfaces';

/**
 * Represents the business partner lookup filter binding to the context IRfqBusinessPartnerEntity.
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementRfqBusinesspartnerBusinesspartnerFilterService implements ILookupServerSideFilter<IBusinessPartnerSearchMainEntity, IRfqBusinessPartnerEntity> {
	/**
	 * Key
	 */
	public key: string = 'procurement-rfq-businesspartner-businesspartner-filter';

	/**
	 * Executor
	 * @param context
	 */
	public execute(context: ILookupContext<IBusinessPartnerSearchMainEntity, IRfqBusinessPartnerEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
		const filter: { IsLive: boolean, RfqHeaderFk?: number } = {
			IsLive: true
		};
		if (context.entity?.RfqHeaderFk) {
			filter.RfqHeaderFk = context.entity.RfqHeaderFk;
		}
		return filter;
	}
}