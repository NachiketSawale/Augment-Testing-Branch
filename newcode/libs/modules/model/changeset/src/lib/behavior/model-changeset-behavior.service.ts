/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IChangeSetEntity } from '../model/models';
import { Router } from '@angular/router';
import { ModelChangeSetDataService } from '../services/model-change-set-data.service';

@Injectable({
	providedIn: 'root'
})
export class ModelChangeSetBehavior implements IEntityContainerBehavior<IGridContainerLink<IChangeSetEntity>, IChangeSetEntity> {
    private router = inject(Router);
	private readonly dataService = inject(ModelChangeSetDataService);

	public onCreate(containerLink: IGridContainerLink<IChangeSetEntity>): void {
		containerLink.uiAddOns.navigation.addNavigator({
			displayText: 'Go To Change Module',//TODO : we need to insert translatable here later.
			internalModuleName: 'model.change',
			entityIdentifications: () => {
				return [{id: this.dataService.getSelection()[0].Id}];
			},
			onNavigationDone: () => {
				console.log('navigation to workflowAdministration happened');
			}
		});
	}


}