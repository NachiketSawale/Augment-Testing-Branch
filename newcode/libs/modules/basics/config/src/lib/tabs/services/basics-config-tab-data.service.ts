/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';

import { IModuleTabEntity } from '../model/entities/module-tab-entity.interface';
import { IModuleEntity } from '../../modules/model/entities/module-entity.interface';
import { BasicsConfigComplete } from '../../modules/model/basics-config-complete.class';
import { BasicsConfigDataService } from '../../modules/services/basics-config-data.service';


@Injectable({
	providedIn: 'root',
})
export class BasicsConfigTabDataService extends DataServiceFlatLeaf<IModuleTabEntity, IModuleEntity, BasicsConfigComplete> {
	public constructor(public basicsConfigDataService: BasicsConfigDataService) {
		const options: IDataServiceOptions<IModuleEntity> = {
			apiUrl: 'basics/config/tab',
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
			roleInfo: <IDataServiceChildRoleOptions<IModuleTabEntity, IModuleEntity, BasicsConfigComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ModuleTab',
				parent: basicsConfigDataService,
			},
		};
		super(options);
	}
}
