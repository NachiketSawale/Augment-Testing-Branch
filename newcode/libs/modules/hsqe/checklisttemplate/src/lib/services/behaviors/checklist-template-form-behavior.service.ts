/*
 * Copyright(c) RIB Software GmbH
 */

import _ from 'lodash';
import { Injectable } from '@angular/core';
import { ItemType } from '@libs/ui/common';
import { ServiceLocator } from '@libs/platform/common';
import { IHsqChkListTemplate2FormEntity } from '@libs/hsqe/interfaces';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { BasicsSharedUserFormService, Rubric, UserFormDisplayMode } from '@libs/basics/shared';
import { ChecklistTemplateFormDataService } from '../checklist-template-form-data.service';
import { CheckListTemplateHeaderDataService } from '../checklist-template-header-data.service';

@Injectable({
	providedIn: 'root',
})
export class ChecklistTemplate2FormBehavior implements IEntityContainerBehavior<IGridContainerLink<IHsqChkListTemplate2FormEntity>, IHsqChkListTemplate2FormEntity> {
	public constructor(
		private dataService: ChecklistTemplateFormDataService,
		private parentDataService: CheckListTemplateHeaderDataService,
	) {}

	private get selectedItem() {
		return this.dataService.getSelectedEntity();
	}

	private get parentSelectedItem() {
		return this.parentDataService.getSelectedEntity();
	}

	private async onFormDataSaved() {
		this.dataService.updateTemporaryCheckListId = true;
		if (this.parentSelectedItem) {
			await this.dataService.load({id: 0, pKey1: this.parentSelectedItem.Id});
		}
	}

	private async previewForm() {
		if (this.selectedItem && this.selectedItem.Id > 0 && this.selectedItem.BasFormFk !== 0) {
			const userFormService = ServiceLocator.injector.get(BasicsSharedUserFormService);
			if (this.selectedItem.Version === 0) {
				await this.parentDataService.save();
			}
			await userFormService.preview(this.selectedItem.BasFormFk);
		}
	}

	private async showUserForm(displayMode: UserFormDisplayMode) {
		if (!this.selectedItem || !this.parentSelectedItem) {
			return undefined;
		}
		this.dataService.updateTemporaryCheckListId = false;
		const userFormService = ServiceLocator.injector.get(BasicsSharedUserFormService);
		const value = await userFormService.show({
			formId: this.selectedItem.BasFormFk,
			formDataId: this.selectedItem.BasFormDataFk ?? undefined,
			contextId: this.parentSelectedItem.Id,
			tempContextId: this.selectedItem.TemporaryCheckListId ?? undefined,
			rubricFk: Rubric.CheckListTemplate,
			intersectionId: this.selectedItem.Id,
			isReadonly: false,
			modal: true,
			editable: true,
			displayMode: displayMode,
		});
		value.registerFormSaved(this.onFormDataSaved);
	}

	public onCreate(containerLink: IGridContainerLink<IHsqChkListTemplate2FormEntity>) {
		containerLink.uiAddOns.toolbar.addItems([
			{
				id: 't100',
				caption: { key: 'basics.common.preview.button.previewCaption', text: 'Preview' },
				sort: 201,
				hideItem: false,
				type: ItemType.Item,
				iconClass: 'tlb-icons ico-preview-form',
				fn: this.previewForm,
				disabled: () => {
					const selected = this.dataService.getSelectedEntity();
					return _.isEmpty(selected) || typeof selected.BasFormFk !== 'number';
				},
			},
			{
				id: 't101',
				caption: { key: 'basics.userform.editBy' },
				sort: 201,
				type: ItemType.DropdownBtn,
				iconClass: 'tlb-icons ico-preview-data',
				disabled: () => {
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
