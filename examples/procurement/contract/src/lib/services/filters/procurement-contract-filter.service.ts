/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupContext, ILookupServerSideFilter, ServerSideFilterValueType } from '@libs/ui/common';
import { IConHeaderEntity } from '../../model/entities';
import { IContactLookupEntity } from '@libs/businesspartner/interfaces';

/**
 *
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementContractFilterService implements ILookupServerSideFilter<IContactLookupEntity, IConHeaderEntity> {
	/**
	 * Key
	 */
	public key: string = 'prc-con-contact-filter';

	/**
	 * Executor
	 * @param context
	 */
	public execute(context: ILookupContext<IContactLookupEntity, IConHeaderEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
		return {
			BusinessPartnerFk: context.entity?.BusinessPartnerFk,
			SupplierFk: context.entity?.SupplierFk
		};
	}
}
