

/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import {
	DataServiceFlatRoot,
	ServiceRole,
	IDataServiceOptions,
	IDataServiceEndPointOptions,
	IDataServiceRoleOptions
} from '@libs/platform/data-access';

import { IPpsCommonDispatchGroupEntity, PpsCommonDispatchGroupComplete } from '../model/models';

@Injectable({
	providedIn: 'root'
})

export class PpsCommonDispatchGroupDataService extends DataServiceFlatRoot<IPpsCommonDispatchGroupEntity, PpsCommonDispatchGroupComplete> {

	public constructor(moduleName: string) {
		const options: IDataServiceOptions<IPpsCommonDispatchGroupEntity> = {
			apiUrl: 'resource/enterprise/dispatcher',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IPpsCommonDispatchGroupEntity>>{
				role: ServiceRole.Root,
				itemName: 'Dispatcher',
			}
		};

		super(options);
	}
}












