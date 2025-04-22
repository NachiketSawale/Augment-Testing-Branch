/*
 * Copyright(c) RIB Software GmbH
 */

import { StandardDialogButtonId } from '@libs/ui/common';
import { Translatable } from '@libs/platform/common';
import { Injector } from '@angular/core';

/**
 * Button configuration for the generic wizard.
 */
export type GenWizardButton = {
	/**
	 * Id of the button.
	 */
	id: StandardDialogButtonId;

	/**
	 * Caption of the button.
	 */
	caption: Translatable;

	/**
	 * Function to execute on click of button.
	 * @param injector angular injector to get any other required service during function.
	 * @returns
	 */
	fn: (injector: Injector) => void;

	/**
	 * Signal to close the wizard on click of button.
	 */
	autoClose: boolean;

	/**
	 * Function to enable/disable the button.
	 * @param injector angular injector to get any required service.
	 * @returns boolean.
	 */
	isDisabled?: (injector: Injector) => boolean;
}