/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface CosObjectTemplatePropertyEntityBase extends IEntityBase {
	/**
	 * BasUomFk
	 */
	BasUomFk?: number | null;

	/**
	 * Formula
	 */
	Formula?: string | null;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * MdlPropertyKeyFk
	 */
	MdlPropertyKeyFk: number;

	/**
	 * PropertyValueBool
	 */
	PropertyValueBool: boolean | null;

	/**
	 * PropertyValueDate
	 */
	PropertyValueDate: string | Date | null;

	/**
	 * PropertyValueLong
	 */
	PropertyValueLong: number | null;

	/**
	 * PropertyValueNumber
	 */
	PropertyValueNumber: number | null;

	/**
	 * PropertyValueText
	 */
	PropertyValueText: string | null;

	ValueType?: number | null;

	Value?: number | string | boolean | Date | null;
}
