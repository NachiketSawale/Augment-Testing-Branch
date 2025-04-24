/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';

import { Translatable } from '@libs/platform/common';
import {
	ICustomDialog,
	IDialogButtonBase, IDialogDoNotShowAgain
} from '../..';

/**
 * The interface for objects that provide exactly the data required for a dialog footer.
 *
 * @typeParam TValue The type of the value being edited in the dialog box.
 * @typeParam TDialog The type of the dialog box.
 * @typeParam TDetailsBody The type of the component shown in the details area if
 *   any, otherwise `void`.
 *
 * @see {@link IDialogHeaderModel}
 *
 * @group Dialog Framework
 */
export interface IDialogFooterModel<TValue, TBody, TDetailsBody> {

	/**
	 * The regular buttons.
	 */
	readonly buttons: IDialogButtonBase<ICustomDialog<TValue, TBody,  TDetailsBody>, TDetailsBody>[];

	/**
	 * Additional, custom buttons.
	 */
	readonly customButtons: IDialogButtonBase<ICustomDialog<TValue, TBody,  TDetailsBody>, TDetailsBody>[];

	/**
	 * The ID of the default button.
	 */
	readonly defaultButtonId?: string;

	/**
	 * Executes a click on a button.
	 *
	 * @param btn The button.
	 * @param ev The mouse click event.
	 *
	 * @returns Either `void` or a promise that is resolved when the action has finished.
	 */
	click(btn: IDialogButtonBase<ICustomDialog<TValue, TBody,  TDetailsBody>, TDetailsBody>, ev: MouseEvent): Promise<void> | void;

	/**
	 * Indicates whether a button is visible.
	 *
	 * @param btn The button.
	 *
	 * @returns A value that indicates whether the button is visible.
	 */
	isShown(btn: IDialogButtonBase<ICustomDialog<TValue, TBody,  TDetailsBody>, TDetailsBody>): boolean | undefined;

	/**
	 * Indicates whether a button is disabled.
	 *
	 * @param btn The button.
	 *
	 * @returns A value that indicates whether the button is disabled.
	 */
	isDisabled(btn: IDialogButtonBase<ICustomDialog<TValue, TBody,  TDetailsBody>, TDetailsBody>): boolean | undefined;

	/**
	 * Retrieves the caption of a button.
	 *
	 * @param btn The button.
	 *
	 * @returns The caption of the button.
	 */
	getCaption(btn: IDialogButtonBase<ICustomDialog<TValue, TBody,  TDetailsBody>, TDetailsBody>): Translatable | undefined;

	/**
	 * Retrieves the tooltip of a button.
	 *
	 * @param btn The button.
	 *
	 * @returns The tooltip of the button.
	 */
	getTooltip(btn: IDialogButtonBase<ICustomDialog<TValue, TBody,  TDetailsBody>, TDetailsBody>): string | undefined;

	/**
	 * The *Do not show again* options of the dialog box.
	 */
	readonly doNotShowAgain?: IDialogDoNotShowAgain;
}

const DLG_FOOTER_MODEL_TOKEN = new InjectionToken('dlg-footer-model');

/**
 * Provides an injection token for {@link IDialogFooterModel | dialog footer data}.
 *
 * @typeParam TValue The type of the value being edited in the dialog box.
 * @typeParam TDialog The type of the dialog box.
 * @typeParam TDetailsBody The type of the component shown in the details area if
 *   any, otherwise `void`.
 *
 * @returns The injection token.
 *
 * @see {@link getDialogFooterModelToken}
 * @see {@link IDialogFooterModel}
 *
 * @group Dialog Framework
 */
export function getDialogFooterModelToken<TValue, TBody, TDetailsBody>(): InjectionToken<IDialogFooterModel<TValue, TBody, TDetailsBody>> {
	return DLG_FOOTER_MODEL_TOKEN;
}
