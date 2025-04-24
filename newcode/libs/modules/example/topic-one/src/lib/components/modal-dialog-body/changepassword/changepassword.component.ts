/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'example-topic-one-changepassword',
	templateUrl: './changepassword.component.html',
	styleUrls: ['./changepassword.component.scss'],
})

/**
 * This component is demo component just to render changepassword body.
 */
export class ChangePasswordComponent implements OnInit {
	public loginData = {
		username: 'ribadmin',
		logonname: 'ribadmin',
		oldpassword: '',
		newpassword: '',
		confirmpassword: '',
	};
	public isChanged = false;
	//public modalOptions!: IDialogOptions;

	// Do not inject dialog data into body components. It is an internal implementation detail
	// of the dialog framework. Instead, supply your own model object via the bodyProviders to
	// link your body component with the dialog definition and outside information.
	public constructor(/*@Optional() @Inject(MAT_DIALOG_DATA) public data: IDialogData*/) {
		//this.modalOptions = this.data.dialog?.modalOptions as IDialogOptions;
	}

	public ngOnInit() {
		this.footerButtons();
	}

	public footerButtons(): void {
		//let button;
		/*const button = this.data.dialog?.getButtonById('changepassword') as IDialogButtonBase;
		if (button) {
			button.fn = () => {
				//TODO: Operations to be done on button click
				console.log('change password btn clicked');
				return undefined;
			};
		}*/
	}
}
