/*
 * Copyright(c) RIB Software GmbH
 */

import {
	Translatable,
	PropertyIdentifier,
	PropertyType
} from '@libs/platform/common';
import {FieldType} from './field-type.enum';
import { IFieldValueChangeInfo } from './field-value-change-info.interface';
import { FieldValidator } from './field-validator.type';

/**
 * The base interface for fields in a field host, such as a [form configuration]{@link IFormConfig}
 * or in a list of grid columns.
 *
 * @typeParam T The object type the field refers to.
 * @typeParam P The type of the property edited in the field.
 *
 * @group Fields API
 */
export interface IField<T extends object, P extends PropertyType = PropertyType> {

	/**
	 * The ID of the field, unique within the enclosing [form configuration]{@link IFormConfig} or grid.
	 */
	id: string;

	/**
	 * The property that represents the data model for the field.
	 */
	model?: PropertyIdentifier<T, P>;

	/**
	 * Indicates whether the field is set to read-only.
	 */
	readonly?: boolean;

	/**
	 * Indicates whether the field is visible.
	 */
	visible?: boolean;

	/**
	 * Indicates whether the field must receive a value.
	 */
	required?: boolean;

	/**
	 * The human-readable caption of the field.
	 *
	 * If this is `undefined`, the renderer of the field may extend the size
	 * of the control representing the field to occupy the space otherwise
	 * reserved for its label.
	 */
	label?: Translatable;

	/**
	 * A tooltip text for the control.
	 */
	tooltip?: Translatable;

	/**
	 * Fields are sorted based on this value, then by their order of declaration.
	 */
	sortOrder?: number;

	/**
	 * A custom validator supplied on the UI level.
	 */
	validator?: FieldValidator<T>;

	/**
	 * The type of the field.
	 */
	type: FieldType;

	/**
	 * An optional function that is called right before the value in the field changes.
	 * @param changeInfo An object that contains some additional information about the change.
	 */
	changing?: (changeInfo: IFieldValueChangeInfo<T, P>) => void;

	/**
	 * An optional function that is called when the value in the field has changed.
	 * @param changeInfo An object that contains some additional information about the change.
	 */
	change?: (changeInfo: IFieldValueChangeInfo<T, P>) => void;
}