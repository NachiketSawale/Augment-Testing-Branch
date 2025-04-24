/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IEntityContainerBehavior, IFormContainerLink } from '@libs/ui/business-base';
import { ICosObjectTemplateEntity } from '../model/models';
import { ConstructionSystemMasterObjectTemplateDataService } from '../services/construction-system-master-object-template-data.service';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterObjectTemplateDetailBehaviorService implements IEntityContainerBehavior<IFormContainerLink<ICosObjectTemplateEntity>, ICosObjectTemplateEntity> {
	private readonly dataService = inject(ConstructionSystemMasterObjectTemplateDataService);

	public onCreate(containerLink: IFormContainerLink<ICosObjectTemplateEntity>) {
		this.dataService.onCostGroupCatalogsLoaded.subscribe((costGroupLoaded) => {
			this.costGroupLoaded(costGroupLoaded);
		});

		//todo-allen: how to implement it?
		// if (this.dataService.costGroupCatalogs) {
		// 	this.costGroupLoaded(this.dataService.costGroupCatalogs);
		// }
	}

	private costGroupLoaded(costGroupCatalogs: []) {
		// todo-allen: Wait for the basicsCostGroupAssignmentService to be implemented.
		// $injector.get('basicsCostGroupAssignmentService').refreshDetailForm(costGroupCatalogs, {
		// 	scope: $scope,
		// 	dataService: dataService,
		// 	validationService : validationService,
		// 	formConfiguration: formConfiguration,
		// 	costGroupName: 'basicData'
		// });
	}
}
