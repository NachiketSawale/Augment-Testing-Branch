/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatNode,ServiceRole,IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { BasicsConfigWizardXGroupComplete } from '../model/basics-config-wizard-xgroup-complete.class';
import { IWizard2GroupEntity } from '../model/entities/wizard-2group-entity.interface';
import { BasicsConfigWizardGroupDataService } from '../../wizard-group/services/basics-config-wizard-group-data.service';
import { BasicsConfigWizardGroupComplete } from '../../wizard-group/model/basics-config-wizard-group-complete.class';
import { IWizardGroupEntity } from '../../wizard-group/model/entities/wizard-group-entity.interface';


/**
 * Basics config wizard to group data service
 */
@Injectable({
	providedIn: 'root'
})

export class BasicsConfigWizardXGroupDataService extends DataServiceFlatNode<IWizard2GroupEntity, BasicsConfigWizardXGroupComplete, IWizardGroupEntity, BasicsConfigWizardGroupComplete >{

	public constructor( wizardGroupDataService: BasicsConfigWizardGroupDataService) {
		const options: IDataServiceOptions<IWizard2GroupEntity>  = {
			apiUrl: 'basics/config/wizard2group',
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
			roleInfo: <IDataServiceChildRoleOptions<IWizard2GroupEntity, IWizardGroupEntity, BasicsConfigWizardGroupComplete>>{
				role: ServiceRole.Node,
				itemName: 'Wizard2Group',
				parent: wizardGroupDataService,
			},
		};

		super(options);
	}
	
}





