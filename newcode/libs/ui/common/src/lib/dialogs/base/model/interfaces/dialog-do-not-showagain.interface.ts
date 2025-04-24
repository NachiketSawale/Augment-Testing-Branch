/*
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';
import { StandardDialogButtonId } from '../enums/standard-dialog-button-id.enum';

/**
 * Do not show again option interface.
 *
 * @group Dialog Framework
 */
export interface IDialogDoNotShowAgain {
	/**
	 * Indicates whether the option to deactivate/hide dialog is visible.
	 */
	showOption: boolean;

	/**
	 * The id of the button. This is the returning value in the resolve of the dialogue.
	 */
	defaultActionButtonId: StandardDialogButtonId | string;

	/**
	 * State of the donotshow again checkbox.
	 * If true dialog will not be shown again.
	 */
	activated: boolean;

	/**
	 * The human-readable label of the checkbox.
	 * If it is not set, a default text will be used.
	 */
	label?: Translatable;
}
