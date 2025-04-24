import { Component, Input } from '@angular/core';
import { IWizardStepForm } from '../../model/interfaces/wizard-step.interface';

@Component({
	selector: 'ui-common-step-form',
	templateUrl: './step-form.component.html',
	styleUrls: ['./step-form.component.scss']
})
export class StepFormComponent<T extends object> {

	@Input()
	public stepForm!: IWizardStepForm<T>;

}
