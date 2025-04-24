/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';

import { IReport2GroupEntity } from '../model/entities/report-2group-entity.interface';
import { IReportGroupEntity } from '../../report-groups/model/entities/report-group-entity.interface';
import { BasicsConfigReportGroupComplete } from '../../report-groups/model/basics-config-report-group-complete.class';
import { BasicsConfigReportGroupDataService } from '../../report-groups/services/basics-config-report-group-data.service';

@Injectable({
	providedIn: 'root'
})

/**
 * basics config report xgroup data service.
 */
export class BasicsConfigReportXGroupDataService extends DataServiceFlatLeaf<IReport2GroupEntity, IReportGroupEntity, BasicsConfigReportGroupComplete> {

	public constructor(private basicsConfigReportGroupDataService: BasicsConfigReportGroupDataService) {
		const options: IDataServiceOptions<IReport2GroupEntity> = {
			apiUrl: 'basics/config/reportXgroup',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: (ident) => {
					return {
						mainItemId: ident.pKey1,
					};
				},
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IReport2GroupEntity, IReportGroupEntity, BasicsConfigReportGroupComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Report2Group',
				parent: basicsConfigReportGroupDataService,
			},
		};

		super(options);
	}

}




