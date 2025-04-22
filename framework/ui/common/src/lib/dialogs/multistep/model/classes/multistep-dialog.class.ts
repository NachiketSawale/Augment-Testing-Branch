import {filter,isNumber,findIndex} from 'lodash';
import { ICustomDialog, IDialogButtonBase } from '../../../base';
import {
	getMultiStepDialogDataToken,
	MultistepDialogComponent
} from '../../components/multistep-dialog/multistep-dialog.component';
import { Subject } from 'rxjs';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ICustomDialogOptions } from '../../../base';
import { IWizardStep } from '../interfaces/wizard-step.interface';
import { MultistepTitleFormat } from '../enums/multistep-title-format.enum';
import { Translatable } from '@libs/platform/common';
import { StepperCommand } from '../enums/stepper-command.enum';

/**
 * class to access and control the multistep dialog.
 *
 * @group Dialogs
 */
export class MultistepDialog<T extends object> {

	/**
	 * stepIndex of current step, not editable.
	 */
	public readonly stepIndex: number = 0;

	/**
	 * Init the multistep dialog config.
	 * @param dataItem The object type edited in the dialog.
	 * @param wizardSteps {@link IWizardStep} Configs of each step. presets-{@link MessageStep},{@link GridStep},{@link FormStep},{@link CustomStep},
	 * @param title Main title of the multistep.
	 */
	public constructor(dataItem: T, wizardSteps: IWizardStep[], title?: Translatable) {
		this.title = title;
		this.dataItem = dataItem;
		this.wizardSteps = wizardSteps;
	}

	/**
	 * Main title of the multistep.
	 */
	public title?: Translatable;

	/**
	 * Title format
	 */
	public titleFormat: MultistepTitleFormat = MultistepTitleFormat.MainTitleProgressStepTitle;

	/**
	 * config of the steps.
	 */
	public wizardSteps: IWizardStep[] = [];

	/**
	 * DateItem to hold the model.
	 */
	public dataItem: T;

	/**
	 * get currentStepInfo
	 */
	public get currentStep() {
		return this.wizardSteps[this.stepIndex];
	}

	/**
	 * default buttons of the multi-steps.
	 */
	private defaultButtons: IDialogButtonBase<ICustomDialog<MultistepDialog<T>, MultistepDialogComponent<T>>>[] = [
		{id: 'back', caption: {key: 'ui.common.dialog.multistep.backBtn'}, autoClose: false},
		{id: 'next', caption: {key: 'ui.common.dialog.multistep.nextBtn'}, autoClose: false},
		{id: 'ok', caption: {key: 'ui.common.dialog.multistep.finishBtn'}},
		{id: 'cancel', caption: {key: 'ui.common.dialog.cancelBtn'}}];

	/**
	 * hide indicators or not, default:false.
	 */
	public hideIndicators = false;

	/**
	 * hide the display of the next step title.
	 */
	public hideDisplayOfNextStep = false;

	public readonly command = new Subject<{ command: StepperCommand, value?: unknown }>();

	/**
	 * change from one step to another, won't block the changing.
	 */
	public onChangeStep?: (dialog: MultistepDialog<T>, event: StepperSelectionEvent) => void;

	/**
	 * changing from one step to another, will block the changing.
	 */
	public onChangingStep?:(dialog: MultistepDialog<T>, nextIndex:number) => Promise<void>;

	/**
	 * config of the modal-dialog.
	 */
	public readonly dialogOptions: ICustomDialogOptions<MultistepDialog<T>, MultistepDialogComponent<T>> = {
		bodyComponent: MultistepDialogComponent<T>,
		buttons: this.defaultButtons,
		resizeable: true,
		bodyProviders: [{
			provide: getMultiStepDialogDataToken<T>(),
			useValue: this
		}],
		value: this
	};

	/**
	 * get step by id
	 * @param stepId
	 */
	public getWizardStep(stepId: string): (IWizardStep | null) {
		const steps = filter(this.wizardSteps, (e) => {
			return e.id === stepId;
		});
		if (steps && steps[0]) {
			return steps[0];
		}
		return null;
	}

	/**
	 * insert a new step to current steps.
	 * @param step step to insert
	 * @param at the index(will insert to the index) or the stepId(will insert behind the stepId) to insert
	 */
	public insertWizardStep(step: IWizardStep, at: number | string) {
		if (isNumber(at)) {
			this.wizardSteps.splice(at, 0, step);
		} else {
			const stepIndex = findIndex(this.wizardSteps, {id: at});
			if (stepIndex < 0) {
				throw new Error('Step ID not found: ' + at);
			}
			this.wizardSteps.splice(stepIndex + 1, 0, step);
		}
	}

	/**
	 * remove a step
	 * @param at the index to remove
	 */
	public removeWizardStep(at: number) {
		if (at >= 0) {
			this.wizardSteps.splice(at, 1);
		}
	}

	/**
	 * remove steps base on id
	 * @param stepIds
	 */
	public removeWizardSteps(stepIds: string[]) {
		for (const stepId of stepIds) {
			const stepIndex = findIndex(this.wizardSteps, {id: stepId});
			this.removeWizardStep(stepIndex);
		}
	}

	/**
	 * go to next step.
	 */
	public goToNext() {
		setTimeout(() => {
			this.command.next({command: StepperCommand.GoToNext});
		});
	}

	/**
	 * go to previous step.
	 */
	public goToPrevious() {
		setTimeout(() => {
			this.command.next({command: StepperCommand.GoToPrevious});
		});
	}

	public goToStep(stepIndex: number) {
		setTimeout(() => {
			this.command.next({command: StepperCommand.GoTo,value: stepIndex});
		});
	}

	/**
	 * set headerText
	 * @param headerText setHeaderText from currentStep if not specified
	 */
	public setHeaderText(headerText?: Translatable) {
		this.command.next({command: StepperCommand.SetHeaderText, value: headerText});
	}
}
