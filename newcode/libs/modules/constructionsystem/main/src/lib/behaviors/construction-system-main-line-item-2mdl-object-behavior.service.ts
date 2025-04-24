/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ICheckMenuItem, ItemType } from '@libs/ui/common';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ConstructionSystemMainLineItem2MdlObjectDataService } from '../services/construction-system-main-line-item-2mdl-object-data.service';
import { ConstructionSystemHighLightToggleService } from '../services/construction-system-high-light-toggle.service';
import { ConstructionSystemMainHighlightOption } from '../model/enums/cos-main-highlight-option.enum';
import { IEstLineItem2MdlObjectEntity } from '@libs/estimate/interfaces';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainLineItem2MdlObjectBehavior implements IEntityContainerBehavior<IGridContainerLink<IEstLineItem2MdlObjectEntity>, IEstLineItem2MdlObjectEntity> {
	private readonly highlightService = inject(ConstructionSystemHighLightToggleService);

	public constructor(private dataService: ConstructionSystemMainLineItem2MdlObjectDataService) {}

	public onCreate(containerLink: IGridContainerLink<IEstLineItem2MdlObjectEntity>) {
		containerLink.uiAddOns.toolbar.deleteItems([EntityContainerCommand.CreateRecord, EntityContainerCommand.CreateSubRecord, EntityContainerCommand.DeleteRecord]);

		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'constructionsystem.main.toggleHighlight' },
				hideItem: false,
				iconClass: 'tlb-icons ico-view-select',
				id: 't1000',
				sort: 2,
				type: ItemType.Check,
				value: this.highlightService.isLineItem(),
				fn: (info) => {
					const item = info.item as ICheckMenuItem;
					if (item.value) {
						const selectedItems = this.dataService.getSelection();
						this.highlightService.toggleHighlight(selectedItems, ConstructionSystemMainHighlightOption.LineItem);
					} else {
						this.highlightService.toggleHighlight([], null);
					}
				},
			},
		]);
	}
}
