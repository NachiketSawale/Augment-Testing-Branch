/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {IFormGroup} from './form-group.interface';
import {ConcreteField} from '../../model/fields/concrete-field.type';

export interface IAdditionalFormRowProperties {

	/**
	 * The ID of the form group the row will be placed in.
	 */
	groupId?: string | number;
}

/**
 * Represents a row in a form.
 *
 * @typeParam T The object type to edit in the form.
 *
 * @group Form Generator
 */
export type FormRow<T extends object> = ConcreteField<T> & IAdditionalFormRowProperties;

/**
 * This interface represents a form configuration object that can be processed by the form generator.
 *
 * @typeParam T The object type to edit in the form.
 *
 * @group Form Generator
 */
export interface IFormConfig<T extends object> {

	/**
	 * Controls whether validation should be activated for the fields, if supported by the underlying data model.
	 */
	addValidationAutomatically?: boolean;

	/**
	 * The unique ID of the form.
	 */
	formId?: string;

	/**
	 * Determines whether rows are shown in collapsible groups.
	 */
	showGrouping?: boolean;

	/**
	 * The groups of the form.
	 * If not set, a single default group will be assumed.
	 */
	groups?: IFormGroup[];

	/**
	 * The rows of the form.
	 */
	rows: FormRow<T>[];

}