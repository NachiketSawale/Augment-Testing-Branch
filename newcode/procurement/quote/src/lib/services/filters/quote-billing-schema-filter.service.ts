/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ILookupContext, ILookupServerSideFilter, ServerSideFilterValueType } from '@libs/ui/common';
import { BasicsSharedProcurementConfigurationLookupService } from '@libs/basics/shared';
import { IQuoteHeaderEntity } from '../../model/entities/quote-header-entity.interface';
import { IProcurementConfigurationToBillingSchemaLookupEntity } from '@libs/basics/interfaces';

/**
 * Represents the BillingSchema lookup filter binding to the context IQuoteHeaderEntity.
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementQuoteBillingSchemaFilterService implements ILookupServerSideFilter<IProcurementConfigurationToBillingSchemaLookupEntity, IQuoteHeaderEntity> {
	private readonly configuration = inject(BasicsSharedProcurementConfigurationLookupService);
	/**
	 * Key
	 */
	public key: string = 'prc-quote-billing-schema-filter';

	/**
	 * Executor
	 * @param context
	 */
	public execute(context: ILookupContext<IProcurementConfigurationToBillingSchemaLookupEntity, IQuoteHeaderEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
		return context.entity?.PrcConfigurationFk ? firstValueFrom(
			this.configuration.getItemByKey({
				id: context.entity.PrcConfigurationFk
			})
		).then(item => {
			return `PrcConfigHeaderFk= + ${item ? item.PrcConfigHeaderFk : -1}`;
		}) : '';
	}
}
