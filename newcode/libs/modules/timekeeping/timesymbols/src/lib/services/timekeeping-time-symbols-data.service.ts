/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';

import { DataServiceFlatRoot,ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions,IDataServiceRoleOptions } from '@libs/platform/data-access';

import { ITimeSymbolEntity, TimeSymbolComplete } from '@libs/timekeeping/interfaces';


export const TIMEKEEPING_TIME_SYMBOLS_DATA_TOKEN = new InjectionToken<TimekeepingTimeSymbolsDataService>('timekeepingTimeSymbolsDataToken');

@Injectable({
	providedIn: 'root'
})

export class TimekeepingTimeSymbolsDataService extends DataServiceFlatRoot<ITimeSymbolEntity, TimeSymbolComplete> {

	public constructor() {
		const options: IDataServiceOptions<ITimeSymbolEntity> = {
			apiUrl: 'timekeeping/timesymbols',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<ITimeSymbolEntity>>{
				role: ServiceRole.Root,
				itemName: 'TimeSymbols',
			}
		};

		super(options);
	}
	public override createUpdateEntity(modified: ITimeSymbolEntity | null): TimeSymbolComplete {
		const complete = new TimeSymbolComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.TimeSymbols = [modified];
			if (complete.TimeSymbols){
				complete.TimeSymbols.forEach(t => {
					if (t.DescriptionInfo?.Translated){
						t.DescriptionInfo.Modified = true;
					}
				});
			}
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: TimeSymbolComplete): ITimeSymbolEntity[] {
		if (complete.TimeSymbols){
			return complete.TimeSymbols;
		}
		return [];
	}
}





