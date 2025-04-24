/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	ServiceRole
} from '@libs/platform/data-access';
import { IRfqHeaderEntity, IQuote2RfqVEntity } from '@libs/procurement/interfaces';
import { RfqHeaderEntityComplete } from '@libs/procurement/rfq';
import { ProcurementPricecomparisonRfqHeaderDataService } from './rfq-header-data.service';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPriceComparisonQuoteByRequestDataService extends DataServiceFlatLeaf<IQuote2RfqVEntity, IRfqHeaderEntity, RfqHeaderEntityComplete> {

	public constructor(
		private parentService: ProcurementPricecomparisonRfqHeaderDataService,
	) {
		super({
			apiUrl: 'procurement/pricecomparison/quote2rfq',
			readInfo: {
				endPoint: 'listbyrfqheader',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IQuote2RfqVEntity, IRfqHeaderEntity, RfqHeaderEntityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'QuoteByRequest',
				parent: parentService,
			}
		});
	}

	protected override onLoadSucceeded(loaded: IQuote2RfqVEntity[]): IQuote2RfqVEntity[] {
		return loaded;
	}

	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				PKey1: parentSelection.Id,
				filter: ''
			};
		}
		return {
			PKey1: -1,
			filter: ''
		};
	}
}
