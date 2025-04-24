/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IInstanceHeaderParameterEntityGenerated extends IEntityBase {
	/**
	 * CosGlobalParamFk
	 */
	CosGlobalParamFk: number;

	/**
	 * CosGlobalParamvalueFk
	 */
	CosGlobalParamvalueFk?: number | null;

	/**
	 * CosInsHeaderFk
	 */
	CosInsHeaderFk: number;

	/**
	 * CosMasterParameterType
	 */
	CosMasterParameterType?: string | null;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * IsLookup
	 */
	IsLookup: boolean;

	/**
	 * ParameterValue
	 */
	ParameterValue?: string | number | boolean | Date | null;

	/**
	 * ParameterValueVirtual
	 */
	ParameterValueVirtual?: string | number | boolean | Date | null;

	/**
	 * Sorting
	 */
	Sorting: number;

	/**
	 * UomValue
	 */
	UomValue?: string | null;
}
