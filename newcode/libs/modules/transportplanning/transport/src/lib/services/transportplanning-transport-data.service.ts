/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatRoot,ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions,IDataServiceRoleOptions } from '@libs/platform/data-access';
import { ITrsRouteEntity } from '../model/entities/trs-route-entity.interface';
import { TrsRouteComplete } from '../model/entities/trs-route-complete.class';



@Injectable({
	providedIn: 'root'
})

export class TransportplanningTransportDataService extends DataServiceFlatRoot<ITrsRouteEntity, TrsRouteComplete> {

	public constructor() {
		const options: IDataServiceOptions<ITrsRouteEntity> = {
			apiUrl: 'transportplanning/transport/route',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'customfiltered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<ITrsRouteEntity>>{
				role: ServiceRole.Root,
				itemName: 'TrsRoutes',
			}
		};

		super(options);
	}
	public override createUpdateEntity(modified: ITrsRouteEntity | null): TrsRouteComplete {
		const complete = new TrsRouteComplete();
		if (modified !== null) {
			//complete.Id = modified.Id;
			//complete.Datas = [modified];
		}

		return complete;
	}

}












