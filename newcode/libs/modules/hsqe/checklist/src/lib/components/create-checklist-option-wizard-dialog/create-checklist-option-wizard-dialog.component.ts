/*
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import { PlatformCommonModule, Translatable } from '@libs/platform/common';
import { HsqeChecklistCreationMode } from '../../model/enums/hsqe-checklist-creation-mode';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';

@Component({
	selector: 'hsqe-checklist-create-checklist-option-wizard-dialog',
	templateUrl: './create-checklist-option-wizard-dialog.component.html',
	styleUrls: ['./create-checklist-option-wizard-dialog.component.scss'],
	imports: [PlatformCommonModule, FormsModule, NgForOf],
	standalone: true,
})
export class CreateChecklistOptionWizardDialogComponent {
	public radioItemInfo: IRadioItem[] = [];
	protected readonly name = 'checkListCreationMode';
	public checklistCreationMode = HsqeChecklistCreationMode.ForNewActivityOnly;

	private setRadioItems() {
		this.radioItemInfo = [
			{
				id: HsqeChecklistCreationMode.ForNewActivityOnly,
				displayName: 'hsqe.CheckList.wizard.createCheckList.createNewCheckListForNewActivityOnly',
			},
			{
				id: HsqeChecklistCreationMode.ForAllActivities,
				displayName: 'hsqe.CheckList.wizard.createCheckList.createNewCheckListForAllActivities',
			},
		];
	}

	public constructor() {
		this.setRadioItems();
	}
}

interface IRadioItem {
	/**
	 * Radio item id.
	 */
	id: number;

	/**
	 * Radio item displayName.
	 */
	displayName: Translatable;
}
