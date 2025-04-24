/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable, inject } from '@angular/core';

import { ColumnDef } from '../../../grid';
import { IEditorDialogResult } from '../../base';
import { FieldType, createLookup } from '../../../model/fields';
import { IGridConfigDialogOptions } from '../model/grid-config-dialog-options.interface';
import { UiCommonGridConfigUserLabelLookupService } from './grid-config-user-label-lookup.service';
import { IGridConfigDialogColumnsData } from '../model/grid-config-dialog-columns-entity.interface';
import { IListSelectionDialogOptions, UiCommonListSelectionDialogService } from '../../list-selection';

/**
 * This service displays grid config modal dialog.
 *
 * @group Dialogs
 */
@Injectable({
	providedIn: 'root',
})
export class UiCommonGridConfigDialogService {
	/**
	 * Service displays dialog.
	 */
	private readonly listSelectionDialogService = inject(UiCommonListSelectionDialogService);

	/**
	 * Displays a custom dialog box.
	 *
	 * @typeParam TItem The value type to edit in the dialog.
	 *
	 * @param options An object that contains configuration options for the dialog box.
	 *
	 * @returns Result of the dialog.
	 */
	public show<TItem extends IGridConfigDialogColumnsData>(options: IGridConfigDialogOptions<TItem>): Promise<IEditorDialogResult<TItem[]>> | undefined {
		const selectedColumns = this.getVisibleColumns<TItem>();

		if (options.additionalSelectedGridColumns) {
			selectedColumns.push(...options.additionalSelectedGridColumns);
		}

		const dialogOptions: IListSelectionDialogOptions<TItem> = {
			...{
				availableGridConfig: {
					columns: this.getAvailableColumns(),
				},
				selectedGridConfig: {
					columns: selectedColumns,
					entityRuntimeData: {
						getValidationErrors: (entity: TItem) => [],
						getInvalidEntities: () => [],
						hasValidationErrors: () => false,
						isEntityReadOnly: (entity: TItem) => false,
						getEntityReadOnlyFields: (entity: TItem) => {
							const readonly = entity.readonly ?? [];
							const element = readonly.find((ite) => {
								return ite.field === 'userLabelName';
							});
							if (entity.labelCode) {
								if (!element) {
									readonly.push({
										field: 'userLabelName',
										readOnly: true,
									});
								} else {
									element.readOnly = true;
								}
							} else {
								if (element) {
									element.readOnly = false;
								}
							}
							
							return readonly;
						},
						getEntityReadonlyRuntimeData: (entity: TItem) => null,
					},
				},
			},
			...options,
		};

		return this.listSelectionDialogService.show(dialogOptions);
	}

	/**
	 * Method returns the fixed available columns.
	 *
	 * @typeParam TItem The value type to edit in the dialog.
	 *
	 * @returns Available column definitions.
	 */
	private getAvailableColumns<TItem extends IGridConfigDialogColumnsData>(): ColumnDef<TItem>[] {
		return [
			{
				id: 'fieldName',
				model: 'name',
				sortable: false,
				label: {
					key: 'cloud.desktop.formConfigLabelName',
					text: 'Label name',
				},
				type: FieldType.Description,
				width: 200,
				visible: true,
				readonly: true,
			},
		];
	}

	/**
	 * Method returns the fixed visible columns.
	 *
	 * @typeParam TItem The value type to edit in the dialog.
	 *
	 * @returns Selected column definitions.
	 */
	private getVisibleColumns<TItem extends IGridConfigDialogColumnsData>(): ColumnDef<TItem>[] {
		return [
			{
				id: 'fieldName',
				model: 'name',
				sortable: false,
				label: {
					key: 'cloud.desktop.formConfigLabelName',
					text: 'Label name',
				},
				type: FieldType.Description,
				width: 180,
				visible: true,
				readonly: true,
			},
			{
				id: 'userLabelCode',
				model: 'labelCode',
				sortable: false,
				label: {
					key: 'cloud.desktop.formConfigLabelCode',
					text: 'Label Code',
				},
				type: FieldType.Lookup,
				width: 180,
				visible: true,
				lookupOptions: createLookup({
					dataServiceToken: UiCommonGridConfigUserLabelLookupService,
				}),
			},
			{
				id: 'userFieldName',
				model: 'userLabelName',
				sortable: false,
				label: {
					key: 'cloud.desktop.formConfigCustomerLabelName',
					text: 'User label name',
				},
				type: FieldType.Description,
				width: 180,
				visible: true,
			},
			{
				id: 'kbenter',
				model: 'enter',
				sortable: false,
				label: {
					key: 'cloud.desktop.formConfigAllowEnterNavigation',
					text: 'Enter',
				},
				type: FieldType.Boolean,
				width: 60,
				visible: true,
			},
			{
				id: 'fixed',
				model: 'pinned',
				sortable: false,
				label: {
					key: 'cloud.desktop.gridFixedColumnHeader',
					text: 'Fixed',
				},
				type: FieldType.Boolean,
				width: 40,
				visible: true,
				cssClass: 'cell-center',
			},
			{
				id: 'width',
				model: 'width',
				sortable: false,
				label: {
					key: 'cloud.desktop.gridWidthHeader',
					text: 'Width',
				},
				type: FieldType.Integer,
				width: 40,
				visible: true,
				cssClass: 'cell-right',
			},
		];
	}
}
