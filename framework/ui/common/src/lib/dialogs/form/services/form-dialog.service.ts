/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';

import { ModalFormComponent } from '../components/modal-form/modal-form.component';

import { UiCommonDialogService } from '../../base/services/dialog.service';
import { IFormDialogConfig } from '../model/interfaces/form-dialog-config.interface';
import { IEditorDialogResult } from '../../base/model/interfaces/editor-dialog-result.interface';
import { IFormDialog } from '../model/interfaces/form-dialog.interface';
import { getFormDialogDataToken } from '../model/interfaces/form-dialog-data.interface';

/**
 * This service can display dialog boxes that display a form based on a
 * {@link IFormConfig | form configuration object}.
 *
 * @group Dialogs
 */
@Injectable({
	providedIn: 'root',
})
export class UiCommonFormDialogService {
	/**
	 * Opens/Closes form dialog.
	 */
	private readonly modalDialogService = inject(UiCommonDialogService);

	/**
	 * Method prepares the configuration object and opens the form dialog.
	 *
	 * @typeParam T The object type edited in the form.
	 *
	 * @param config A form dialog configuration object.
	 *
	 * @returns The result of the dialog.
	 */
	public showDialog<T extends object>(config: IFormDialogConfig<T>): Promise<IEditorDialogResult<T>> | undefined {
		const effectiveConfig = this.modalDialogService.createOptionsForCustom<IFormDialog<T>, IFormDialogConfig<T>, T, ModalFormComponent<T>>(
			config, 
			(info) => info.body.dialogInfo, 
			ModalFormComponent, 
			[{
				provide: getFormDialogDataToken<T>(),
				useValue: config,
			}],
		);

		effectiveConfig.value = config.entity;

		if (!effectiveConfig.buttons?.length) {
			effectiveConfig.buttons = [];
		}

		return this.modalDialogService.show(effectiveConfig);
	}
}
