/*
 * Copyright(c) RIB Software GmbH
 */
import { cloneDeep } from 'lodash';
import { Injectable, inject } from '@angular/core';

import { MasterDetailDialogComponent } from '../component/master-detail-dialog/master-detail-dialog.component';

import { IEditorDialogResult, IMasterDetailDialog, IMasterDetailDialogOptions, IMasterDetailItem, StandardDialogButtonId, UiCommonDialogService } from '../..';

import { getMasterDetailDialogDataToken } from '../model/master-detail-dialog-data.interface';

/**
 * This service displays master detail modal dialog.
 *
 * @group Dialogs
 */
@Injectable({
	providedIn: 'root',
})
export class UiCommonMasterDetailDialogService {
	/**
	 * Opens/Closes dialog.
	 */
	private readonly modalDialogService = inject(UiCommonDialogService);

	/**
	 * Displays a custom dialog box.
	 *
	 * @typeParam T The value type to edit in the dialog. If the dialog is
	 *   there only to display some data.
	 * @param { IMasterDetailDialogOptions<T> } config An object that contains configuration options for
	 *   the dialog box.
	 * @returns { Promise<IEditorDialogResult<IMasterDetailItem<T>[]>> | undefined } Result of the dialog.
	 */
	public showDialog<T extends object>(config: IMasterDetailDialogOptions<T>): Promise<IEditorDialogResult<IMasterDetailItem<T>[]>> | undefined {
		const effectiveConfig = this.modalDialogService.createOptionsForCustom<IMasterDetailDialog<T>, IMasterDetailDialogOptions<T>, IMasterDetailItem<T>[], MasterDetailDialogComponent<T>>(
			config, 
			(info) => info.body.dialogInfo, 
			MasterDetailDialogComponent, 
			[
				{
					provide: getMasterDetailDialogDataToken<T>(),
					useValue: config,
				}
			],
		);

		effectiveConfig.value = cloneDeep(config.items);

		if(!effectiveConfig.buttons || (effectiveConfig.buttons && !effectiveConfig.buttons.length)){
			effectiveConfig.buttons = [
				{
					id: StandardDialogButtonId.Ok,
				},
				{
					id: StandardDialogButtonId.Cancel,
				},
			];
		}
		

		return this.modalDialogService.show(effectiveConfig);
	}
}
