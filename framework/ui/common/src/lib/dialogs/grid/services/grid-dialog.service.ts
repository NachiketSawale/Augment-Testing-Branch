/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';

import { GridDialogComponent } from '../components/grid-dialog/grid-dialog.component';

import { IGridDialog, IGridDialogState } from '../..';
import { IGridDialogOptions } from '../model/grid-dialog-options.interface';
import { IEditorDialogResult, StandardDialogButtonId, UiCommonDialogService } from '../../base';
import { getGridDialogDataToken } from '../model/grid-dialog-data.interface';

/**
 * This service displays grid modal dialog.
 *
 * @group Dialogs
 */
@Injectable({
	providedIn: 'root',
})
export class UiCommonGridDialogService {
	/**
	 * Opens/Closes form dialog.
	 */
	private readonly modalDialogService = inject(UiCommonDialogService);

	/**
	 * Displays a custom dialog box.
	 * @typeParam TItem The value type to edit in the dialog. If the dialog is
	 *   there only to display some data.
	 * @param { IGridDialogOptions<TItem> } options An object that contains configuration options for the dialog box.
	 * @returns { Promise<IEditorDialogResult<IGridDialogState<TItem>>> | undefined } Result of the dialog.
	 */
	public show<TItem extends object>(options: IGridDialogOptions<TItem>): Promise<IEditorDialogResult<IGridDialogState<TItem>>> | undefined {

		const effectiveConfig = this.modalDialogService.createOptionsForCustom<IGridDialog<TItem>, IGridDialogOptions<TItem>, IGridDialogState<TItem>, GridDialogComponent<TItem>>(
			options, 
			info => info.body.dialogInfo, 
			GridDialogComponent, 
			[{
				provide: getGridDialogDataToken<TItem>(),
				useValue: options,
			}],
		);

		effectiveConfig.value={
			selectedItems: options.selectedItems, 
			items: options.items
		};

		if (!effectiveConfig.buttons || (effectiveConfig.buttons && !effectiveConfig.buttons.length)) {
			effectiveConfig.buttons = [
				{
					id: StandardDialogButtonId.Ok,
				},
			];
		}

		if (!options.isReadOnly) {
			effectiveConfig.buttons?.push({
				id: StandardDialogButtonId.Cancel,
			});
		}

		return this.modalDialogService.show(effectiveConfig);
	}
}
