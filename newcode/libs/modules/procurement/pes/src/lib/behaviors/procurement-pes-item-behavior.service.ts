/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { Subscription } from 'rxjs';
import { IPesItemEntity } from '../model/entities';
import { ItemType } from '@libs/ui/common';
import { ProcurementPesItemDataService } from '../services/procurement-pes-item-data.service';
import { PlatformLazyInjectorService } from '@libs/platform/common';
import { PROCUREMENT_STOCK_ALTERNATIVE_DIALOG_SERVICE_TOKEN } from '@libs/procurement/interfaces';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPesItemBehavior implements IEntityContainerBehavior<IGridContainerLink<IPesItemEntity>, IPesItemEntity> {
	private subscriptions: Subscription[] = [];

	private readonly dataService = inject(ProcurementPesItemDataService);
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	public onCreate(containerLink: IGridContainerLink<IPesItemEntity>): void {
		containerLink.uiAddOns.toolbar.addItems([
			{
				id: 'copypesitem',
				caption: {
					key: 'procurement.pes.pesItems.copyItem',
				},
				type: ItemType.Item,
				iconClass: 'tlb-icons ico-rec-new-copy',
				fn: async () => {
					await this.dataService.deepCopy();
				},
				disabled: () => {
					return !this.dataService.canDeepCopy();
				},
			},
			{
				id: 'createotheritem',
				caption: {
					key: 'procurement.common.copyContractNNonContractItems',
				},
				type: ItemType.Item,
				iconClass: 'control-icons ico-copy-action1-2',
				fn: async () => {
					const pesHeader = this.dataService.currentPesHeader;
					const pesItem = this.dataService.getSelectedEntity();

					await this.dataService.createOtherItems({
						conHeaderFk: pesItem?.ConHeaderFk ?? pesHeader.ConHeaderFk,
						projectFk: pesItem?.ProjectFk ?? pesHeader.ProjectFk,
						selectedItem: pesItem,
						isIncludeNonContractedPesItems: true,
					});
				},
				disabled: () => {
					return !this.dataService.canCreateOtherItems();
				},
			},
			{
				id: 'alternative',
				caption: {
					key: 'procurement.stock.title.alternative',
				},
				iconClass: 'tlb-icons ico-alternative',
				type: ItemType.Item,
				fn: async () => {
					const entity = this.dataService.getSelectedEntity()!;
					const service = await this.lazyInjector.inject(PROCUREMENT_STOCK_ALTERNATIVE_DIALOG_SERVICE_TOKEN);
					await service.show({
						materialId: entity.MdcMaterialFk!,
						stockId: entity.PrjStockFk,
						code: entity.MaterialCode,
						description: entity.Description1,
					});
				},
				disabled: () => {
					const entity = this.dataService.getSelectedEntity();
					return !entity?.MdcMaterialFk;
				},
			},
		]);
	}

	public onDestroy(containerLink: IGridContainerLink<IPesItemEntity>): void {
		this.subscriptions.forEach((sub) => {
			sub.unsubscribe();
		});
	}
}
