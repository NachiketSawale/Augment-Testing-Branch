/*
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';

/**
 * Additional description(Top/Bottom) details interface for dialog body.
 *
 * @group Dialog Framework
 */
export interface IDialogBodyDescriptionBase {
	/**
	 * The description text.
	 */
	text: Translatable;

	/**
	 * The css class for the icon to be displayed.
	 */
	iconClass: string;
}
