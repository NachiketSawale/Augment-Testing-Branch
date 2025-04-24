/*
 * Copyright(c) RIB Software GmbH
 */

import { ISimpleRowEntity } from './simple-row-entity.interface';

export interface ICompareRowEntity extends ISimpleRowEntity<string> {
	/**
	 * ConditionalFormat
	 */
	ConditionalFormat?: string | null;

	/**
	 * DeviationField
	 */
	DeviationField: boolean;

	/**
	 * DeviationPercent
	 */
	DeviationPercent?: number | null;

	/**
	 * DeviationReference
	 */
	DeviationReference?: number | null;

	/**
	 * Field
	 */
	Field: string;

	/**
	 * FieldType
	 */
	FieldType: number;

	/**
	 * IsLeading
	 */
	IsLeading: boolean;

	/**
	 * IsLive
	 */
	IsLive?: boolean | null;

	/**
	 * IsQuoteField
	 */
	IsQuoteField: boolean;

	/**
	 * IsSorting
	 */
	IsSorting: boolean;

	/**
	 * ShowInSummary
	 */
	ShowInSummary: boolean;

	/**
	 * Sorting
	 */
	Sorting: number;

	/**
	 * Visible
	 */
	Visible: boolean;

	/**
	 * Default Description
	 */
	DefaultDescription?: string;

	/**
	 * Allow Edit
	 */
	AllowEdit?: boolean;

	/**
	 * Field Name
	 */
	FieldName?: string;

	/**
	 * Display Name
	 */
	DisplayName?: string;
}
