/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ICosGroupEntity } from '../model/models';
import { ItemType } from '@libs/ui/common';
import { ServiceLocator } from '@libs/platform/common';
import { ConstructionSystemMasterGroupDataService } from '../services/construction-system-master-group-data.service';
import { ConstructionSystemMasterHeaderDataService } from '../services/construction-system-master-header-data.service';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterGroupBehavior implements IEntityContainerBehavior<IGridContainerLink<ICosGroupEntity>, ICosGroupEntity> {
	private readonly groupDataService = inject(ConstructionSystemMasterGroupDataService);

	public onCreate(containerLink: IGridContainerLink<ICosGroupEntity>): void {
		containerLink.uiAddOns.toolbar.addItemsAtId(
			[
				{
					id: 't11',
					sort: 110,
					caption: 'cloud.common.toolbarFilter',
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-filter-off',
					fn: async () => {
						const checkedCosGroups = this.groupDataService.flatList().filter((value) => value.IsChecked);
						checkedCosGroups.forEach((entity) => {
							entity.IsChecked = false;
							this.groupDataService.entitiesUpdated(entity);
						});
						this.groupDataService.clearFilteredGroupIds();

						const cosHeaderDataService = ServiceLocator.injector.get(ConstructionSystemMasterHeaderDataService);
						await cosHeaderDataService.refreshAll();
					}
				},
				{
					id: 't12',
					sort: 120,
					caption: 'cloud.common.toolbarSelectionMode',
					type: ItemType.Check,
					iconClass: 'tlb-icons ico-selection-multi',
					fn: function toogleSelectionMode() {
						// todo-allen: Selection Mode change
					},
				},
			],
			EntityContainerCommand.Settings,
		);

		this.groupDataService.refreshAll().then();
	}
}
