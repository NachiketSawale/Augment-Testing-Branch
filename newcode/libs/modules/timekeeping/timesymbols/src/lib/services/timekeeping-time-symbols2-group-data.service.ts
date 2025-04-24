/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken, Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions, ServiceRole,IDataServiceEndPointOptions } from '@libs/platform/data-access';

import { ITimeSymbolEntity, ITimeSymbol2GroupEntity, TimeSymbolComplete } from '@libs/timekeeping/interfaces';
import { TimekeepingTimeSymbolsDataService } from './timekeeping-time-symbols-data.service';


export const TIMEKEEPING_TIME_SYMBOLS2_GROUP_DATA_TOKEN = new InjectionToken<TimekeepingTimeSymbols2GroupDataService>('timekeepingTimeSymbols2GroupDataToken');

@Injectable({
	providedIn: 'root'
})

export class TimekeepingTimeSymbols2GroupDataService extends DataServiceFlatLeaf<ITimeSymbol2GroupEntity,ITimeSymbolEntity, TimeSymbolComplete> {

	public constructor(timekeepingTimeSymbolsDataService : TimekeepingTimeSymbolsDataService) {
		const options: IDataServiceOptions<ITimeSymbol2GroupEntity> = {
			apiUrl: 'timekeeping/timesymbols/timesymbol2group',
			roleInfo: <IDataServiceChildRoleOptions<ITimeSymbol2GroupEntity,ITimeSymbolEntity,TimeSymbolComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'TimeSymbol2Group',
				parent: timekeepingTimeSymbolsDataService
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
				prepareParam: ident => {
					return { PKey1: ident.pKey1 };
				}
			}
		};

		super(options);
	}

	public override isParentFn(parentKey: ITimeSymbolEntity, entity: ITimeSymbol2GroupEntity): boolean {
		return entity.TimeSymbolFk === parentKey.Id;
	}
}





