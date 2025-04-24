/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IDashboard2GroupEntity } from '../model/entities/dashboard-2group-entity.interface';
import { IDashboardEntity } from '../../biplusdesignerdashboard/model/entities/dashboard-entity.interface';
import { BasicsBiPlusDesignerDashboardDataService } from '../../biplusdesignerdashboard/services/basics-bi-plus-designer-dashboard-data.service';
import { BasicsBiPlusDesignerDashboardComplete } from '../../biplusdesignerdashboard/model/basics-bi-plus-designer-dashboard-complete.class';

/**
 * Basicsbiplusdesigner Dashboard to Group Entity DataService
 */
@Injectable({
	providedIn: 'root'
})

export class BasicsBiPlusDesignerDashboard2GroupDataService extends DataServiceFlatLeaf<IDashboard2GroupEntity,IDashboardEntity, BasicsBiPlusDesignerDashboardComplete >{

	public constructor(parentService:BasicsBiPlusDesignerDashboardDataService) {
		const options: IDataServiceOptions<IDashboard2GroupEntity>  = {
			apiUrl: 'basics/biplusdesigner/dashboard2group',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IDashboard2GroupEntity,IDashboardEntity, BasicsBiPlusDesignerDashboardComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Dashboard2Group',
				parent: parentService,
			},
		};

		super(options);
	}
	
}

		
			





