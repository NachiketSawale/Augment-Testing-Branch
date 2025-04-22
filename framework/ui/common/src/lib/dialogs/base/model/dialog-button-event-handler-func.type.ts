/*
 * Copyright(c) RIB Software GmbH
 */

import {
	IDialog,
	IClosingDialogButtonEventInfo
} from '..';

/**
 * The type for event handlers of dialog buttons.
 *
 * @typeParam TDialog The type of the dialog box.
 * @typeParam TDetailsBody The component shown in the details area of the dialog, or `void`
 *   if no details area is shown or the details type is not set to {@link DialogDetailsType.Custom}.
 *
 * @param event An object that describes the original mouse input event.
 * @param info An object providing some context information about the displayed dialog, as well
 *   as a way to prevent closing the dialog box.
 *
 * @returns If the function happens asynchronously, it returns a promise that is resolved once
 *   all operations have concluded.
 *
 * @group Dialog Framework
 */
export type DialogButtonEventHandlerFunc<TDialog extends IDialog<TDetailsBody>, TDetailsBody = void> = (event: MouseEvent, info: IClosingDialogButtonEventInfo<TDialog, TDetailsBody>) => Promise<void> | void;