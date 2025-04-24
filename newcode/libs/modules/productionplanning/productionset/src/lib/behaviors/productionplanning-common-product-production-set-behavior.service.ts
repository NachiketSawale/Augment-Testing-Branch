/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { ProductionplanningCommonProductProductionSetDataService } from '../services/productionplanning-common-product-production-set-data.service';
import { IPpsProductEntity } from '@libs/productionplanning/product';
import { ItemType } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class ProductionplanningCommonProductProductionSetBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsProductEntity>, IPpsProductEntity> {

	private readonly dataService: ProductionplanningCommonProductProductionSetDataService;
	

	public constructor() {
		this.dataService = inject(ProductionplanningCommonProductProductionSetDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IPpsProductEntity>): void {

		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { text: 'Preview', key: 'basics.common.preview.button.previewCaption'},
				hideItem: false,
				iconClass: 'tlb-icons ico-preview-form',
				id: 'preview',

				fn: () => {
					throw new Error('This method is not implemented');
				},
				sort: 21,
				type: ItemType.Item,
			},
			{
				caption: { text: 'Download Document', key: 'basics.common.upload.button.downloadCaption'},
				hideItem: false,
				iconClass: 'tlb-icons ico-download',
				id: 'download',

				fn: () => {
					// this.dataService.downloadFiles();
					throw new Error('This method is not implemented');
				},
				sort: 22,
				type: ItemType.Item,
			},
			{
				caption: { text: 'Create Reference', key: 'cloud.common.createReference'},
				hideItem: false,
				iconClass: 'tlb-icons ico-reference-add',
				id: 'download',

				fn: () => {
					// this.dataService.downloadFiles();
					throw new Error('This method is not implemented');
				},
				sort: 23,
				type: ItemType.Item,
			},
			{
				caption: { text: 'Delete Reference', key: 'cloud.common.deleteReference'},
				hideItem: false,
				iconClass: 'tlb-icons ico-reference-delete',
				id: 'download',

				fn: () => {
					// this.dataService.downloadFiles();
					throw new Error('This method is not implemented');
				},
				sort: 24,
				type: ItemType.Item,
			},

		]);
		containerLink.uiAddOns.toolbar.deleteItems([EntityContainerCommand.CreateRecord, EntityContainerCommand.DeleteRecord]);
	}


}