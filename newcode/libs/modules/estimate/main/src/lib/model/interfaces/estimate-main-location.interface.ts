/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

/**
 * @brief Interface representing the main locations in an estimate.
 */
export interface IEstimateMainLocation {
	/**
	 * Code
	 */
	Code: string;

	/**
	 * DescriptionInfo
	 */
	DescriptionInfo: IDescriptionInfo;

	/**
	 * ExternalCode
	 */
	ExternalCode: string;

	/**
	 * HasChildren
	 */
	HasChildren: boolean;

	/**
	 * Id
	 */
	Id: number;

	/**
	 *IsShownInChart
	 */
	IsShownInChart: boolean;

	/**
	 * LocationChildren
	 */
	LocationChildren: [];

	/**
	 *	LocationEntities_PrjLocationLevel1Fk: number;
	 */
	LocationEntities_PrjLocationLevel1Fk: number;

	/**
	 *LocationParent
	 */
	LocationParent: [];

	/**
	 * LocationParentFk
	 */
	LocationParentFk: number;

	/**
	 * Locations.
	 */
	Locations: [];

	/**
	 * ProjectFk
	 */
	ProjectFk: number;

	/**
	 * Quantity
	 */
	Quantity: number;
}