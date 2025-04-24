/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatNode,ServiceRole,IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { BasicsConfigGenericWizardContainerComplete } from '../model/basics-config-generic-wizard-container-complete.class';
import { IGenericWizardContainerEntity } from '../model/entities/generic-wizard-container-entity.interface';
import { BasicsConfigGenericWizardStepDataService } from '../../generic-wizard-step/services/basics-config-generic-wizard-step-data.service';
import { IGenericWizardStepEntity } from '../../generic-wizard-step/model/entities/generic-wizard-step-entity.interface';
import { BasicsConfigGenericWizardStepComplete } from '../../generic-wizard-step/model/basics-config-generic-wizard-step-complete.class';


/**
 * Basics Config Generic Wizard Container Data service 
 */

@Injectable({
	providedIn: 'root'
})

export class BasicsConfigGenericWizardContainerDataService extends DataServiceFlatNode<IGenericWizardContainerEntity, BasicsConfigGenericWizardContainerComplete,IGenericWizardStepEntity, BasicsConfigGenericWizardStepComplete >{

	public constructor( basicsConfigGenericWizardStepDataService: BasicsConfigGenericWizardStepDataService) {
		const options: IDataServiceOptions<IGenericWizardContainerEntity>  = {
			apiUrl: 'basics/config/genwizard/container',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IGenericWizardContainerEntity, IGenericWizardStepEntity, BasicsConfigGenericWizardStepComplete>>{
				role: ServiceRole.Node,
				itemName: 'Container',
				parent: basicsConfigGenericWizardStepDataService,
			},
		};

		super(options);
	}

	protected override provideLoadPayload(): object {
		const selection = this.getSelectedParent();

		if (selection) {
			return { SuperEntityId: selection.Id, filter: '' };
		}
		return { SuperEntityId: 0, filter: '' };
	}

	protected override onLoadSucceeded(loaded: object): IGenericWizardContainerEntity[] {
		return loaded as IGenericWizardContainerEntity[];
	}
	
}





