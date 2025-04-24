/*
 * Copyright(c) RIB Software GmbH
 */

import { StaticProvider, Type } from '@angular/core';
import { Translatable } from '@libs/platform/common';
import { DialogDetailsType } from '../enums/dialog-details-type.enum';

/**
 * The base interface for options for the details area of a dialog box.
 *
 * @group Dialog Framework
 */
export interface IDialogDetailOptions {

	/**
	 * The type of the details area.
	 *
	 * There are multiple pre-defined types of details areas available.
	 * Alternatively, this value can be set to {@link DialogDetailsType.Custom} to
	 * display a custom component.
	 */
	readonly type: DialogDetailsType;

	/**
	 * Cssclass for details element.
	 */
	cssClass?: string;

	/**
	 * Boolean to show/hide the details
	 */
	show?: boolean;

	/**
	 * A custom caption for the *Show Details* button.
	 */
	showCaption?: Translatable;

	/**
	 * A custom caption for the *Hide Details* button.
	 */
	hideCaption?: Translatable;
}

/**
 * Dialog details options for a grid-based details area.
 *
 * @group Dialog Framework
 */
export interface IDialogGridDetailOptions extends IDialogDetailOptions {

	readonly type: DialogDetailsType.Grid;
}

/**
 * Dialog details options for a long-text-based details area.
 *
 * @group Dialog Framework
 */
export interface IDialogTextDetailOptions extends IDialogDetailOptions {

	readonly type: DialogDetailsType.LongText;

	/**
	 * The text to display in the details area.
	 */
	value: string;
}

/**
 * Dialog details options for a details area that displays a custom component.
 *
 * @typeParam TDetailsBody The type of the component to show in the details area.
 *
 * @group Dialog Framework
 */
export interface IDialogCustomDetailOptions<TDetailsBody> extends IDialogDetailOptions {

	readonly type: DialogDetailsType.Custom;

	/**
	 * The Component for the body area of the dialog details.
	 */
	readonly bodyComponent: Type<TDetailsBody>;

	/**
	 * An optional array of custom injection providers for the details body component.
	 */
	readonly bodyProviders?: StaticProvider[];
}

/**
 * An options object for a dialog details area.
 *
 * @typeParam TDetailsBody The type of the component that is displayed in the details
 *   area if {@link IDialogDetailOptions.type} is {@link DialogDetailsType.Custom}, otherwise
 *   `void`.
 *
 * @see {@link IDialogDetailOptions}
 * @see {@link IDialogGridDetailOptions}
 * @see {@link IDialogTextDetailOptions}
 * @see {@link IDialogCustomDetailOptions}
 * @see {@link isDialogGridDetailOptions}
 * @see {@link isDialogTextDetailOptions}
 * @see {@link isDialogCustomDetailOptions}
 *
 * @group Dialog Framework
 */
export type ConcreteDialogDetailOptions<TDetailsBody = void> =
	IDialogGridDetailOptions |
	IDialogTextDetailOptions |
	IDialogCustomDetailOptions<TDetailsBody>;

/**
 * Checks whether a given dialog details options object describes a grid-based details area.
 *
 * @param options The options object.
 *
 * @group Dialog Framework
 */
export function isDialogGridDetailOptions<TDetailsBody = void>(options?: ConcreteDialogDetailOptions<TDetailsBody>): options is IDialogGridDetailOptions {
	return options?.type === DialogDetailsType.Grid;
}

/**
 * Checks whether a given dialog details options object describes a long-text-based details area.
 *
 * @param options The options object.
 *
 * @group Dialog Framework
 */
export function isDialogTextDetailOptions<TDetailsBody = void>(options?: ConcreteDialogDetailOptions<TDetailsBody>): options is IDialogTextDetailOptions {
	return options?.type === DialogDetailsType.LongText;
}

/**
 * Checks whether a given dialog details options object describes a custom details area.
 *
 * @param options The options object.
 *
 * @group Dialog Framework
 */
export function isDialogCustomDetailOptions<TDetailsBody = void>(options?: ConcreteDialogDetailOptions<TDetailsBody>): options is IDialogCustomDetailOptions<TDetailsBody> {
	return options?.type === DialogDetailsType.Custom;
}
