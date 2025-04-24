/*
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';

@Component({
	selector: 'example-topic-one-alert',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.scss'],
})

/**
 * This component is demo component just to render alert body.
 */
export class AlertComponent {
	//public modalOptions!: IDialogOptions;

	// Do not inject dialog data into body components. It is an internal implementation detail
	// of the dialog framework. Instead, supply your own model object via the bodyProviders to
	// link your body component with the dialog definition and outside information.
	public constructor(/*@Optional() @Inject(MAT_DIALOG_DATA) public data: IDialogData*/) {
		//this.modalOptions = this.data.dialog?.modalOptions as IDialogOptions;
	}
}
