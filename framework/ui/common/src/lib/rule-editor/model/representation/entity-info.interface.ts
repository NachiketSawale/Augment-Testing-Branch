/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityField } from './entity-field.interface';
import { IEntityFieldCategory } from './entity-field-category.interface';
import { IDynamicFieldSelector } from './dynamic-field-selector.interface';
import { IFieldEnumType } from './field-enum-type.interface';

/**
 * Represents an entity with its fields' information.
 * Used for loading the rule editor.
 * The entity fields hierarchy response contain an array of this type of objects.
 */
export interface IEntityInfo {
	/**
	 * Id
	 */
	Id: number;

	/**
	 * DisplayName
	 */
	DisplayName: string;

	/**
	 * Categories
	 */
	Categories: IEntityFieldCategory[];

	/**
	 * Fields
	 */
	Fields: IEntityField[];

	/**
	 * EnumTypes
	 */
	EnumTypes: IFieldEnumType[];

	/**
	 * DynamicFieldSelectors
	 */
	DynamicFieldSelectors: IDynamicFieldSelector[];
}