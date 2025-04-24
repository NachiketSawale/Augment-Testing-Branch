/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';

import { DataServiceFlatRoot, ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions, IEntityProcessor } from '@libs/platform/data-access';

import { BasicsCountryEntity } from '../model/basics-country-entity.class';
import { BasicsCountryComplete } from '../model/basics-country-complete.class';

export const BASICS_COUNTRY_DATA_TOKEN = new InjectionToken<BasicsCountryDataService>('basicsCountryDataToken');

@Injectable({
	providedIn: 'root',
})
export class BasicsCountryDataService extends DataServiceFlatRoot<BasicsCountryEntity, BasicsCountryComplete> {
	public constructor() {
		const options: IDataServiceOptions<BasicsCountryEntity> = {
			apiUrl: 'basics/country',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceRoleOptions<BasicsCountryEntity>>{
				role: ServiceRole.Root,
				itemName: 'Country',
			},
		};

		super(options);
	}

	protected override provideAllProcessor(options: IDataServiceOptions<BasicsCountryEntity>): IEntityProcessor<BasicsCountryEntity>[] {
		return [
			...super.provideAllProcessor(options)//,
			//inject(BASICS_COUNTRY_NEWENTITYVALIDATION_TOKEN)
		];
	}

	public override createUpdateEntity(modified: BasicsCountryEntity | null): BasicsCountryComplete {
		const complete = new BasicsCountryComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Country = modified;
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: BasicsCountryComplete): BasicsCountryEntity[] {
		if (complete.Country === null) {
			return [];
		}

		return [complete.Country];
	}
}
