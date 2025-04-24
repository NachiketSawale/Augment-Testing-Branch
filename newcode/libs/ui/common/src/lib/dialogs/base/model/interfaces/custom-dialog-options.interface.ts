/*
 * Copyright(c) RIB Software GmbH
 */

import { StaticProvider, Type } from '@angular/core';

import { IEditorDialogOptions } from './editor-dialog-options.interface';
import { ICustomDialog } from './custom-dialog.interface';
import { IDialogDetailOptionsExtension } from './dialog-detail-options-extension.interface';

/**
 * An interface that represents the configuration for a custom dialog box.
 *
 * @group Dialog Framework
 */
export interface ICustomDialogOptions<TValue, TBody, TDetailsBody = void> extends IEditorDialogOptions<TValue, ICustomDialog<TValue, TBody, TDetailsBody>, TDetailsBody>, IDialogDetailOptionsExtension<TDetailsBody> {

	/**
	 * The Component for the body area of the dialog content (body).
	 */
	readonly bodyComponent: Type<TBody>;

	/**
	 * An optional array of custom injection providers for the body component.
	 */
	readonly bodyProviders?: StaticProvider[];
}
