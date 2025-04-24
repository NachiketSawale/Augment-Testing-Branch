/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatNode, ServiceRole, IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { BasicsConfigReportGroupComplete } from '../model/basics-config-report-group-complete.class';
import { IReportGroupEntity } from '../model/entities/report-group-entity.interface';
import { IModuleEntity } from '../../modules/model/entities/module-entity.interface';
import { BasicsConfigComplete } from '../../modules/model/basics-config-complete.class';
import { BasicsConfigDataService } from '../../modules/services/basics-config-data.service';

@Injectable({
	providedIn: 'root',
})
export class BasicsConfigReportGroupDataService extends DataServiceFlatNode<IReportGroupEntity, BasicsConfigReportGroupComplete, IModuleEntity, BasicsConfigComplete> {
	public constructor(private basicsConfigDataService: BasicsConfigDataService) {
		const options: IDataServiceOptions<IReportGroupEntity> = {
			apiUrl: 'basics/config/reportgroup',
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
				endPoint: 'delete',
			},
			roleInfo: <IDataServiceChildRoleOptions<IReportGroupEntity, IModuleEntity, BasicsConfigComplete>>{
				role: ServiceRole.Node,
				itemName: 'ReportGroup',
				parent: basicsConfigDataService,
			},
		};

		super(options);
	}
}
