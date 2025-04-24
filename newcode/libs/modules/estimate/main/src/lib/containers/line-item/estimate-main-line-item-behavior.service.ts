/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { inject, Injectable } from '@angular/core';
import { EstimateMainService } from './estimate-main-line-item-data.service';
import { ItemType } from '@libs/ui/common';
import { EstimateMainContextService } from '@libs/estimate/shared';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { EstimateMainCopySourceCopyOptionsDialogService } from '../../services/copy-source-estimate/estimate-main-copy-source-copy-options-dialog.service';
import { EstimateMainConfigService } from './toolbars/estimate-main-config.service';
import { EstimateShareUrbConfigDialogService } from '@libs/estimate/shared';

/**
 * Service to handle behaviors related to estimate line item
 */
@Injectable({
	providedIn: 'root'
})
export class EstimateMainLineItemBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IEstLineItemEntity>, IEstLineItemEntity> {

	private readonly estimateMainContextService = inject(EstimateMainContextService);
	private readonly estimateMainCopySourceCopyOptionsDialogService = inject(EstimateMainCopySourceCopyOptionsDialogService);
	private readonly estimateMainConfigService = inject(EstimateMainConfigService);
	private readonly estimateShareUrbConfigDialogService = inject(EstimateShareUrbConfigDialogService);

	/**
	 * EstimateMainLineItemBehaviorService constructor
	 * @param dataService EstimateMainService
	 */
	public constructor(private dataService: EstimateMainService) { }

	/**
	 * Method to call when a container is created
	 * @param containerLink
	 */
	public onCreate(containerLink: IGridContainerLink<IEstLineItemEntity>): void {
		this.customizeToolbar(containerLink);
	}

	/**
	 * Private method to customize the toolbar with additional items
	 * @param containerLink
	 * @private
	 */
	private customizeToolbar(containerLink: IGridContainerLink<IEstLineItemEntity>) {
		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'estimate.main.estConfigDialogTitle' },
				hideItem: false,
				iconClass: 'tlb-icons ico-settings-doc',
				id: 'modalConfig',
				fn: () => {
					this.estimateMainConfigService.showDialog();
				},
				disabled: () => {
					return this.estimateMainContextService.getHeaderStatus() || !this.dataService.hasCreateUpdatePermission();
				},
				sort: 60,
				type: ItemType.Item
			},
			{
				caption: { key: 'estimate.main.estConfigEstBoqUppTitle' },
				hideItem: false,
				iconClass: 'tlb-icons ico-copy-settings',
				id: 'modalConfig',
				fn: () => {
					this.estimateShareUrbConfigDialogService.openEstBoqUrbConfigDialog(this.estimateMainContextService.getSelectedEstHeaderId(), this.estimateMainContextService.getSelectedProjectId());
				},
				sort: 60,
				type: ItemType.Item
			},
			{
				id: 'copyasbase',
				caption: { key: 'estimate.main.copyAsBaseItem' },
				iconClass: 'tlb-icons ico-copy-line-item',
				type: ItemType.Item,
				fn: () => {
					this.dataService.deepCopy(false);
				},
				disabled: () => {
					return this.estimateMainContextService.getHeaderStatus() || !this.dataService.hasCreateUpdatePermission();
				}
			},
			{
				id: 'copyasreference',
				caption: { key: 'estimate.main.copyAsRefItem' },
				iconClass: 'tlb-icons ico-copy-line-item-ref',
				type: ItemType.Item,
				fn: () => {
					this.dataService.deepCopy(true);
				},
				disabled: () => {
					return this.estimateMainContextService.getHeaderStatus() || !this.dataService.hasCreateUpdatePermission();
				}
			},
			{
				id: 'estimateMainCopyOptions',
				caption: { key: 'estimate.main.copyOptions' },
				iconClass: 'tlb-icons  ico-copy-line-item-quantity',
				type: ItemType.Item,
				fn: () => {
					this.estimateMainCopySourceCopyOptionsDialogService.showDialog();
				}
			}
		]);
	}

	/**
	 * This method is invoked in the init phase.
	 * @param containerLink A reference to the facilities of the container.
	 */
	public onInit(containerLink: IGridContainerLink<IEstLineItemEntity>): void {
		this.dataService.refreshAll();
	}
}
