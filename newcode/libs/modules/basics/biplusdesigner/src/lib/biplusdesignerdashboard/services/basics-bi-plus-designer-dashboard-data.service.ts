/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatRoot, ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';

import { BasicsBiPlusDesignerDashboardComplete } from '../model/basics-bi-plus-designer-dashboard-complete.class';
import { IDashboardEntity } from '../model/entities/dashboard-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class BasicsBiPlusDesignerDashboardDataService extends DataServiceFlatRoot<IDashboardEntity, BasicsBiPlusDesignerDashboardComplete> {
	public constructor() {
		const options: IDataServiceOptions<IDashboardEntity> = {
			apiUrl: 'basics/biplusdesigner/dashboard',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filter',
				usePost: true,
			},

			roleInfo: <IDataServiceRoleOptions<IDashboardEntity>>{
				role: ServiceRole.Root,
				itemName: 'Dashboard',
			},
		};

		super(options);
	}
	public override createUpdateEntity(modified: IDashboardEntity | null): BasicsBiPlusDesignerDashboardComplete {
		const complete = new BasicsBiPlusDesignerDashboardComplete();
		if (modified !== null) {
			complete.Id = modified.Id as number;
			complete.Datas = [modified];
		}

		return complete;
	}
}
