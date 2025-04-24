/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';

import { IMcTwoQnAEntity } from '../model/entities/mc-two-qn-aentity.interface';
import { IModuleEntity } from '../../modules/model/entities/module-entity.interface';

import { BasicsConfigComplete } from '../../modules/model/basics-config-complete.class';

import { BasicsConfigDataService } from '../../modules/services/basics-config-data.service';


@Injectable({
	providedIn: 'root'
})

/**
 * Basics config McTwo QnA data service
 */
export class BasicsConfigMcTwoQnADataService extends DataServiceFlatLeaf<IMcTwoQnAEntity, IModuleEntity, BasicsConfigComplete> {

	public constructor(private basicsConfigDataService: BasicsConfigDataService) {
		const options: IDataServiceOptions<IMcTwoQnAEntity> = {
			apiUrl: 'basics/config/mctwoqna',
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
			roleInfo: <IDataServiceChildRoleOptions<IMcTwoQnAEntity, IModuleEntity, BasicsConfigComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'McTwoQnA',
				parent: basicsConfigDataService,
			},
		};

		super(options);
	}

}








