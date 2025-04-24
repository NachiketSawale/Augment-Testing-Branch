/*
 * Copyright(c) RIB Software GmbH
 */

import { PropertyType } from '@libs/platform/common';

/**
 * Provides some information about a changed value in a form.
 *
 * @typeParam T The object type the field refers to.
 *
 * @group Form Generator
 */
export interface IFormValueChangeInfo<T extends object> {

	/**
	 * The old value.
	 */
	readonly oldValue: PropertyType | null | undefined;

	/**
	 * The new value.
	 */
	readonly newValue: PropertyType | null | undefined;

	/**
	 * The ID of the changed row.
	 */
	readonly rowId: string;

	/**
	 * A reference to the entity object being edited.
	 */
	readonly entity: T;
}
