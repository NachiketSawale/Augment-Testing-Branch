/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IReportGroupEntity } from '../model/entities/report-group-entity.interface';

import { IInputDialogOptions, IYesNoDialogOptions, ItemType, StandardDialogButtonId, UiCommonInputDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformHttpService } from '@libs/platform/common';
import { BasicsConfigReportGroupDataService } from '../services/basics-config-report-group-data.service';

@Injectable({
	providedIn: 'root',
})
export class BasicsConfigReportGroupBehavior implements IEntityContainerBehavior<IGridContainerLink<IReportGroupEntity>, IReportGroupEntity> {
	/**
	 * BasicsConfigTabDataService instance.
	 */
	private dataService: BasicsConfigReportGroupDataService = inject(BasicsConfigReportGroupDataService);

	/**
	 * UiCommonInputDialogService instance.
	 */
	private readonly inputDialogService = inject(UiCommonInputDialogService);

	/**
	 * HttpClient instance
	 */
	private readonly http = inject(PlatformHttpService);

	/**
	 * UiCommonMessageBoxService instance.
	 */
	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	/**
	 * It will update toolbar when container initialize.
	 * @param containerLink
	 */
	public onCreate(containerLink: IGridContainerLink<IReportGroupEntity>): void {
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
			}
		]);
	}

	/**
	 * Create access right descriptor for tabs.
	 * @param accessName{string} descriptor name.
	 */
	private async createAccessRightDescriptor(accessName: string): Promise<void> {
		const selectedEntity = this.dataService.getSelection()[0].Id;
		const data = {
			ReportGroupId: selectedEntity,
			DescriptorName: accessName,
		};

		this.http.post$<IReportGroupEntity>('basics/config/reportgroup/createaccessrightdesc', data).subscribe((data) => {
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
			ReportGroupId: selectedId,
		};

		this.http.post$<IReportGroupEntity>('basics/config/reportgroup/deleteaccessrightdesc', data).subscribe((data) => {
			const selectedObject = this.dataService.getSelection()[0];
			//selectedObject.Version = data.Version;
			selectedObject.AccessRightDescriptor = data.AccessRightDescriptor;
			this.dataService.setModified(selectedObject);
			//TODO call dataservice grid refresh.
		});
	}
}
