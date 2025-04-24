import { StaticProvider, Type } from '@angular/core';
import { IFormConfig } from '../../../../form';
import { IGridConfiguration } from '../../../../grid';
import { IWizardButton } from './step-button.interface';
import { StepType } from '../enums/step-type.enum';
import { Translatable } from '@libs/platform/common';

/**
 * interface of the step definition, should not use it directly
 *
 * @group Dialogs
 */
export interface IWizardStep {
	/**
	 * step type.
	 */
	stepType: StepType
	/**
	 * step id.
	 */
	id: string;
	/**
	 * step title.
	 */
	title: Translatable;

	/**
	 * loadingMessage
	 * TODO: ui-common-loading doesn't support showing message currently
	 */
	loadingMessage?: Translatable;
	/**
	 * Back button can click or not.
	 * @deprecated please control it in button isDisabled.
	 */
	disallowBack?: boolean | (()=>boolean);
	/**
	 * Next button can click or not.
	 * @deprecated please control it in button isDisabled.
	 */
	disallowNext?: boolean | (()=>boolean);
	/**
	 * Finish button can click or not.
	 * @deprecated please control it in button isDisabled.
	 */
	canFinish?: boolean | (()=>boolean);
	/**
	 * Cancel button can click or not.
	 * @deprecated please control it in button isDisabled.
	 */
	disallowCancel?: boolean | (()=>boolean);

	/**
	 * description on top of the step.
	 */
	topDescription?: Translatable;

	/**
	 * description on bottom of the step.
	 */
	bottomDescription?: Translatable;

	/**
	 * Step is completed or not
	 */
	readonly completed?: boolean;

	/**
	 * auto refresh to UI when change step, use for UI-disappear issue(eg: component contains grid)
	 */
	autoRefresh?: boolean;

	/**
	 * provide a shallow copy of the step, can trigger multistep to refresh the step UI.
	 */
	copy():IWizardStep
}

/**
 * interface of the form step definition, should not use it directly, use {@link FormStep}.
 *
 * @group Dialogs
 */
export interface IWizardStepForm<T extends object> extends IWizardStep {
	readonly stepType: StepType.Form;
	/**
	 * buttons display on top.
	 */
	topButtons?: IWizardButton<T>[];

	/**
	 * The form configuration object ([see](@link IFormConfig))
	 */
	formConfiguration: IFormConfig<T>;

	/**
	 * property name of the main model
	 */
	modelName?: string;

	/**
	 * model of current step
	 */
	model: T
	// TODO: need further confirm.
	// /**
	//  * Property holding form control runtime data(eg:readonly,validations etc).
	//  */
	// runtime: EntityRuntimeData<T>;
}

/**
 * interface of the grid step definition, should not use it directly, use {@link GridStep}.
 *
 * @group Dialogs
 */
export interface IWizardStepGrid<T extends object> extends IWizardStep {
	readonly stepType: StepType.Grid;
	/**
	 * buttons display on top.
	 */
	topButtons?: IWizardButton<T>[];

	/**
	 * will disable the next and finish btn, if no row selected.
	 * only work with 'next' button.
	 */
	requireSelection?: boolean;
	/**
	 * TODO:Not support yet.
	 */
	suppressFilter?: boolean;
	/**
	 * The grid configuration object ([see](@link IGridConfiguration))
	 */
	gridConfiguration: IGridConfiguration<T>;

	/**
	 * property name of the main model
	 */
	modelName?: string;

	/**
	 * model of current step
	 */
	model: T[];

	/**
	 * callback of selection changed.
	 * @param items
	 */
	selectionChanged?: (items: T[]) => void;

	refreshGrid: () => void;
}

/**
 * interface of the message step definition, should not use it directly, use {@link MessageStep}.
 *
 * @group Dialogs
 */
export interface IWizardStepMessage extends IWizardStep {
	readonly stepType: StepType.Message;

	/**
	 * The text in the body area of the dialog.
	 */
	bodyText?: Translatable;

	/**
	 * Icon class for message type
	 */
	iconClass?: string;
}

/**
 * interface of the custom step definition, should not use it directly, use {@link CustomStep}.
 *
 * @group Dialogs
 */
export interface IWizardStepCustom extends IWizardStep {
	readonly stepType: StepType.Custom;

	/**
	 * bodyComponent render in current step.
	 */
	bodyComponent: Type<unknown>;
	/**
	 * An optional array of custom injection provider for the body component.
	 */
	readonly bodyProviders?: StaticProvider[];

	/**
	 * property name of the main model
	 */
	modelName?: string;

	/**
	 * model of current step
	 */
	model?: Record<string, unknown>;
}

