/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatRoot, ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';
import { IWipHeaderEntity } from '../model/entities/wip-header-entity.interface';
import { WipHeaderComplete } from '../model/wip-header-complete.class';

@Injectable({
	providedIn: 'root'
})

export class SalesWipWipsDataService extends DataServiceFlatRoot<IWipHeaderEntity, WipHeaderComplete> {

	public constructor() {
		const options: IDataServiceOptions<IWipHeaderEntity> = {
			apiUrl: 'sales/wip',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listfiltered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<IWipHeaderEntity>>{
				role: ServiceRole.Root,
				itemName: 'WipHeader',
			}
		};

		super(options);
	}

	public override createUpdateEntity(modified: IWipHeaderEntity | null): WipHeaderComplete {
		const complete = new WipHeaderComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.WipHeader = [modified];
		}
		return complete;
	}

}












