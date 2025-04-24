/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * @brief Interface for Estimate Project Estimation Type
 */
export interface IEstimateProjectEstType {
	/*
	 * ItemValue
	 */

	ItemValue?: number;

	/*
	 * DisplayValue
	 */
	DisplayValue?: string;

	/*
	 * Sorting
	 */
	Sorting: number;

	/*
	 * IsDefault
	 */
	IsDefault: boolean;

	/*
	 * IsLive
	 */
	IsLive: boolean;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * CustomIntProperty
	 */
	CustomIntProperty: number;

	/*
	 * CustomIntProperty1
	 */
	CustomIntProperty1: number;

	/*
	 * CustomBoolProperty
	 */
	CustomBoolProperty: boolean;

	/*
	 * CustomBoolProperty1
	 */
	CustomBoolProperty1: boolean;

	/*
	 * MasterDataContextFk
	 */
	MasterDataContextFk: number;
}