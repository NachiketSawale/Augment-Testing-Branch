/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken, Injectable,inject } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions, ServiceRole,IDataServiceEndPointOptions } from '@libs/platform/data-access';

import { ITimeSymbolEntity, TimeSymbolComplete, ITimeSymbolAccountEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingTimeSymbolsDataService } from './timekeeping-time-symbols-data.service';
import { PlatformConfigurationService } from '@libs/platform/common';


export const TIMEKEEPING_TIME_SYMBOLS_ACCOUNT_DATA_TOKEN = new InjectionToken<TimekeepingTimeSymbolsAccountDataService>('timekeepingTimeSymbolsAccountDataToken');

@Injectable({
	providedIn: 'root'
})


export class TimekeepingTimeSymbolsAccountDataService extends DataServiceFlatLeaf<ITimeSymbolAccountEntity,ITimeSymbolEntity, TimeSymbolComplete> {
	private configurationService = inject(PlatformConfigurationService);
	public constructor(timekeepingTimeSymbolsDataService : TimekeepingTimeSymbolsDataService ) {

		const options: IDataServiceOptions<ITimeSymbolAccountEntity> = {
			apiUrl: 'timekeeping/timesymbols/account',
			roleInfo: <IDataServiceChildRoleOptions<ITimeSymbolAccountEntity,ITimeSymbolEntity,TimeSymbolComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Accounts',
				parent: timekeepingTimeSymbolsDataService
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
				prepareParam: ident => {

					return { PKey1: ident.pKey1,
						PKey2:this.configurationService.clientId };
				}
			}
		};

		super(options);
	}

	public override isParentFn(parentKey: ITimeSymbolEntity, entity: ITimeSymbolAccountEntity): boolean {
		return entity.TimeSymbolFk === parentKey.Id;
	}

}





