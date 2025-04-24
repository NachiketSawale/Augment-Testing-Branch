/*
 * Copyright(c) RIB Software GmbH
 */

import { Subscription } from 'rxjs';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FieldType, IDialog, IGridConfiguration, IMenuItemsList, ItemType, UiCommonMessageBoxService } from '@libs/ui/common';
import { CHARACTERISTIC_BULK_EDITOR_DIALOG_OPTIONS_TOKEN } from '../../model/interfaces/characteristic-bulk-editor-dialog.interface';
import { ICharacteristicDataEntity, ICharacteristicEntity } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataLayoutFieldService } from '../../../characteristic-data/services/layout/basics-shared-characteristic-data-layout-field.service';
import { BasicsSharedCharacteristicBulkEditorDialogDataService } from '../../services/basics-characteristic-bulk-editor-dialog-data.service';
import { ICharacteristicBulkEditorParams } from '../../model/interfaces/characteristic-bulk-editor-params.interface';

@Component({
	selector: 'basics-shared-characteristic-bulk-editor',
	templateUrl: './characteristic-bulk-editor.component.html',
	styleUrls: ['./characteristic-bulk-editor.component.scss'],
})
export class BasicsSharedCharacteristicBulkEditorComponent implements OnInit, OnDestroy {
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly dataService = inject(BasicsSharedCharacteristicBulkEditorDialogDataService);
	private readonly fieldService = inject(BasicsSharedCharacteristicDataLayoutFieldService);
	private readonly bulkEditorOptions = inject(CHARACTERISTIC_BULK_EDITOR_DIALOG_OPTIONS_TOKEN);
	private subscriptionListChanged: Subscription;

	/**
	 * Is loading
	 */
	public isLoading = false;

	public constructor() {
		this.subscriptionListChanged = this.dataService.listChanged$.subscribe({
			next: (list) => {
				this.refreshData(list);
			},
		});
	}

	public ngOnInit() {
		this.isLoading = true;
		this.initConfig();
		this.isLoading = false;
	}

	/**
	 * Holds the column configuration used to render the grid
	 */
	public config: IGridConfiguration<ICharacteristicDataEntity> = {
		uuid: '',
		columns: [],
		items: [],
	};

	private initConfig() {
		this.config = {
			uuid: '1cf32e710ad84d299c55ca404083b72e',
			skipPermissionCheck: true,
			items: [],
			columns: [
				{
					id: 'CharacteristicFk',
					model: 'CharacteristicFk',
					type: FieldType.Lookup,
					label: { text: 'Code', key: 'basics.characteristic.entityCode' },
					lookupOptions: this.fieldService.createCharacteristicFKLookup({
						sectionId: this.bulkEditorOptions.sectionId,
						entityListFilter: () => {
							return this.dataService.getValidEntities();
						},
						selectionExceptFirstHandle: (selectionExceptFirst: ICharacteristicEntity[]) => {
							// create multiple entities after dialog finish
							this.dataService.createItems(selectionExceptFirst);
						},
					}),
					sortable: true,
					visible: true,
					readonly: false,
				},
				{
					id: 'Description',
					model: 'Description',
					type: FieldType.Text,
					label: { text: 'Description', key: 'basics.common.Description' },
					sortable: true,
					visible: true,
					readonly: true,
				},
				{
					id: 'ValueText',
					model: 'ValueText',
					type: FieldType.Dynamic,
					overload: (ctx) => {
						return this.fieldService.createValueTextOverload(ctx);
					},
					label: { text: 'Value', key: 'basics.characteristic.entityValueText' },
					sortable: true,
					visible: true,
					readonly: false,
				},
			],
		};
	}

	private refreshData(items: ICharacteristicDataEntity[]) {
		this.config = {
			...this.config,
			items: [...items],
		};
	}

	/**
	 * Returns toolbar menu list data
	 *
	 * @returns { IMenuItemsList<IDialog> | undefined} Tools data.
	 */
	protected tools: IMenuItemsList<IDialog> = {
		cssClass: 'tools',
		showImages: true,
		showTitles: true,
		items: [
			{
				id: 'create',
				type: ItemType.Item,
				caption: 'cloud.common.taskBarNewRecord',
				iconClass: 'tlb-icons ico-rec-new',
				fn: () => {
					this.dataService.createItem();
				},
			},
			{
				id: 'delete',
				caption: 'cloud.common.taskBarDeleteRecord',
				iconClass: 'tlb-icons ico-rec-delete',
				type: ItemType.Item,
				fn: () => {
					this.dataService.deleteSelection();
				},
			},
		],
	};

	/**
	 * Used to pass the selected data from the grid to the data service
	 *
	 * @param selectedRows.
	 */
	public onSelectionChanged(selectedRows: ICharacteristicDataEntity[]) {
		this.dataService.selectItems(selectedRows);
	}

	public async onOkBtnClicked(params: ICharacteristicBulkEditorParams) {
		this.isLoading = true;
		const result = await this.dataService.setCharacteristics(params);
		this.isLoading = false;
		await this.messageBoxService.showMsgBox('basics.characteristic.successMessage', 'basics.common.alert.info', 'ico-info', 'message', false);
		return result.objectsCount > 0;
	}

	public okBtnDisabled() {
		return this.dataService.getValidEntities().length === 0;
	}

	public ngOnDestroy() {
		this.subscriptionListChanged.unsubscribe();
	}
}
