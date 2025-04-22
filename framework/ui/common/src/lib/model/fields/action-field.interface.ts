/*
 * Copyright(c) RIB Software GmbH
 */

import { PropertyIdentifier, PropertyType } from '@libs/platform/common';
import { IField } from './field.interface';
import { FieldType } from './field-type.enum';
import { IAdditionalActionOptions } from './additional/additional-action-options.interface';
import { ConcreteMenuItem } from '../menu-list/interface';

/**
 * The definition of a field that represents actions.
 *
 * @group Fields API
 */
export interface IActionField<T extends object> extends IField<T>, IAdditionalActionOptions<T> {

	/**
	 * The type of the row.
	 */
	type: FieldType.Action;

	/**
	 * The property that represents the data model for the field, restricted to menu item array values.
	 */
	model?: PropertyIdentifier<T, PropertyType> & PropertyIdentifier<T, ConcreteMenuItem>;
}
