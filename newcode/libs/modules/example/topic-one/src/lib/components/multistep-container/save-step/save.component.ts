/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, InjectionToken, Input, OnInit } from '@angular/core';
import { getMultiStepDialogDataToken } from '@libs/ui/common';

import { multistepDemoModel, save } from '../model/multistep-demo-model.interface';

const SAVE_STEP_INJECT_TOKEN = new InjectionToken('dlg-save-step-token');

export function getSaveStepInjectionToken(): InjectionToken<unknown> {
	return SAVE_STEP_INJECT_TOKEN;
}

/**
 * This component is demo component just to render save body.
 */
@Component({
	selector: 'example-topic-one-save-step',
	templateUrl: './save.component.html',
	styleUrls: ['./save.component.scss'],
})
export class SaveStepComponent implements OnInit {
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


	// access the data of multistep component.
	private readonly multiStepDialogData = inject(getMultiStepDialogDataToken<multistepDemoModel>());
	// access the component specified data.
	//private readonly saveData = inject(getSaveStepDataToken());

	@Input()
	public saveData!: save;


	public ngOnInit() {
	}

	public get selectedView() {
		return this.saveData.SelectedView ?? '';
	}


	public onLocationSelect() {
		type ObjectKey = keyof typeof this.availableViews;
		const key = this.selectedLocation as ObjectKey;
		if (this.saveData) {
			this.selectedViewArray = this.saveData[key];
			// access the data from other step.
			const value = this.multiStepDialogData.dataItem?.changePassword?.oldpassword;
			console.log(value);
		}

	}

	public onViewSelect() {

	}
}
