/*
 * Copyright(c) RIB Software GmbH
 */

import _ from 'lodash';
import { Injectable, InjectionToken } from '@angular/core';
import { ItemType } from '@libs/ui/common';
import { ServiceLocator } from '@libs/platform/common';
import { IHsqCheckList2FormEntity } from '@libs/hsqe/interfaces';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { BasicsSharedUserFormService, UserFormDisplayMode } from '@libs/basics/shared';
import { HsqeChecklistDataService } from '../services/hsqe-checklist-data.service';
import { HsqeChecklistFormDataService } from '../services/hsqe-checklist-form-data.service';

export const HSQE_CHECKLIST_FORM_BEHAVIOR_TOKEN = new InjectionToken<HsqeChecklistFormBehavior>('hsqeCheckFormGridBehavior');

@Injectable({
	providedIn: 'root',
})
export class HsqeChecklistFormBehavior implements IEntityContainerBehavior<IGridContainerLink<IHsqCheckList2FormEntity>, IHsqCheckList2FormEntity> {
	public constructor(
		private dataService: HsqeChecklistFormDataService,
		private parentDataService: HsqeChecklistDataService,
	) {}

	private get selectedItem() {
		return this.dataService.getSelectedEntity();
	}

	private get parentSelectedItem() {
		return this.parentDataService.getSelectedEntity();
	}

	private showUserForm(displayMode: UserFormDisplayMode) {
		if (!this.selectedItem || !this.parentSelectedItem) {
			return undefined;
		}
		const userFormService = ServiceLocator.injector.get(BasicsSharedUserFormService);
		return userFormService.show({
			formId: this.selectedItem.FormFk,
			formDataId: this.selectedItem.Id,
			contextId: this.parentSelectedItem.Id,
			isReadonly: false,
			modal: true,
			editable: true,
			displayMode: displayMode,
		});
	}

	public onCreate(containerLink: IGridContainerLink<IHsqCheckList2FormEntity>) {
		containerLink.uiAddOns.toolbar.addItems([
			{
				id: 't100',
				caption: { text: 'Preview' },
				sort: 201,
				hideItem: false,
				type: ItemType.Item,
				iconClass: 'tlb-icons ico-preview-form',
				fn: () => {
					// TODO: Has this function been fully implemented?
					if (this.selectedItem?.FormFk) {
						const userFormService = ServiceLocator.injector.get(BasicsSharedUserFormService);
						userFormService.preview(this.selectedItem.FormFk);
					}
				},
				disabled: () => {
					const selected = this.dataService.getSelectedEntity();
					return _.isEmpty(selected) || typeof selected.BasFormDataFk !== 'number';
				},
			},
			{
				id: 't101',
				caption: { key: 'basics.userform.editBy' },
				sort: 201,
				type: ItemType.DropdownBtn,
				iconClass: 'tlb-icons ico-preview-data',
				disabled: () => {
					// TODO: Does the IsReadonlyStatus field exist? || this.parentSelectedItem.IsReadonlyStatus
					return _.isEmpty(this.selectedItem);
				},
				list: {
					showImages: true,
					showTitles: true,
					cssClass: 'dropdown-menu-right',
					items: [
						{
							id: 't-navigation-new-window',
							type: ItemType.Item,
							caption: { key: 'basics.userform.newWindow', text: 'New Window' },
							iconClass: 'tlb-icons ico-preview-data',
							fn: () => {
								this.showUserForm(UserFormDisplayMode.Window);
							},
						},
						{
							id: 't-navigation-pop-window',
							type: ItemType.Item,
							caption: { key: 'basics.userform.popWindow', text: 'Pop Window' },
							iconClass: 'tlb-icons ico-preview-data',
							fn: () => {
								this.showUserForm(UserFormDisplayMode.Dialog);
							},
						},
					],
				},
			},
		]);
	}
}
