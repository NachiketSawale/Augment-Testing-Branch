/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IGenericWizardStepScriptEntity } from '../model/entities/generic-wizard-step-script-entity.interface';
import { BasicsConfigGenericWizardStepDataService } from '../../generic-wizard-step/services/basics-config-generic-wizard-step-data.service';
import { IGenericWizardStepEntity } from '../../generic-wizard-step/model/entities/generic-wizard-step-entity.interface';
import { BasicsConfigGenericWizardStepComplete } from '../../generic-wizard-step/model/basics-config-generic-wizard-step-complete.class';


/**
 * The Basics config Generic Wizard Step Script data service
 */
@Injectable({
	providedIn: 'root'
})

export class BasicsConfigGenericWizardStepScriptDataService extends DataServiceFlatLeaf<IGenericWizardStepScriptEntity, IGenericWizardStepEntity, BasicsConfigGenericWizardStepComplete >{

	public constructor(basicsConfigGenericWizardStepDataService: BasicsConfigGenericWizardStepDataService) {
		const options: IDataServiceOptions<IGenericWizardStepScriptEntity>  = {
			apiUrl: 'basics/config/genwizard/stepscript',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IGenericWizardStepScriptEntity,IGenericWizardStepEntity, BasicsConfigGenericWizardStepComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Scripts',
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

	protected override onLoadSucceeded(loaded: object): IGenericWizardStepEntity[] {
		return loaded as IGenericWizardStepEntity[];
	}
}



