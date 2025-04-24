/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { BasicsCountryStateEntity } from '../model/basics-country-state-entity.class';
import { BasicsCountryEntity } from '../model/basics-country-entity.class';
import { BasicsCountryComplete } from '../model/basics-country-complete.class';
import { BasicsCountryDataService } from './basics-country-data.service';
export const BASICS_COUNTRY_STATE_DATA_TOKEN = new InjectionToken<BasicsCountryStateDataService>('basicsCountryStateDataToken');

@Injectable({
	providedIn: 'root',
})
export class BasicsCountryStateDataService extends DataServiceFlatLeaf<BasicsCountryStateEntity, BasicsCountryEntity, BasicsCountryComplete> {
	public constructor(basicsCountryDataService: BasicsCountryDataService) {
		const options: IDataServiceOptions<BasicsCountryStateEntity> = {
			apiUrl: 'basics/country/state',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true,
				prepareParam: ident => {
					return { Id : ident.pKey1};
				}
			},

			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<BasicsCountryStateEntity, BasicsCountryEntity, BasicsCountryComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'State',
				parent: basicsCountryDataService,
			},
		};

		super(options);
	}

	public override isParentFn(parentKey: BasicsCountryEntity, entity: BasicsCountryStateEntity): boolean {
		return entity.CountryFk === parentKey.Id;
	}
}
