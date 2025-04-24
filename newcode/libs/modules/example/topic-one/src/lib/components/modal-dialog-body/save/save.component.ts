/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, OnInit } from '@angular/core';

/**
 * This component is demo component just to render save body.
 */
@Component({
	selector: 'example-topic-one-save',
	templateUrl: './save.component.html',
	styleUrls: ['./save.component.scss'],
})
export class SaveComponent implements OnInit {
	//public modalOptions!: IDialogOptions;
	public isChecked = false;
	public location = ['User', 'Role', 'System', 'Portal'];
	public selectedLocation!: string;
	public availableViews = {
		User: ['uuuu(ribadmin|AAA|FFF)', 'uuuu1(ribadmin|AAA|FFF)', 'uuuu3(ribadmin|AAA|FFF)'],
		Role: ['aaaa(ribadmin|AAA|FFF)', 'aaaa(ribadmin|AAA|FFF)', 'aaaa3(ribadmin|AAA|FFF)'],
		System: ['ddd1(ribadmin|AAA|FFF)', 'ddd2(ribadmin|AAA|FFF)', 'uuuu3(ribadmin|AAA|FFF)'],
		Portal: ['uuuu(ribadmin|AAA|FFF)', 'uuuu1(ribadmin|AAA|FFF)', 'uuuu3(ribadmin|AAA|FFF)'],
	};
	public selectedViewArray: string[] = [];
	public selectedView!: string;
	// The dialog body component should not access the dialog data object, as it is a part of the
	// internals of the dialog framework.
	public constructor(/*@Optional() @Inject(MAT_DIALOG_DATA) public data: IDialogData*/) {
		//this.modalOptions = this.data.dialog?.modalOptions as IDialogOptions;
	}
	public ngOnInit() {
		this.footerButtons();
	}

	public footerButtons(): void {
		// This should not be done from within the dialog body component.
		// Instead, assign event handlers when creating the dialog options and communicate with the
		// body component by means of some object you inject in the bodyProviders.
		/*
		//let button;
		let button = this.data.dialog?.getButtonById('ok') as IDialogButtonBase;
		if (button) {
			button.fn = () => {
				//TODO: Operations to be done on button click
				console.log('ok Button Clicked');
				return undefined;
			};
		}

		button = this.data.dialog?.getButtonById('cancel') as IDialogButtonBase;
		if (button) {
			button.fn = () => {
				//TODO: Operations to be done on button click
				console.log('cancel Button Clicked');
				this.data.dialog?.dialogReference?.close({ id: 'cancel', settings: this.selectedView });
				return undefined;
			};
		}

		button = this.data.dialog?.getButtonById('delete') as IDialogButtonBase;
		if (button) {
			button.fn = () => {
				//TODO: Operations to be done on button click
				console.log('delete Button Clicked');
				this.data.dialog?.dialogReference?.close({ id: 'Delete' });
				return undefined;
			};
		}

		button = this.data.dialog?.getButtonById('default') as IDialogButtonBase;
		 */
	}

	public onLocationSelect() {
		// Control the states of buttons with the isDisabled function on the dialog options object.
		// The link to the body component should be some model object that is injected via the
		// bodyProviders array.
		/*
		const buttonDelete: IDialogButtonBase = this.data.dialog?.getButtonById('delete') as IDialogButtonBase;
		const buttonDefault: IDialogButtonBase = this.data.dialog?.getButtonById('default') as IDialogButtonBase;
		buttonDelete.isDisabled = true;
		buttonDefault.isDisabled = true;
		type ObjectKey = keyof typeof this.availableViews;
		const key = this.selectedLocation as ObjectKey;
		this.selectedViewArray = this.availableViews[key];
		 */
	}

	public onViewSelect() {
		// See comments above.
		/*
		const buttonDelete: IDialogButtonBase = this.data.dialog?.getButtonById('delete') as IDialogButtonBase;
		const buttonDefault: IDialogButtonBase = this.data.dialog?.getButtonById('default') as IDialogButtonBase;
		buttonDelete.isDisabled = false;
		buttonDefault.isDisabled = false;
		 */
	}
}
