/*
 * Copyright(c) RIB Software GmbH
 */

import { IGridContainerLink } from '@libs/ui/business-base';
import { ICheckMenuItem, ISimpleMenuItem, ItemType } from '@libs/ui/common';
import { IPpsUpstreamItemEntity } from '../../model/entities/pps-upstream-item-entity.interface';
import { IPpsUpstreamItemDataService } from './pps-upstream-item-data.service';

export class PpsUpstreamItemButtonFactory {
	private static getCopyBtnConfig(dataService: IPpsUpstreamItemDataService): ISimpleMenuItem {
		return {
			id: 'copyUpStreamItem',
			sort: 1,
			caption: 'cloud.common.taskBarShallowCopyRecord',
			type: ItemType.Item,
			iconClass: 'tlb-icons ico-copy-paste-deep',
			fn: function () {
				dataService.copy();
			},
			disabled: () => {
				return !dataService.hasSelection();
			},
		};
	}

	private static getFilterBtnConfig(dataService: IPpsUpstreamItemDataService): ICheckMenuItem {
		return {
			id: 'onlyShowCurrentUpstreams',
			sort: -2,
			caption: 'productionplanning.item.upstreamItem.onlyShowCurrentUpstreams',
			type: ItemType.Check,
			value: dataService.onlyShowCurrentUpstreams,
			iconClass: 'tlb-icons ico-filtering',
			fn: function () {
				dataService.onlyShowCurrentUpstreams = !dataService.onlyShowCurrentUpstreams;
				dataService.showListByFilter();
			},
			disabled: () => {
				return !dataService.getPpsItem();
			},
		};
	}

	private static getSplitBtnConfig(dataService: IPpsUpstreamItemDataService): ISimpleMenuItem {
		return {
			id: 'splitUpStreamItem',
			sort: -1,
			caption: 'productionplanning.item.upstreamItem.split',
			type: ItemType.Item,
			iconClass: 'tlb-icons ico-dividing-sum',
			fn: function () {
				// getRootService().update().then(()=>{
				//     let selected = dataService.getSelected();
				//     UpstreamItemSplitService.showSplitDialog(selected);
				// });
				throw new Error('todo');
			},
			disabled: () => {
				return !dataService.hasSelection();
			},
		};
	}

	public static AddCopyButton(containerLink: IGridContainerLink<IPpsUpstreamItemEntity>, dataService: IPpsUpstreamItemDataService) {
		containerLink.uiAddOns.toolbar.addItems(PpsUpstreamItemButtonFactory.getCopyBtnConfig(dataService));
	}

	public static AddFilterButton(containerLink: IGridContainerLink<IPpsUpstreamItemEntity>, dataService: IPpsUpstreamItemDataService) {
		containerLink.uiAddOns.toolbar.addItems(PpsUpstreamItemButtonFactory.getFilterBtnConfig(dataService));
	}

	public static AddSplitButton(containerLink: IGridContainerLink<IPpsUpstreamItemEntity>, dataService: IPpsUpstreamItemDataService) {
		containerLink.uiAddOns.toolbar.addItems(PpsUpstreamItemButtonFactory.getSplitBtnConfig(dataService));
	}
}