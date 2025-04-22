/*
 * Copyright(c) RIB Software GmbH
 */

import {
	IDialog,
	IDialogEventInfo,
	IDialogButtonEventInfo
} from '..';

/**
 * A function type that returns a value based on a dialog event info object.
 *
 * @typeParam TDialog The type of the dialog box.
 * @typeParam TSetting The type of the value.
 * @typeParam TDetailsBody The component shown in the details area of the dialog, or `void`
 *   if no details area is shown or the details type is not set to {@link DialogDetailsType.Custom}.
 *
 * @param info An object providing some context information about the displayed dialog.
 *
 * @returns The retrieved value.
 *
 * @see {@link DialogButtonSettingFunc}
 *
 * @group Dialog Framework
 */
export type DialogSettingFunc<TDialog extends IDialog<TDetailsBody>, TSetting, TDetailsBody = void> = (info: IDialogEventInfo<TDialog, TDetailsBody>) => TSetting;

/**
 * A function type that returns a value based on a dialog button event info object.
 *
 * @typeParam TDialog The type of the dialog box.
 * @typeParam TSetting The type of the value.
 * @typeParam TDetailsBody The component shown in the details area of the dialog, or `void`
 *   if no details area is shown or the details type is not set to {@link DialogDetailsType.Custom}.
 *
 * @param info An object providing some context information about the displayed dialog.
 *
 * @returns The retrieved value.
 *
 * @see {@link DialogSettingFunc}
 *
 * @group Dialog Framework
 */
export type DialogButtonSettingFunc<TDialog extends IDialog<TDetailsBody>, TSetting, TDetailsBody = void> = (info: IDialogButtonEventInfo<TDialog, TDetailsBody>) => TSetting;
