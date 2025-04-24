/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IModifyResourceOptions } from '../model/estimate-modify-resource-options.interface';
import { ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { ModifyResourceDialogComponent } from '../componets/modify-resource-dailog/modify-resource-dialog.component';
import { IModifyResourceEntity } from '../model/estimate-modify-resource-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class EstimateModifyResourceDialogService {

	private readonly modalDialogService = inject(UiCommonDialogService);

	public openDialog(option: IModifyResourceOptions) {
		const effectiveConfig: ICustomDialogOptions<IModifyResourceEntity, object> = {
			headerText: { key : 'estimate.main.modifyResourceWizard.configTitle'},
			id: 'modify.resource.dialog',
			width: '800px',
			bodyComponent: ModifyResourceDialogComponent,
			buttons: [],
			value: {
				ModifyOptions: option,
				EstScope: 0
			}
		};

		effectiveConfig.buttons?.push({
			id: StandardDialogButtonId.Ok,
			isDisabled: info => {
				// return !!(entity && entity.dateItem && entity.dateItem.isReadonly);
				return false;
			},
			autoClose: true
		});
		effectiveConfig.buttons?.push({
			id: StandardDialogButtonId.Cancel
		});

		this.modalDialogService.show(effectiveConfig)?.then(result => {
			if (result && result.closingButtonId === 'ok' && result.value) {
				// this.saveConfig(result.value);
			}
		});
	}
}