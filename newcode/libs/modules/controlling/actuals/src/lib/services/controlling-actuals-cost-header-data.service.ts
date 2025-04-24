/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatRoot,ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions,IDataServiceRoleOptions } from '@libs/platform/data-access';
import { ControllingActualsCostHeaderComplete } from '../model/controlling-actuals-cost-header-complete.class';
import {ICompanyCostHeaderEntity} from '../model/entities/company-cost-header-entity.interface';

export const CONTROLLING_ACTUALS_COST_HEADER_DATA_TOKEN = new InjectionToken<ControllingActualsCostHeaderDataService>('controllingActualsCostHeaderDataToken');

@Injectable({
	providedIn: 'root'
})

export class ControllingActualsCostHeaderDataService extends DataServiceFlatRoot<ICompanyCostHeaderEntity, ControllingActualsCostHeaderComplete> {

	public constructor() {
		const options: IDataServiceOptions<ICompanyCostHeaderEntity> = {
			apiUrl: 'controlling/actuals',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'costheader/list',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'costheader/deletelist',
				usePost: true
			},
			updateInfo:<IDataServiceEndPointOptions>{
				endPoint: 'update',

			},
			roleInfo: <IDataServiceRoleOptions<ICompanyCostHeaderEntity>>{
				role: ServiceRole.Root,
				itemName: 'controllingActualsCostHeader',
			}
		};

		super(options);
	}

	public override createUpdateEntity(modified: ICompanyCostHeaderEntity | null): ControllingActualsCostHeaderComplete {
		const complete = new ControllingActualsCostHeaderComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.controllingActualsCostHeader = modified;
		}

		return complete;
	}

}







