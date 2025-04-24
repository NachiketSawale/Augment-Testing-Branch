/*
 * Copyright(c) RIB Software GmbH
 */

import { IReadOnlyPropertyAccessor, Translatable } from '@libs/platform/common';

/**
 * Defines a custom UI representation for a given field in an entity type.
 *
 * @group Layout Configuration
 */
export interface IFieldOverload<T extends object> {

	/**
	 * Indicates whether the field is supposed to be read-only.
	 */
	readonly readonly?: boolean;

	/**
	 * A custom object to get and set the value on the underlying entity object.
	 */
	readonly valueAccessor?: IReadOnlyPropertyAccessor<T>;

	/**
	 * Indicates whether the field is visible.
	 */
	readonly visible?: boolean;

	/**
	 * The human-readable caption of the field.
	 */
	readonly label?: Translatable;

	/**
	 * A tooltip text for the control.
	 */
	readonly tooltip?: Translatable;

	/**
	 * If set to `true`, the field will be excluded from the layout.
	 */
	readonly exclude?: boolean;
}