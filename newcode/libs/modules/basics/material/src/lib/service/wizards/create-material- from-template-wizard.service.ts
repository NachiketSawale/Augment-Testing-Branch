/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';

import { ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { BasicsMaterialCreateMaterialFromTemplateWizardComponent } from '../../create-material-from-template/components/basics-material-create-material-from-template-wizard.component';

@Injectable({
	providedIn: 'root'
})
export abstract class CreateMaterialFromTemplateWizardService {

	private readonly dialogService = inject(UiCommonDialogService);

	public async onStartWizard(){

		const modalOptions: ICustomDialogOptions<void, BasicsMaterialCreateMaterialFromTemplateWizardComponent> = {
			width: '70%',
			headerText: 'basics.material.wizard.createMaterialByTemplate',
			resizeable: true,
			id: 'bb4508b4c63e418abe0db4786c387ba7',
			showCloseButton: true,
			bodyComponent: BasicsMaterialCreateMaterialFromTemplateWizardComponent,
			buttons:[
				{
					id: 'create',
					caption: {key: 'basics.material.record.create'},
					fn(evt, info) {
						info.dialog.body.onCreateBtnClicked();
					},
					isDisabled: info => info.dialog.body.okCreateBtnDisabled(),
				}, {id: StandardDialogButtonId.Cancel, caption: {key: 'ui.common.dialog.cancelBtn'}}
			]
		};
		return this.dialogService.show(modalOptions);

	}

}