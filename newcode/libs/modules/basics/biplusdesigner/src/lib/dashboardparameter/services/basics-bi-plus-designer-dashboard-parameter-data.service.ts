/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatLeaf, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';

import { BasicsBiPlusDesignerDashboardComplete } from '../../biplusdesignerdashboard/model/basics-bi-plus-designer-dashboard-complete.class';
import { IDashboardEntity } from '../../biplusdesignerdashboard/model/entities/dashboard-entity.interface';
import { IDashboardParameterEntity } from '../../biplusdesignerdashboard/model/entities/dashboard-parameter-entity.interface';
import { BasicsBiPlusDesignerDashboardDataService } from '../../biplusdesignerdashboard/services/basics-bi-plus-designer-dashboard-data.service';

@Injectable({
	providedIn: 'root',
})
export class BasicsBiPlusDesignerDashboardParameterDataService extends DataServiceFlatLeaf<IDashboardParameterEntity, IDashboardEntity, BasicsBiPlusDesignerDashboardComplete> {
	public constructor(private readonly parentService: BasicsBiPlusDesignerDashboardDataService) {
		super({
			apiUrl: 'basics/biplusdesigner/dashboard/parameter',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true,
			},
			roleInfo: <IDataServiceChildRoleOptions<IDashboardParameterEntity, IDashboardEntity, BasicsBiPlusDesignerDashboardComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'DashboardParameter',
				parent: parentService,
			},
		});
	}
}
