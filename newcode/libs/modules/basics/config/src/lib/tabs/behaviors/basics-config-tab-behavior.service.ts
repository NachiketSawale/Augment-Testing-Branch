/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IInputDialogOptions, IYesNoDialogOptions, ItemType, StandardDialogButtonId, UiCommonInputDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { BasicsConfigTabDataService } from '../services/basics-config-tab-data.service';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { IModuleTabEntity } from '../model/entities/module-tab-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class BasicsConfigTabBehavior implements IEntityContainerBehavior<IGridContainerLink<IModuleTabEntity>, IModuleTabEntity> {
	/**
	 * BasicsConfigTabDataService instance.
	 */
	private dataService: BasicsConfigTabDataService = inject(BasicsConfigTabDataService);

	/**
	 * UiCommonInputDialogService instance.
	 */
	private readonly inputDialogService = inject(UiCommonInputDialogService);

	/**
	 * HttpClient instance
	 */
	private readonly http = inject(HttpClient);

	/**
	 * UiCommonMessageBoxService instance.
	 */
	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	/**
	 * PlatformConfigurationService instance.
	 */
	private readonly configurationService = inject(PlatformConfigurationService);

	/**
	 * It will update toolbar when container initialize.
	 * @param containerLink
	 */
	public onCreate(containerLink: IGridContainerLink<IModuleTabEntity>): void {
		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'basics.config.createDesc' },
				hideItem: false,
				iconClass: 'tlb-icons ico-right-add',
				id: 't1',
				disabled: () => {
					return !this.dataService.hasSelection() || this.dataService.getSelection()[0].Version === 0 || this.dataService.getSelection()[0].AccessRightDescriptor !== null;
				},
				fn: async () => {
					//Get these values from translation
					const options: IInputDialogOptions = {
						headerText: 'basics.config.enterAccessRightDescriptorName',
						placeholder: 'basics.config.plsEnterName',
						width: '30%',
						maxLength: 64,
						pattern: '/^[0-9]+$/',
					};
					const result = await this.inputDialogService.showInputDialog(options);
					if (result && result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
						this.createAccessRightDescriptor(result.value);
					}
				},
				type: ItemType.Item,
			},
			{
				caption: { key: 'basics.config.deleteDesc' },
				hideItem: false,
				iconClass: 'tlb-icons ico-right-delete',
				id: 't1',
				disabled: () => {
					return !this.dataService.hasSelection() || this.dataService.getSelection()[0].Version === 0 || this.dataService.getSelection()[0].AccessRightDescriptor === null;
				},
				fn: async () => {
					const options: IYesNoDialogOptions = {
						defaultButtonId: StandardDialogButtonId.Yes,
						id: 'YesNoModal',
						dontShowAgain: true,
						showCancelButton: true,
						headerText: 'basics.config.yesNoDialogTitle',
						bodyText: 'basics.config.yesNoDialogQuestion',
					};
					const result = await this.messageBoxService.showYesNoDialog(options);
					if (result && result.closingButtonId === StandardDialogButtonId.Yes) {
						this.deleteAccessRightDescriptor();
					}
				},
				type: ItemType.Item,
			},
			{
				caption: { key: 'cloud.common.bulkEditor.title' },
				hideItem: false,
				iconClass: 'type-icons ico-construction51',
				id: 't14',
				fn: () => {
					throw new Error('This method is not implemented');
				},
				sort: 220,
				type: ItemType.Item,
			},
		]);
	}

	/**
	 * Create access right descriptor for tabs.
	 * @param accessName{string} descriptor name.
	 */
	private async createAccessRightDescriptor(accessName: string): Promise<void> {
		const selectedEntity = this.dataService.getSelection()[0].Id;
		const data = {
			TabId: selectedEntity,
			DescriptorName: accessName,
		};

		this.http.post(this.configurationService.webApiBaseUrl + 'basics/config/tab/createAsscessRightDesc', data).subscribe((data: IModuleTabEntity) => {
			const selectedObject = this.dataService.getSelection()[0];
			selectedObject.AccessRightDescriptorFk = data.AccessRightDescriptorFk;
			selectedObject.AccessRightDescriptor = data.AccessRightDescriptor;
			this.dataService.setModified(selectedObject);
		});
	}

	/**
	 * Delete Access Right Descriptor.
	 */
	private async deleteAccessRightDescriptor(): Promise<void> {
		const selectedId = this.dataService.getSelection()[0].Id;
		const data = {
			TabId: selectedId,
		};

		this.http.post(this.configurationService.webApiBaseUrl + 'basics/config/tab/deleteAsscessRightDesc', data).subscribe((data: IModuleTabEntity) => {
			const selectedObject = this.dataService.getSelection()[0];
			//selectedObject.Version = data.Version;
			selectedObject.AccessRightDescriptor = data.AccessRightDescriptor;
			this.dataService.setModified(selectedObject);
			//TODO call dataservice grid refresh.
		});
	}
}
