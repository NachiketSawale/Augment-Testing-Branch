/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { Injectable } from '@angular/core';
import { EstimateAssembliesService } from './estimate-assemblies-data.service';
import { ItemType } from '@libs/ui/common';

/**
 * Service to handle behaviors related to estimate assemblies
 */
@Injectable({
	providedIn: 'root'
})
export class EstimateAssembliesBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IEstLineItemEntity>, IEstLineItemEntity> {

	/**
	 * EstimateAssembliesBehaviorService constructor
	 * @param dataService EstimateAssembliesService
	 */
	public constructor(private dataService: EstimateAssembliesService) {}

	/**
	 * Method to call when a container is created
	 * @param containerLink
	 */
	public onCreate(containerLink: IGridContainerLink<IEstLineItemEntity>): void {
		this.customizeToolbar(containerLink);
		this.dataService.refreshAll();
	}

	/**
	 * Private method to customize the toolbar with additional items
	 * @param containerLink
	 * @private
	 */
	private customizeToolbar(containerLink: IGridContainerLink<IEstLineItemEntity>) {
		containerLink.uiAddOns.toolbar.addItems([
			{
				id: 'modalConfig',
				caption: { key: 'estimate.assemblies.assemblyConfigDialogTitle' },
				hideItem: false,
				iconClass: 'tlb-icons ico-settings-doc',
				sort: 198,
				disabled: false,
				// Placeholder function for modal configuration dialog
				fn: () => this.handleModalConfig(),
				type: ItemType.Item
			},
			{
				id: 'copy',
				caption: { key: 'estimate.assemblies.copy' },
				hideItem: false,
				iconClass: 'tlb-icons ico-copy-line-item',
				sort: 199,
				disabled: false,
				// Placeholder function for copy operation
				fn: () => this.handleCopy(),
				type: ItemType.Item
			}
		]);
	}

	// Placeholder function for modal configuration dialog
	private handleModalConfig() {
		// Implement the modal configuration dialog logic here
		console.log('Handling modal configuration...');
	}

	// Placeholder function for copy operation
	private handleCopy() {
		// Implement the copy logic here
		console.log('Handling copy...');
	}
}