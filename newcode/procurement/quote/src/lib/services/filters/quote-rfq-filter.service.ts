/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ILookupContext, ILookupServerSideFilter, ServerSideFilterValueType } from '@libs/ui/common';
import { IRfqLookupEntity } from '@libs/procurement/shared';
import { IQuoteHeaderEntity } from '../../model/entities/quote-header-entity.interface';
import { PlatformConfigurationService } from '@libs/platform/common';

/**
 * Represents the RfQ lookup filter binding to the context IQuoteHeaderEntity.
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementQuoteRfQFilterService implements ILookupServerSideFilter<IRfqLookupEntity, IQuoteHeaderEntity> {
	private readonly configService = inject(PlatformConfigurationService);

	/**
	 * Key
	 */
	public key: string = 'procurement-quote-rfq-header-filter';

	/**
	 * Executor
	 * @param context
	 */
	public execute(context: ILookupContext<IRfqLookupEntity, IQuoteHeaderEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
		return {
			CompanyFk: this.configService.clientId,
			HasSelected: true,
			ProjectFk: context.entity?.ProjectFk // TODO-DRIZZLE: procurementContextService.loginProject To be checked.
		};
	}
}
