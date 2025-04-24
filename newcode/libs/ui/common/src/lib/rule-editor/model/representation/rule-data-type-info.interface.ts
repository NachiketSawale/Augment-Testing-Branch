/*
 * Copyright(c) RIB Software GmbH
 */

/***
 * The structure of all data type response from server
 */
export interface IRuleDataTypeInfo {
	/**
	 * FilterType
	 */
	FilterType: string; // todo

	/**
	 * UiTypes
	 */
	UiTypes: string[];

	/**
	 * DisplayDomainFk
	 */
	DisplayDomainFk: number;

	/**
	 * CompatibleTypes
	 */
	CompatibleTypes: string[]; // todo

	/**
	 * DataPath
	 */
	DataPath: string; // todo
}