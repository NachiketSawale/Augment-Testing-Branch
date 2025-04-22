/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

/**
 * Represents a structure of a Translation History Item
 */
export interface ITranslationIssueHistory extends IEntityBase{
	/**
	 * Id
	 */
	Id: number;

	/**
	 * Performed action
	 */
	ActionTaken: number;

	/**
	 * BasTranslationFk value
	 */
	BasTranslationFk: number;

	/**
	 * The item property name
	 */
	ColumnName: string;

	/**
	 * The column value where the issue was found
	 */
	ColumnValue: string;
}