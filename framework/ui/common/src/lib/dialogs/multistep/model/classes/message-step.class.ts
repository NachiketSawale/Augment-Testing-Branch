import { IWizardStepMessage } from '../interfaces/wizard-step.interface';
import { StepType } from '../enums/step-type.enum';
import { Translatable } from '@libs/platform/common';

/**
 * class of message step
 *
 * @group Dialogs
 */
export class MessageStep implements IWizardStepMessage {
	/**
	 * Init a step with a message
	 * @param id step id
	 * @param title step title
	 * @param bodyText text to display
	 * @param iconClass icon to display
	 */
	public constructor(id: string, title: Translatable, bodyText: Translatable, iconClass?: string) {
		this.id = id;
		this.title = title;
		this.stepType = StepType.Message;
		this.bodyText = bodyText;
		this.iconClass = iconClass;
	}

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
	public bodyText?: Translatable;
	public iconClass?: string;
	public readonly stepType: StepType.Message;
	public title: Translatable;
	public topDescription?: Translatable;

	public copy(): MessageStep {
		const step = new MessageStep('', '', '');
		return Object.assign(step, this);
	}
}
