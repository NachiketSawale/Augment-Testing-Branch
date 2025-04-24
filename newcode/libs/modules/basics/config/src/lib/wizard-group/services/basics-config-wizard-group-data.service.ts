/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatNode, ServiceRole, IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';

import { BasicsConfigWizardGroupComplete } from '../model/basics-config-wizard-group-complete.class';
import { BasicsConfigComplete } from '../../modules/model/basics-config-complete.class';

import { BasicsConfigDataService } from '../../modules/services/basics-config-data.service';

import { IWizardGroupEntity } from '../model/entities/wizard-group-entity.interface';
import { IModuleEntity } from '../../modules/model/entities/module-entity.interface';


@Injectable({
	providedIn: 'root'
})

/**
 * basics config wizard group data service.
 */
export class BasicsConfigWizardGroupDataService extends DataServiceFlatNode<IWizardGroupEntity, BasicsConfigWizardGroupComplete, IModuleEntity, BasicsConfigComplete> {

	public constructor(private basicsConfigDataService: BasicsConfigDataService) {
		const options: IDataServiceOptions<IWizardGroupEntity> = {
			apiUrl: 'basics/config/wizardgroup',
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
			roleInfo: <IDataServiceChildRoleOptions<IWizardGroupEntity, IModuleEntity, BasicsConfigComplete>>{
				role: ServiceRole.Node,
				itemName: 'WizardGroup',
				parent: basicsConfigDataService,
			},
		};

		super(options);
	}

}





