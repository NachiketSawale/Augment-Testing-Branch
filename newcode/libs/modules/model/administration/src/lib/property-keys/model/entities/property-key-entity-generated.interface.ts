/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPropertyKeyEntityGenerated extends IEntityBase {

	/*
	 * BasUomDefaultFk
	 */
	BasUomDefaultFk?: number | null;

	/*
	 * DefaultValueBool
	 */
	DefaultValueBool: boolean;

	/*
	 * DefaultValueDate
	 */
	DefaultValueDate: string;

	/*
	 * DefaultValueLong
	 */
	DefaultValueLong: number;

	/*
	 * DefaultValueNumber
	 */
	DefaultValueNumber: number;

	/*
	 * DefaultValueText
	 */
	DefaultValueText?: string | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * PropertyName
	 */
	PropertyName?: string | null;

	/*
	 * TagIds
	 */
	TagIds?: number[] | null;

	/*
	 * UseDefaultValue
	 */
	UseDefaultValue: boolean;

	/*
	 * ValueType
	 */
	ValueType?: 'String' | 'Decimal' | 'Integer' | 'Boolean' | 'DateTime' | null;

	/*
	 * ValueTypeFk
	 */
	ValueTypeFk: number;
}
