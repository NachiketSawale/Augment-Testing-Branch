/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupContext, ILookupServerSideFilter, ServerSideFilterValueType } from '@libs/ui/common';
import { IRfqBusinessPartnerEntity } from '../../model/entities/rfq-businesspartner-entity.interface';
import { IContactLookupEntity } from '@libs/businesspartner/interfaces';

/**
 * Represents the lookup filter binding to the context IRfqBusinessPartnerEntity.
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementRfqBusinesspartnerContactFilterService implements ILookupServerSideFilter<IContactLookupEntity, IRfqBusinessPartnerEntity> {
	/**
	 * Key
	 */
	public key: string = 'procurement-rfq-businesspartner-contact-filter';

	/**
	 * Executor
	 * @param context
	 */
	public execute(context: ILookupContext<IContactLookupEntity, IRfqBusinessPartnerEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
		// TODO-DRIZZLE: The generic lookup filter should define another.
		// let genericWizardService = $injector.get('genericWizardService');
		// let genericWizardBusinessPartnerService = genericWizardService ? genericWizardService.getDataServiceByName('procurementRfqBusinessPartnerService') : null;
		// let currentItem = genericWizardBusinessPartnerService ? genericWizardBusinessPartnerService.getSelected() : null;

		return {
			BusinessPartnerFk: context.entity?.BusinessPartnerFk,
			SubsidiaryFk: context.entity?.SubsidiaryFk
		};
	}
}
