/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ICosObjectTemplateEntity } from '../model/models';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterObjectTemplateBehaviorService implements IEntityContainerBehavior<IGridContainerLink<ICosObjectTemplateEntity>, ICosObjectTemplateEntity> {
	public onCreate(containerLink: IGridContainerLink<ICosObjectTemplateEntity>) {
		// todo-allen: how to implement the below codes?
		// platformControllerExtendService.initListController($scope, gridColumns, dataService, validationService, {
		// 	costGroupConfig: {
		// 		dataLookupType: 'ObjectTemplate2CostGroups',
		// 		identityGetter: function (entity) {
		// 			return {
		// 				MainItemId: entity.Id,
		// 			};
		// 		},
		// 	},
		// });
	}
}
