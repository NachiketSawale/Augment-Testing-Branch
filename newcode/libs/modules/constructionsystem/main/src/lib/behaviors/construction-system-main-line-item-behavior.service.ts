/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable, InjectionToken } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ICheckMenuItem, ItemType } from '@libs/ui/common';
import { PlatformHttpService, ServiceLocator } from '@libs/platform/common';
import { ConstructionSystemHighLightToggleService } from '../services/construction-system-high-light-toggle.service';
import { ConstructionSystemMainLineItemDataService } from '../services/construction-system-main-line-item-data.service';
import { ConstructionSystemMainEstimateConfigService } from '../services/construction-system-main-estimate-config-dialog.service';
import { ConstructionSystemMainHighlightOption } from '../model/enums/cos-main-highlight-option.enum';
import { ICosEstLineItemEntity } from '../model/entities/cos-est-lineitem-entity.interface';

export const CONSTRUCTION_SYSTEM_MAIN_LINE_ITEM_BEHAVIOR_TOKEN = new InjectionToken<ConstructionSystemMainLineItemBehavior>('constructionSystemMainLineItemBehavior');

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainLineItemBehavior implements IEntityContainerBehavior<IGridContainerLink<ICosEstLineItemEntity>, ICosEstLineItemEntity> {
	private readonly highlightService = ServiceLocator.injector.get(ConstructionSystemHighLightToggleService);
	private readonly dataService = ServiceLocator.injector.get(ConstructionSystemMainLineItemDataService);
	private readonly http = ServiceLocator.injector.get(PlatformHttpService);
	private readonly configService = ServiceLocator.injector.get(ConstructionSystemMainEstimateConfigService);

	public onCreate(containerLink: IGridContainerLink<ICosEstLineItemEntity>) {
		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'constructionsystem.main.column.title' },
				hideItem: false,
				iconClass: 'tlb-icons ico-settings-doc',
				id: 'modalConfig',
				fn: (info) => {
					this.configService.showDialog();
				},
				sort: 202,
				type: ItemType.Check,
				value: this.highlightService.isLineItem(),
			},
			{
				caption: { key: 'constructionsystem.main.toggleHighlight' },
				hideItem: false,
				iconClass: 'tlb-icons ico-view-select',
				id: 't1234',
				fn: (info) => {
					const item = info.item as ICheckMenuItem;
					if (item.value) {
						this.highlight();
					} else {
						this.highlightService.toggleHighlight([], null);
					}
				},
				disabled: () => {
					return this.dataService.canDelete();
				},
				sort: 203,
				type: ItemType.Check,
				value: this.highlightService.isLineItem(),
			},
		]);
	}

	private async highlight() {
		const selectedItems = this.dataService.getSelection();
		const res = await this.http.post(
			'estimate/main/lineitem2mdlobject/getall',
			selectedItems.map(function (selectedItem) {
				return {
					EstHeaderFk: selectedItem.EstHeaderFk,
					EstLineItemFk: selectedItem.Id,
				};
			}),
		);
		this.highlightService.toggleHighlight(res, ConstructionSystemMainHighlightOption.LineItem);
	}
}
