/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { getMultiStepDialogDataToken } from '@libs/ui/common';
import { multistepDemoModel } from '../model/multistep-demo-model.interface';

@Component({
	selector: 'example-topic-one-alert-step',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.scss'],
})

/**
 * This component is demo component just to render alert body.
 */
export class AlertStepComponent {

	public readonly multiStepDialogData = inject(getMultiStepDialogDataToken<multistepDemoModel>());
	// public modalOptions!: IDialogOptions<object>;
	// public constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: IDialogData<object,object>) {
	// 	this.modalOptions = this.data.dialog?.modalOptions as IDialogOptions<object>;
	// }

	public get showSteps(){
		return this.multiStepDialogData.wizardSteps.map(x=>x.title);
	}
}
