/*
 * Copyright(c) RIB Software GmbH
 */

import { DialogSettingFunc, IFormConfig, IMasterDetailDialog } from '../../../..';
import { Translatable } from '@libs/platform/common';

/**
 * A single item in a master-detail dialog.
 *
 * @typeParam TValue The type edited in the master-detail dialog box.
 *
 * @group Dialogs
 */
export interface IMasterDetailItem<TValue extends object> {
	/**
	 * Css class for title.
	 */
	cssClass?: string;

	/**
	 * The display name for the item as shown in the list.
	 */
	readonly name?: Translatable | DialogSettingFunc<IMasterDetailDialog<TValue>, Translatable>;

	/**
	 * Indicates whether the master detail item is disabled.
	 * By default, a value of `false` is assumed.
	 */
	readonly disabled?: boolean | DialogSettingFunc<IMasterDetailDialog<TValue>, boolean>;

	/**
	 * Indicates whether the master detail item is visible.
	 * By default, a value of `true` is assumed.
	 */
	readonly visible?: boolean | DialogSettingFunc<IMasterDetailDialog<TValue>, boolean>;

	/**
	 * If present, this must be a standard form configuration that specifies the contents of the
	 * detail area when the item is selected.
	 */
	readonly form?: IFormConfig<TValue>;

	/**
	 * Form entities.
	 */
	readonly value?: TValue;

	/**
	 * A function that indicates whether the item matches a given search text.
	 * The search text is provided as a {@link RegExp} instance.
	 * The expected semantics are that the search term must be a substring of one of the strings that are associated with the item (the actual choice which strings are considered here depends on the use case).
	 * If this function is not provided, only the displayed item name will be checked.
	 */
	readonly matchesSearchText?: (searchPattern: RegExp) => boolean;
}
