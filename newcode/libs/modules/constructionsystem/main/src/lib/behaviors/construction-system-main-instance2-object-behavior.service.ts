/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IInstance2ObjectEntity } from '@libs/constructionsystem/shared';
import { ICheckMenuItem, ItemType } from '@libs/ui/common';
import { ConstructionSystemHighLightToggleService } from '../services/construction-system-high-light-toggle.service';
import { ServiceLocator } from '@libs/platform/common';
import { ConstructionSystemMainInstance2ObjectDataService } from '../services/construction-system-main-instance2-object-data.service';
import { ConstructionSystemMainHighlightOption } from '../model/enums/cos-main-highlight-option.enum';
export const CONSTRUCTION_SYSTEM_MAIN_INSTANCE2_OBJECT_BEHAVIOR_TOKEN = new InjectionToken<ConstructionSystemMainInstance2ObjectBehavior>('constructionSystemMainInstance2ObjectBehavior');

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainInstance2ObjectBehavior implements IEntityContainerBehavior<IGridContainerLink<IInstance2ObjectEntity>, IInstance2ObjectEntity> {
	private readonly highlightService = ServiceLocator.injector.get(ConstructionSystemHighLightToggleService);
	private readonly dataService = ServiceLocator.injector.get(ConstructionSystemMainInstance2ObjectDataService);

	public onCreate(containerLink: IGridContainerLink<IInstance2ObjectEntity>) {
		containerLink.uiAddOns.toolbar.deleteItems('navigationGroup');
		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'constructionsystem.main.toggleHighlight' },
				hideItem: false,
				iconClass: 'tlb-icons ico-view-select',
				id: 't1000',
				fn: (info) => {
					const item = info.item as ICheckMenuItem;
					if (item.value) {
						this.highlightService.toggleHighlight(this.dataService.getList(), ConstructionSystemMainHighlightOption.AssignObject);
					} else {
						this.highlightService.toggleHighlight([], null);
					}
				},
				disabled: () => {
					return this.dataService.canDelete();
				},
				sort: 202,
				type: ItemType.Check,
				value: this.highlightService.isAssignObject(),
			},
		]);
	}
}

/// todo modelViewerCompositeModelObjectSelectionService.registerSelectionChanged(handleModelViewerObjectSelection);
