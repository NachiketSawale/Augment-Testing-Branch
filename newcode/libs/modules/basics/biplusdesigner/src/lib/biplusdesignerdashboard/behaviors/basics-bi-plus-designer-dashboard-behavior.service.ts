/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ICustomDialogOptions, InsertPosition, ItemType, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { BasicsBiPlusDesignerImportDialogComponent } from '../components/basics-biplusdesigner-import-dialog/basics-biplusdesigner-import-dialog.component';
import { getDashboardImportDialogDataToken } from '../model/basics-bi-plus-designer-dashboard-import.interface';
import { IDashboardEntity } from '../model/entities/dashboard-entity.interface';
@Injectable({
	providedIn: 'root',
})
export class BasicsBiPlusDesignerDashboardBehavior implements IEntityContainerBehavior<IGridContainerLink<IDashboardEntity>, IDashboardEntity> {
	/**
	 * inject UiCommonDialogService
	 */
	public modalDialogService = inject(UiCommonDialogService);

	public onCreate(containerLink: IGridContainerLink<IDashboardEntity>): void {
		this.updateToolMenuItem(containerLink);
	}

	/**
	 * Update tool menu item in container section
	 *
	 * @param {IGridContainerLink<IDashboardEntity>}containerLink
	 */
	public updateToolMenuItem(containerLink: IGridContainerLink<IDashboardEntity>) {
		containerLink.uiAddOns.toolbar.deleteItems(EntityContainerCommand.DeleteRecord);
		containerLink.uiAddOns.toolbar.addItemsAtId(
			{
				type: ItemType.Sublist,
				list: {
					items: [
						{
							caption: { key: 'basics.biplusdesigner.toolbarSyncBtn' },
							iconClass: 'tlb-icons ico-refresh',
							id: 'syncdashboards',

							fn: () => {
								this.openModalDashboardImportDialog();
							},
							sort: 0,
							permission: '#c',
							type: ItemType.Item,
						},
					],
				},
				sort: 0,
			},
			EntityContainerCommand.CreateRecord,
			InsertPosition.Instead,
		);
	}

	/**
	 * This Function used for open the Dashboard Import modal dialog
	 */
	public async openModalDashboardImportDialog() {
		const buttons = [
			{ id: 'execute', caption: { key: 'basics.biplusdesigner.import.btnExecuteImport' } },
			{ id: StandardDialogButtonId.Cancel, caption: { key: 'basics.biplusdesigner.import.btnCancel' } },
		];
		const modalOptions: ICustomDialogOptions<{ text: string }, BasicsBiPlusDesignerImportDialogComponent> = {
			width: '600px',
			resizeable: true,
			backdrop: false,
			buttons: buttons,
			headerText: { key: 'basics.biplusdesigner.import.dialogTitle' },
			id: 'ImportDashboard',
			bodyComponent: BasicsBiPlusDesignerImportDialogComponent,
			bodyProviders: [{ provide: getDashboardImportDialogDataToken(), useValue: buttons }],
		};
		await this.modalDialogService.show(modalOptions);
	}
}
