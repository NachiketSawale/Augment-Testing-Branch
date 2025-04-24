/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * chart basic config options
 */
export interface  IChartConfigOption {
	/**
	 * The chart type ID.
	 */
	ChartTypeId: number;
	/**
	 * set zero value show in chart
	 */
	HideZeroValue: boolean;
	/**
	 * set zero value render
	 */
	HideZeroValueX: boolean;
	/**
	 * set chart can be DrillDown
	 */
	DrillDownForData: boolean;
	/**
	 * set Title can show in chart
	 */
	ShowTitle: boolean;
	/**
	 * chart title string
	 */
	Title: string;
	/**
	 * chart title align position
	 */
	TitleAlign: number;
	/**
	 * set show date label
	 */
	ShowDataLabel: boolean;
	/**
	 * set Legend align
	 */
	LegendAlign:number;
	/**
	 * set Legend show
	 */
	ShowLegend: boolean;
	/**
	 * set reverse chart date list
	 */
	ReverseOrder: boolean;
	/**
	 * set show chart x Axis title
	 */
	ShowXAxis: boolean;
	/**
	 * set chart x Axis title
	 */
	XTitle: string;
	/**
	 * set hidden x Axis line
	 */
	HideXGridLine: boolean;
	/**
	 * set show chart y Axis title
	 */
	ShowYAxis: boolean;
	/**
	 * set chart y Axis title
	 */
	YTitle: string;
	/**
	 * set hidden y Axis line
	 */
	HideYGridLine: boolean;
}