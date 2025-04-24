/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';

import { DataServiceFlatRoot, ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';

import { BasicsCurrencyEntity } from '../model/basics-currency-entity.class';
import { BasicsCurrencyComplete } from '../model/basics-currency-complete.class';

export const BASICS_CURRENCY_DATA_TOKEN = new InjectionToken<BasicsCurrencyDataService>('basicsCurrencyDataToken');

@Injectable({
	providedIn: 'root',
})
export class BasicsCurrencyDataService extends DataServiceFlatRoot<BasicsCurrencyEntity, BasicsCurrencyComplete> {
	public constructor() {
		const options: IDataServiceOptions<BasicsCurrencyEntity> = {
			apiUrl: 'basics/currency',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceRoleOptions<BasicsCurrencyEntity>>{
				role: ServiceRole.Root,
				itemName: 'Currency',
			},
		};

		super(options);
	}
	public override createUpdateEntity(modified: BasicsCurrencyEntity | null): BasicsCurrencyComplete {
		const complete = new BasicsCurrencyComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Currency = modified;
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: BasicsCurrencyComplete): BasicsCurrencyEntity[] {
		return complete.Currency ? [complete.Currency] : [];
	}

	public override supportsSidebarSearch(){
		return false;
	}
}
