/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsCostGroupComplete } from '@libs/basics/shared';
import { EntityContainerCommand, IEntityContainerBehavior, IFormContainerLink } from '@libs/ui/business-base';
import { ICosObjectTemplate2TemplateEntity } from '../model/entities/cos-object-template-2-template-entity.interface';
import { ConstructionSystemMasterObjectTemplate2TemplateDataService } from '../services/construction-system-master-object-template2-template-data.service';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterObjectTemplate2TemplateDetailBehavior implements IEntityContainerBehavior<IFormContainerLink<ICosObjectTemplate2TemplateEntity>, ICosObjectTemplate2TemplateEntity> {
	private readonly dataService = inject(ConstructionSystemMasterObjectTemplate2TemplateDataService);

	public onCreate(containerLink: IFormContainerLink<ICosObjectTemplate2TemplateEntity>) {
		containerLink.uiAddOns.toolbar.deleteItems([EntityContainerCommand.First, EntityContainerCommand.Previous, EntityContainerCommand.Next, EntityContainerCommand.Last]);

		this.dataService.onCostGroupCatalogsLoaded.subscribe((value) => {
			this.costGroupLoaded(value);
		});

		if (this.dataService.costGroupCatalogs) {
			this.costGroupLoaded(this.dataService.costGroupCatalogs);
		}
	}

	private costGroupLoaded(costGroupCatalogs: BasicsCostGroupComplete) {
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
