/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { EstimateMainControllingContainerDataService } from './estimate-main-controlling-container-data.service';
import { IControllingUnitEntity } from '@libs/basics/shared';


export const ESTIMATE_MAIN_CONTROLLING_CONTAINER_BEHAVIOR_TOKEN = new InjectionToken<EstimateMainControllingContainerBehavior>('estimateMainControllingContainerBehavior');

@Injectable({
	providedIn: 'root'
})

/**
 *  Behavior class for the Estimate Main Controlling Container.
 *
 */
export class EstimateMainControllingContainerBehavior implements IEntityContainerBehavior<IGridContainerLink<IControllingUnitEntity>, IControllingUnitEntity> {
	private dataService: EstimateMainControllingContainerDataService;
	
	public constructor() {
		this.dataService = inject(EstimateMainControllingContainerDataService);
	}

	/**
	 *  Handles the creation event of the container.
	 * Customizes the toolbar of the container link.
	 */
	public onCreate(containerLink: IGridContainerLink<IControllingUnitEntity>): void {
		this.customizeToolbar(containerLink);
	}

	/**
	 *  Customizes the toolbar of the container.
	 * Removes specific items ('create' and 'delete') from the toolbar.
	 */
	private customizeToolbar(containerLink: IGridContainerLink<IControllingUnitEntity>) {
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete','createChild']);
	}

}
