/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupContext, ILookupServerSideFilter, ServerSideFilterValueType } from '@libs/ui/common';
import { IProjectEntity } from '@libs/project/interfaces';
import { IQuoteHeaderEntity } from '../../model/entities/quote-header-entity.interface';

/**
 * Represents the Project lookup filter binding to the context IQuoteHeaderEntity.
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementQuoteProjectFilterService implements ILookupServerSideFilter<IProjectEntity, IQuoteHeaderEntity> {
	/**
	 * Key
	 */
	public key: string = 'procurement-quote-project-filter';

	/**
	 * Executor
	 * @param context
	 */
	public execute(context: ILookupContext<IProjectEntity, IQuoteHeaderEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
		return {
			IsLive: true
		};
	}
}
