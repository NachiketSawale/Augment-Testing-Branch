/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatNode, ServiceRole, IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';

import { BasicsConfigGenericWizardStepComplete } from '../model/basics-config-generic-wizard-step-complete.class';
import { BasicsConfigGenericWizardInstanceDataService } from '../../generic-wizard/services/basics-config-generic-wizard-instance-data.service';
import { IGenericWizardStepEntity } from '../model/entities/generic-wizard-step-entity.interface';
import { IGenericWizardInstanceEntity } from '../../generic-wizard/model/entities/generic-wizard-instance-entity.interface';
import { BasicsConfigGenericWizardInstanceComplete } from '../../generic-wizard/model/basics-config-generic-wizard-instance-complete.class';


@Injectable({
	providedIn: 'root'
})

/**
 * Basics config generic wizard step data service.
 */
export class BasicsConfigGenericWizardStepDataService extends DataServiceFlatNode<IGenericWizardStepEntity, BasicsConfigGenericWizardStepComplete, IGenericWizardInstanceEntity, BasicsConfigGenericWizardInstanceComplete> {

	public constructor(genericWizardInstanceDataService: BasicsConfigGenericWizardInstanceDataService) {

		const options: IDataServiceOptions<IGenericWizardStepEntity> = {
			apiUrl: 'basics/config/genwizard/step',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IGenericWizardStepEntity, IGenericWizardInstanceEntity, BasicsConfigGenericWizardInstanceComplete>>{
				role: ServiceRole.Node,
				itemName: 'Steps',
				parent: genericWizardInstanceDataService,
			},
			//TODO: handleCreateSucceeded() and
			//getReadonly() functions. Dependent service
			//genericWizardUseCaseConfigService (having below dependent
			//services
			//genericWizardUseCaseContractApproval, 
			//genericWizardUseCaseRfQBidderWizard,
			// genericWizardUseCaseContractSendMail, 
			//genericWizardUseCaseRfQApprovalWizard) 
			//not ready. 
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










