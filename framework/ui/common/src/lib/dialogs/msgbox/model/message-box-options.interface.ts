/*
 * Copyright(c) RIB Software GmbH
 */

import {
	IDialog,
	IDialogOptions,
	IDialogDetailOptionsExtension
} from '../../base';
import { Translatable } from '@libs/platform/common';
import { InjectionToken } from '@angular/core';

/**
 * Message box options interface.
 *
 * @group Dialogs
 */
export interface IMessageBoxOptions<TDetailsBody = void> extends IDialogOptions<IDialog<TDetailsBody>, TDetailsBody>, IDialogDetailOptionsExtension<TDetailsBody> {

	/**
	 * The text in the body area of the dialog.
	 */
	bodyText?: Translatable;

	/**
	 * Icon class for message type
	 */
	iconClass?: string;
}

const MESSAGE_BOX_OPTIONS = new InjectionToken<IMessageBoxOptions>('msg-box-options');

export function getMessageBoxOptionsToken<TDetailsBody = void>(): InjectionToken<IMessageBoxOptions<TDetailsBody>> {
	return MESSAGE_BOX_OPTIONS;
}
