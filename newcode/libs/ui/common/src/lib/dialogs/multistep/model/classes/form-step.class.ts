import { IWizardStepForm } from '../interfaces/wizard-step.interface';
import { StepType } from '../enums/step-type.enum';
import { IFormConfig } from '../../../../form';
import { Translatable } from '@libs/platform/common';
import { isString } from 'lodash';

/**
 * class of form step
 *
 * @group Dialogs
 */
export class FormStep<T extends object> implements IWizardStepForm<T> {

	/**
	 * Init a step with a form config
	 * @param id step id
	 * @param title step title
	 * @param formConfiguration configuration of the form
	 * @param modelName bind the model via property name of the main model
	 */
	public constructor(id: string, title: Translatable, formConfiguration: IFormConfig<T>, modelName: string/*, runtime?: EntityRuntimeData<T>*/)

	/**
	 * Init a step with a form config
	 * @param id step id
	 * @param title step title
	 * @param formConfiguration configuration of the form
	 * @param model bind the model to an object directly
	 */
	public constructor(id: string, title: Translatable, formConfiguration: IFormConfig<T>, model: T/*, runtime?: EntityRuntimeData<T>*/)

	public constructor(id: string, title: Translatable, formConfiguration: IFormConfig<T>, model: string | T/*, runtime?: EntityRuntimeData<T>*/) {
		this.id = id;
		this.title = title;
		this.stepType = StepType.Form;
		this.formConfiguration = formConfiguration;
		if (isString(model)) {
			this.modelName = model;
			this.model = Object.create(null);
		} else {
			this.model = model;
		}
		//this.runtime = runtime ?? {readOnly: [], validationResults: []};
	}

	public bottomDescription?: Translatable;
	/**
	 * Back button can click or not.
	 * @deprecated please control it in button isDisabled.
	 */
	public disallowBack?: boolean | (()=>boolean);
	/**
	 * Next button can click or not.
	 * @deprecated please control it in button isDisabled.
	 */
	public disallowNext?: boolean | (()=>boolean);
	/**
	 * Finish button can click or not.
	 * @deprecated please control it in button isDisabled.
	 */
	public canFinish?: boolean | (()=>boolean);
	/**
	 * Cancel button can click or not.
	 * @deprecated please control it in button isDisabled.
	 */
	public disallowCancel?: boolean | (()=>boolean);
	public id: string;
	public loadingMessage?: Translatable;
	public readonly stepType: StepType.Form;
	public title: Translatable;
	public topDescription?: Translatable;
	public formConfiguration: IFormConfig<T>;
	public modelName?: string;
	public model: T;
	//public runtime: EntityRuntimeData<T>;
	public copy(): FormStep<T> {
		const step = new FormStep('', '', {rows:[]},{});
		return Object.assign(step, this);
	}
}
