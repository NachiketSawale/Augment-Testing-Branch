/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Parameters for report.
 */
export interface IReportParameter {
	dataType: string;
	isVisible: boolean;
	defaultValue: string | null;
	name: string | null;
	parameterName: string;
	context: number;
	values: { name: string, value: number | null }[];
}