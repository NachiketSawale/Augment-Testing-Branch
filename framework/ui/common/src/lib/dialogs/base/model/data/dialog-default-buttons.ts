/*
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';
import { StandardDialogButtonId } from '../enums/standard-dialog-button-id.enum';

/**
 * Array of dialog default buttons, these buttons are used along with some properties
 * from userbutton defined for a dialog.
 */
export const DefaultButtons: {
	id: string,
	caption: Translatable
}[] = [
	{
		id: StandardDialogButtonId.Ok,
		caption: { key: 'ui.common.dialog.okBtn' },
	},
	{
		id: StandardDialogButtonId.Yes,
		caption: { key: 'ui.common.dialog.yesBtn' },
	},
	{
		id: StandardDialogButtonId.No,
		caption: { key: 'ui.common.dialog.noBtn' },
	},
	{
		id: StandardDialogButtonId.Ignore,
		caption: { key: 'ui.common.dialog.ignoreBtn' },
	},
	{
		id: StandardDialogButtonId.Cancel,
		caption: { key: 'ui.common.dialog.cancelBtn' },
	},
	{
		id: StandardDialogButtonId.Retry,
		caption: { key: 'ui.common.dialog.retryBtn' },
	},
];
