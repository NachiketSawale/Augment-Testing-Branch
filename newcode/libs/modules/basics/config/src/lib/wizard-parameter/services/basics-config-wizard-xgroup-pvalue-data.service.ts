/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';

import { IWizard2GroupPValueEntity } from '../model/entities/wizard-2group-pvalue-entity.interface';
import { BasicsConfigWizardXGroupComplete } from '../../wizard-to-group/model/basics-config-wizard-xgroup-complete.class';
import { IWizard2GroupEntity } from '../../wizard-to-group/model/entities/wizard-2group-entity.interface';
import { BasicsConfigWizardXGroupDataService } from '../../wizard-to-group/services/basics-config-wizard-xgroup-data.service';



@Injectable({
	providedIn: 'root'
})

/**
 * Basics config wizard-x group parameter value data service.
 */
export class BasicsConfigWizardXGroupPValueDataService extends DataServiceFlatLeaf<IWizard2GroupPValueEntity, IWizard2GroupEntity, BasicsConfigWizardXGroupComplete> {

	public constructor(basicsConfigWizardXGroupDataService: BasicsConfigWizardXGroupDataService) {
		const options: IDataServiceOptions<IWizard2GroupPValueEntity> = {
			apiUrl: 'basics/config/wizard2grouppv',
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
			roleInfo: <IDataServiceChildRoleOptions<IWizard2GroupPValueEntity, IWizard2GroupEntity, BasicsConfigWizardXGroupComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Wizard2GroupPValue',
				parent: basicsConfigWizardXGroupDataService,
			},
		};

		super(options);
	}

}








