/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { inject, Injectable } from '@angular/core';
import { EstimateMainResourceService } from './estimate-main-resource-data.service';
import { IEstResourceEntity } from '@libs/estimate/interfaces';
import { EstimateMainResourceFilterService } from './estimate-main-resource-filter.service';

/**
 * Service to handle behaviors related to estimate resource
 */
@Injectable({
	providedIn: 'root'
})
export class EstimateMainResourceBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IEstResourceEntity>, IEstResourceEntity> {
	private estimateResourceFilterService: EstimateMainResourceFilterService;

	/**
	 * EstimateMainResourceBehaviorService constructor
	 * @param dataService EstimateMainResourceService
	 */
	public constructor(private dataService: EstimateMainResourceService) {
		this.estimateResourceFilterService = inject(EstimateMainResourceFilterService);
	}

	/**
	 * Method to call when a container is created
	 * @param containerLink
	 */
	public onCreate(containerLink: IGridContainerLink<IEstResourceEntity>): void {
		this.customizeToolbar(containerLink);
	}

	/**
	 * Private method to customize the toolbar with additional items
	 * @param containerLink
	 * @private
	 */
	private customizeToolbar(containerLink: IGridContainerLink<IEstResourceEntity>) {
		containerLink.uiAddOns.toolbar.addItems(this.estimateResourceFilterService.initFilterTools());
	}
}
