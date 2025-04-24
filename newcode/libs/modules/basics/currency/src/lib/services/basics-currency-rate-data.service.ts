/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';

import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';

import { BasicsCurrencyRateEntity } from '../model/basics-currency-rate-entity.class';

import { BasicsCurrencyConversionEntity } from '../model/basics-currency-conversion-entity.class';
import { BasicsCurrencyConversionComplete } from '../model/basics-currency-conversion-complete.class';
import { BasicsCurrencyConversionDataService } from './basics-currency-conversion-data.service';

export const BASICS_CURRENCY_RATE_DATA_TOKEN = new InjectionToken<BasicsCurrencyRateDataService>('basicsCurrencyRateDataToken');

@Injectable({
	providedIn: 'root',
})
export class BasicsCurrencyRateDataService extends DataServiceFlatLeaf<BasicsCurrencyRateEntity, BasicsCurrencyConversionEntity, BasicsCurrencyConversionComplete> {
	public constructor(basicsCurrencyConversionDataService: BasicsCurrencyConversionDataService) {
		const options: IDataServiceOptions<BasicsCurrencyRateEntity> = {
			apiUrl: 'basics/currency/rate',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return {
						mainItemId: ident.pKey1
					};
				}
			},
			createInfo: <IDataServiceEndPointOptions>{
				prepareParam: () => {
					const selected = basicsCurrencyConversionDataService.getSelectedEntity();
					if(selected){
						return {
							Basis: selected.Basis,
							CurrencyConversionFk:selected.Id,
							CurrencyForeignFk:selected.CurrencyForeignFk,
							CurrencyHomeFk:selected.CurrencyHomeFk
						};
					}
					return null;
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<BasicsCurrencyRateEntity, BasicsCurrencyConversionEntity, BasicsCurrencyConversionComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'CurrencyRate',
				parent: basicsCurrencyConversionDataService,
			},
		};

		super(options);
	}

	public override isParentFn(parent: BasicsCurrencyConversionEntity, entity: BasicsCurrencyRateEntity): boolean {
		return parent.Id === entity.CurrencyConversionFk;
	}
}
