/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IEntityContainerBehavior, IEntityContainerLink, IFormContainerLink, IGridContainerLink } from '@libs/ui/business-base';
import { GenericWizardToolbarService } from '../services/base/generic-wizard-toolbar.service';
import { GenericWizardContainers } from '../configuration/base/enum/rfq-bidder-container-id.enum';

/**
 * Defines the behavior of the generic wizard common behavior.
 */
@Injectable({
	providedIn: 'root'
})
export class WorkflowCommonGenericWizardCommonBehavior<T extends object> implements IEntityContainerBehavior<IEntityContainerLink<T>, T> {

	private readonly genericWizardToolbarService = inject(GenericWizardToolbarService);

	public onInit(containerLink: IEntityContainerLink<T>): void {
		//removing toolbar from the container
		 containerLink.uiAddOns.toolbar.setVisibility(false);

		 //enabling grid container to skip permission check
		 const gridContainerLink = containerLink as IGridContainerLink<T>;
		 if(gridContainerLink.gridConfig !== undefined) {
			 gridContainerLink.gridConfig = {
				 ...gridContainerLink.gridConfig,
				 skipPermissionCheck: true
			 };
		 }

		 let formContainerLink = containerLink as IFormContainerLink<T>;
		 if(formContainerLink.formConfig !== undefined) {
			formContainerLink = {
				...formContainerLink,
				formConfig : {
					...formContainerLink.formConfig
				}
			};
		 }

		 this.addToolbarItems(containerLink);
	}

	private addToolbarItems(containerLink: IEntityContainerLink<T>) {
		const containerUuid = containerLink.uuid as GenericWizardContainers;
		if(this.genericWizardToolbarService.getMenuItems(containerUuid).length !== 0) {
			containerLink.uiAddOns.toolbar.clear();
			containerLink.uiAddOns.toolbar.setVisibility(true);
			containerLink.uiAddOns.toolbar.addItems(this.genericWizardToolbarService.getMenuItems(containerUuid));
		}
	}
}