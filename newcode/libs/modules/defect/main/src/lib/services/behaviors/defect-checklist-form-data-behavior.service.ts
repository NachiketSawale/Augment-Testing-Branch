/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ItemType } from '@libs/ui/common';
import { DefectChecklistFormDataService } from '../defect-checklist-form-data.service';
import _ from 'lodash';
import { ServiceLocator } from '@libs/platform/common';
import { BasicsSharedUserFormService } from '@libs/basics/shared';
import { IHsqCheckList2FormEntity } from '@libs/hsqe/interfaces';

@Injectable({
	providedIn: 'root',
})
export class DefectChecklistFormDataBehavior implements IEntityContainerBehavior<IGridContainerLink<IHsqCheckList2FormEntity>, IHsqCheckList2FormEntity> {
	public constructor(private dataService: DefectChecklistFormDataService) {}

	public onCreate(containerLink: IGridContainerLink<IHsqCheckList2FormEntity>) {
		containerLink.uiAddOns.toolbar.deleteItems([EntityContainerCommand.CreateRecord, EntityContainerCommand.DeleteRecord]);

		containerLink.uiAddOns.toolbar.addItems({
			id: 't100',
			caption: { text: 'Preview' },
			sort: 201,
			hideItem: false,
			type: ItemType.Item,
			iconClass: 'tlb-icons ico-preview-form',
			fn: () => {
				const selectedItem = this.dataService.getSelectedEntity();
				if (selectedItem && selectedItem.FormFk) {
					const userFormService = ServiceLocator.injector.get(BasicsSharedUserFormService);
					userFormService.preview(selectedItem.FormFk);
				}
			},
			disabled: () => {
				const selected = this.dataService.getSelectedEntity();
				return _.isEmpty(selected) || typeof selected.BasFormDataFk !== 'number';
			},
		});

		console.warn(containerLink.uiAddOns.toolbar);
	}
}
