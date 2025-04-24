/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { IReport2GroupEntity } from '../model/entities/report-2group-entity.interface';
import { IInputDialogOptions, IYesNoDialogOptions, ItemType, StandardDialogButtonId, UiCommonInputDialogService, UiCommonMessageBoxService } from '@libs/ui/common';

import { BasicsConfigReportXGroupDataService } from '../services/basics-config-report-xgroup-data.service';
import { PlatformHttpService } from '@libs/platform/common';


@Injectable({
	providedIn: 'root'
})

/**
 * basics-config report xgroup behavior service.
 */
export class BasicsConfigReportXGroupBehavior implements IEntityContainerBehavior<IGridContainerLink<IReport2GroupEntity>, IReport2GroupEntity> {

	/**
	 * Used to inject wizard group data service.
	 */
	private dataService: BasicsConfigReportXGroupDataService = inject(BasicsConfigReportXGroupDataService);

	/**
	 * Used to inject input dialog service.
	 */
	private readonly inputDialogService = inject(UiCommonInputDialogService);

	/**
	 * Used to inject messagebox service.
	 */
	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	/**
	 * Used to inject http client.
	 */
	protected readonly http = inject(PlatformHttpService);



	/**
	 * This method is invoked right when the container component
	 * is being created.
	 * @param {IGridContainerLink<IReport2GroupEntity>} containerLink 
	 * A reference to the facilities of the container
	 */
	public onCreate(containerLink: IGridContainerLink<IReport2GroupEntity>): void {

		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'basics.config.createDesc' },
				hideItem: false,
				iconClass: 'tlb-icons ico-right-add',
				id: 't1',
				disabled: () => {
					return !this.dataService.hasSelection() || this.dataService.getSelection()[0].Version === 0 || this.dataService.getSelection()[0].AccessRightDescriptor !== null;
				},
				fn: () => {
					this.openInputDialog();
				},
				type: ItemType.Item,
				sort: 240
			},
			{
				caption: { key: 'basics.config.deleteDesc' },
				hideItem: false,
				iconClass: 'tlb-icons ico-right-delete',
				id: 't2',
				disabled: () => {
					return !this.dataService.hasSelection() || this.dataService.getSelection()[0].Version === 0 || this.dataService.getSelection()[0].AccessRightDescriptor === null;
				},
				fn: () => {
					this.openYesNoDialog();
				},
				type: ItemType.Item,
				sort: 241
			},
		]);
	}

	/**
	 * Used to display input dialog when click on create access
	 * right descriptor icon to add access right descriptor name.
	 */
	private async openInputDialog() {
		const options: IInputDialogOptions = {
			headerText: 'basics.config.enterAccessRightDescriptorName',
			placeholder: 'basics.config.plsEnterName',
			maxLength: 64,
			pattern: '/^[0-9]+$/'
		};

		const result = await this.inputDialogService.showInputDialog(options);

		if (result && result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
			this.createAccessRightDescriptor(result.value);
		}
	}

	/**
	 * Used to display yes no dialog when click on delete access right
	 * descriptor icon.
	 */
	private async openYesNoDialog() {

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
	}


	/**
	 * Used to create access right descriptor.
	 * @param {string} accessName access right descriptor name
	 */
	private createAccessRightDescriptor(accessName: string) {
		const selectedEntity = this.dataService.getSelection()[0].Id;

		const data = {
			ReportXGroupId: selectedEntity,
			DescriptorName: accessName
		};

		this.http.post$<IReport2GroupEntity>('basics/config/reportXgroup/createAsscessRightDesc', data).subscribe((data) => {

			const selectedObject = this.dataService.getSelection()[0];
			selectedObject.AccessRightDescriptorFk = data.AccessRightDescriptorFk;
			selectedObject.AccessRightDescriptor = data.AccessRightDescriptor;
			this.dataService.setModified(selectedObject);

		});
	}


	/**
	 * Used to delete access right descriptor name.
	 */
	private deleteAccessRightDescriptor() {
		const selectedId = this.dataService.getSelection()[0].Id;

		const data = {
			ReportXGroupId: selectedId
		};

		this.http.post$<IReport2GroupEntity>('basics/config/reportXgroup/deleteAsscessRightDesc', data).subscribe((data) => {

			const selectedObject = this.dataService.getSelection()[0];
			selectedObject.AccessRightDescriptorFk = data.AccessRightDescriptorFk;
			//TODO: gridRefresh implementation not present
			// this.dataService.gridRefresh();

		});
	}
}