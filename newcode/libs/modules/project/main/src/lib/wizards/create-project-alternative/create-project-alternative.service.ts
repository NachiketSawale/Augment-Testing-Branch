import { inject, Injectable } from '@angular/core';
import { MultistepDialog, UiCommonMultistepDialogService } from '@libs/ui/common';
import { CreateProjectAlternativeConfiguration } from './create-project-alternative-configuration';
import { CreateProjectAlternativeInfoStep } from './create-project-alternative-info-step';
import { CreateProjectAlternativeTemplateStep } from './create-project-alternative-template-step';
import { CreateProjectAlternativeScheduleStep } from './create-project-alternative-schedule-step';
import { CreateProjectAlternativeEstimateStep } from './create-project-alternative-estimate-step';
import { CreateProjectAlternativeBoqStep } from './create-project-alternative-boq-step';
import { CreateProjectAlternativeProjectInvolvedStep } from './create-project-alternative-project-involved-step';
/*
 * Copyright(c) RIB Software GmbH
 */

import { CreateProjectAlternativeSortCodesStep } from './create-project-alternative-sort-codes-step';

@Injectable({
	providedIn: 'root'
})
export class CreateProjectAlternativeService{
	private readonly modalDialogService = inject(UiCommonMultistepDialogService);
	private createProjectAlternativeConfiguration = new CreateProjectAlternativeConfiguration();

	public handle(){
		const alternativeStep = new CreateProjectAlternativeInfoStep();
		const templateStep = new CreateProjectAlternativeTemplateStep();
		const scheduleStep = new CreateProjectAlternativeScheduleStep();
		const estimateStep = new CreateProjectAlternativeEstimateStep();
		const boqStep = new CreateProjectAlternativeBoqStep();
		const projectInvolvedStep = new CreateProjectAlternativeProjectInvolvedStep();
		const sortCodesStep = new CreateProjectAlternativeSortCodesStep();

		const multiStepDialog = new MultistepDialog(
			this.createProjectAlternativeConfiguration,
			[alternativeStep.createForm(), templateStep.createForm(), scheduleStep.createGrid(), estimateStep.createGrid(),
				boqStep.createForm(), projectInvolvedStep.createForm(), sortCodesStep.createForm()],
			'project.main.createAlternativeTitle');
		this.modalDialogService.showDialog(multiStepDialog);
	}
}