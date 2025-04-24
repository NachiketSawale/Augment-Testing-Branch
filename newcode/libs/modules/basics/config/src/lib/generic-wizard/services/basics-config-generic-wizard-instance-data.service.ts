/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatNode, ServiceRole, IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { BasicsConfigGenericWizardInstanceComplete } from '../model/basics-config-generic-wizard-instance-complete.class';
import { IGenericWizardInstanceEntity } from '../model/entities/generic-wizard-instance-entity.interface';
import { BasicsConfigWizardXGroupDataService } from '../../wizard-to-group/services/basics-config-wizard-xgroup-data.service';
import { IWizard2GroupEntity } from '../../wizard-to-group/model/entities/wizard-2group-entity.interface';
import { BasicsConfigWizardXGroupComplete } from '../../wizard-to-group/model/basics-config-wizard-xgroup-complete.class';


@Injectable({
	providedIn: 'root',
})
export class BasicsConfigGenericWizardInstanceDataService extends DataServiceFlatNode<IGenericWizardInstanceEntity, BasicsConfigGenericWizardInstanceComplete, IWizard2GroupEntity, BasicsConfigWizardXGroupComplete> {
	public constructor(WizardXGroupDataService: BasicsConfigWizardXGroupDataService) {
		const options: IDataServiceOptions<IGenericWizardInstanceEntity> = {
			apiUrl: 'basics/config/genwizard/instance',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete',
			},
			roleInfo: <IDataServiceChildRoleOptions<IGenericWizardInstanceEntity, IWizard2GroupEntity, BasicsConfigWizardXGroupComplete>>{
				role: ServiceRole.Node,
				itemName: 'GenericWizardInstances',
				parent: WizardXGroupDataService,
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

	protected override onLoadSucceeded(loaded: object): IGenericWizardInstanceEntity[] {
		return loaded as IGenericWizardInstanceEntity[];
	}
}
