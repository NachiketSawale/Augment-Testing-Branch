/**
 * Interface for Column Formatter Options
 */

export interface IColumnFormatterOptions {

	lookupType?: string;

	displayMember?: string;

	dataServiceName?: string;

	version?: number;

	imageSelector?: string;

	field?: string;

	decimalPlaces?: number;

	showWeekday?: boolean;

	showHashCode?: boolean;

	filter?: boolean;

	grouping?: boolean;

	groupKey?: string;
}