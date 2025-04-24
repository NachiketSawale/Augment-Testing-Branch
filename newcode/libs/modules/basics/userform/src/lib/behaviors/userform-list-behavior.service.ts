/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { BasicsUserformMainDataService } from '../services/userform-main-data.service';
import { ServiceLocator } from '@libs/platform/common';
import { ItemType } from '@libs/ui/common';
import { BasicsSharedUserFormService } from '@libs/basics/shared';
import { IFormEntity } from '../model/entities/form-entity.interface';

/**
 * Business partner header behavior
 */
@Injectable({
	providedIn: 'root'
})
export class BasicUserformMainHeaderGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IFormEntity>, IFormEntity> {
	private dataService: BasicsUserformMainDataService;

	public constructor() {
		this.dataService = inject(BasicsUserformMainDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IFormEntity>) {
		containerLink.uiAddOns.toolbar.addItems([
			{
				id: 'preview',
				caption: {
					text: 'Preview',
					key: 'basics.common.preview.button.previewCaption'
				},
				type: ItemType.Item,
				hideItem: false,
				sort: 99,
				cssClass: 'tlb-icons ico-preview-form',
				fn: () => {
					const selectedItem = this.dataService.getSelectedEntity();
					if (selectedItem) {
						const userFormService = ServiceLocator.injector.get(BasicsSharedUserFormService);
						userFormService.preview(selectedItem.Id);
					}
				},
				disabled: () => {
					return !this.dataService.hasSelection();
				}
			}
		]);
	}

}