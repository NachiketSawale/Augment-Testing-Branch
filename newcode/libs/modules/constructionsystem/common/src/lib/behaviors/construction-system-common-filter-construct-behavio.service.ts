import { Injectable } from '@angular/core';
import { IEntityIdentification } from '@libs/platform/common';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ItemType } from '@libs/ui/common';


@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemCommonFilterConstructBehavioService<T extends IEntityIdentification> implements IEntityContainerBehavior<IGridContainerLink<T>, T> {
	public onCreate(containerLink: IGridContainerLink<T>) {
		containerLink.uiAddOns.toolbar.addItemsAtId([
			{
				id: 't11',
				sort: 110,
				caption: 'cloud.common.toolbarFilter',
				value: true,
				hideItem: false,
				type: ItemType.Check,
				fn: info => {

				},
			},
			{
				id: 't12',
				iconClass: 'tlb-icons ico-selection-multi',
				caption: 'cloud.common.toolbarSelectionMode',

				sort: 120,
				hideItem: false,
				type: ItemType.Check,
				fn: info => {

				}
			}
		], EntityContainerCommand.Settings);
		containerLink.uiAddOns.toolbar.deleteItems('navigationGroup');
	}
}