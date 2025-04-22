import { IWizardStepCustom } from '../interfaces/wizard-step.interface';
import { StepType } from '../enums/step-type.enum';
import { StaticProvider, Type } from '@angular/core';
import { Translatable } from '@libs/platform/common';
import { isString } from 'lodash';

/**
 * class of custom step
 *
 * @group Dialogs
 */
export class CustomStep implements IWizardStepCustom {
	/**
	 * Init a step with a custom component
	 * @param id step id
	 * @param title step title
	 * @param bodyComponent custom component
	 * @param bodyProviders an optional array of custom injection provider for the custom component.
	 * @param modelName bind the model via property name of the main model
	 */
	public constructor(id: string, title: Translatable, bodyComponent: Type<unknown>, bodyProviders: StaticProvider[], modelName: string);

	/**
	 * Init a step with a custom component
	 * @param id step id
	 * @param title step title
	 * @param bodyComponent custom component
	 * @param bodyProviders an optional array of custom injection provider for the custom component.
	 * @param model bind the model to an object directly
	 */
	public constructor(id: string, title: Translatable, bodyComponent: Type<unknown>, bodyProviders: StaticProvider[], model: Record<string, unknown>);

	/**
	 * Init a step with a custom component
	 * @param id step id
	 * @param title step title
	 * @param bodyComponent custom component
	 * @param bodyProviders an optional array of custom injection provider for the custom component.
	 */
	public constructor(id: string, title: Translatable, bodyComponent: Type<unknown>, bodyProviders: StaticProvider[]);
	/**
	 * Init a step with a custom component
	 * @param id step id
	 * @param title step title
	 * @param bodyComponent custom component
	 */
	public constructor(id: string, title: Translatable, bodyComponent: Type<unknown>);
	public constructor(id: string, title: Translatable, bodyComponent: Type<unknown>, bodyProviders?: StaticProvider[], model?: string | Record<string, unknown>) {
		this.id = id;
		this.title = title;
		this.stepType = StepType.Custom;
		this.bodyComponent = bodyComponent;
		this.bodyProviders = bodyProviders;
		if (model) {
			if (isString(model)) {
				this.modelName = model;
			} else {
				this.model = model;
			}
		}
	}

	public bodyComponent: Type<unknown>;
	public bodyProviders?: StaticProvider[];
	public bottomDescription?: Translatable;
	/**
	 * Back button can click or not.
	 * @deprecated please control it in button isDisabled.
	 */
	public disallowBack?: boolean | (() => boolean);
	/**
	 * Next button can click or not.
	 * @deprecated please control it in button isDisabled.
	 */
	public disallowNext?: boolean | (() => boolean);
	/**
	 * Finish button can click or not.
	 * @deprecated please control it in button isDisabled.
	 */
	public canFinish?: boolean | (() => boolean);
	/**
	 * Cancel button can click or not.
	 * @deprecated please control it in button isDisabled.
	 */
	public disallowCancel?: boolean | (() => boolean);
	public id: string;
	public loadingMessage?: Translatable;
	public readonly stepType: StepType.Custom;
	public title: Translatable;
	public topDescription?: Translatable;
	public modelName?: string;
	public model?: Record<string, unknown>;

	public copy(): CustomStep {
		const step = new CustomStep('', '', Object, [], '');
		return Object.assign(step, this);
	}

	public autoRefresh?: boolean;
}
