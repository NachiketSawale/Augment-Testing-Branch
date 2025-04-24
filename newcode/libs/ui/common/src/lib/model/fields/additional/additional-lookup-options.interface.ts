/*
 * Copyright(c) RIB Software GmbH
 */

import { ReferenceFormat, Translatable } from '@libs/platform/common';
import { ILookupOptions } from '../../../lookup';
import { IAdditionalColumnProperties } from '../../../grid';
import { IAdditionalFormRowProperties } from '../../../form';
import { IField } from '../field.interface';

/**
 * Defines additional options for lookup fields.
 *
 * @group Fields API
 */
export interface IFieldLookupOptions<T extends object> {

	/**
	 * Get type-safe lookup options
	 */
	getTypedOptions<TItem extends object>(): ILookupOptions<TItem, T>;
}

/**
 * Defines special options for lookup fields.
 */
export interface IAdditionalLookupOptions<T extends object> {

	/**
	 * Controls the options for the lookup.
	 */
	lookupOptions: IFieldLookupOptions<T>;

	/**
	 * Specifies the format that record references are saved as.
	 */
	format?: ReferenceFormat;

	/**
	 * Additional display fields on grid or form or both
	 */
	additionalFields?: ITypedAdditionalLookupField<T>[];
}

export function createLookup<TEntity extends object, TItem extends object>(config: ILookupOptions<TItem, TEntity>): IFieldLookupOptions<TEntity> {
	return {
		...config,
		getTypedOptions<TItem extends object>(): ILookupOptions<TItem, TEntity> {
			return config as unknown as ILookupOptions<TItem, TEntity>;
		}
	};
}

/**
 * Additional lookup field interface, the default id of which is model+displayMember
 */
export interface IAdditionalLookupField {
	/**
	 * Display member from lookup entity
	 */
	displayMember: string;
	/**
	 * The id of this additional field, default is model+displayMember
	 */
	id?: string;
	/**
	 * Column label
	 */
	label?: Translatable;
	/**
	 * Column options
	 */
	column?: boolean | IAdditionalColumnProperties;
	/**
	 * Row options
	 */
	row?: boolean | IAdditionalFormRowProperties;
	/**
	 * Display additional fields side by side in single row
	 */
	singleRow?: boolean;
}

/**
 * Extends the IAdditionalLookupField interface to include type-safe column and row properties.
 *
 * @template T - The type of the object.
 */
export interface ITypedAdditionalLookupField<T extends object> extends Partial<IField<T>>, IAdditionalLookupField {
	/**
	 * Controls the options for this additional lookup field.
	 */
	lookupOptions?: IFieldLookupOptions<T>;
}

/**
 * Create additional lookup field id
 * @param field
 * @param addition
 */
export function createAdditionalLookupFieldId(field: string, addition: IAdditionalLookupField) {
	return addition.id || (field + addition.displayMember);
}