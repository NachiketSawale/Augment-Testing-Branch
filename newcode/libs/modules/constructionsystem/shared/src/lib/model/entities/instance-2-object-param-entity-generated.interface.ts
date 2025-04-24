/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IInstance2ObjectParamEntityGenerated extends IEntityBase {
	/**
	 * Id
	 */
	Id: number;

	/**
	 * Instance2ObjectFk
	 */
	Instance2ObjectFk: number;

	/**
	 * IsInherit
	 */
	IsInherit: boolean;

	/**
	 * IsLookup
	 */
	IsLookup: boolean;

	/**
	 * LastEvaluated
	 */
	LastEvaluated?: string | null;

	/**
	 * ModelPropertyFk
	 */
	ModelPropertyFk?: number | null;

	/**
	 * ParameterFk
	 */
	ParameterFk: number;

	/**
	 * ParameterValue
	 */
	ParameterValue?: string | null;

	/**
	 * ParameterValueFk
	 */
	ParameterValueFk?: number | null;

	/**
	 * ParameterValueVirtual
	 */
	ParameterValueVirtual?: string | null;

	/**
	 * PropertyName
	 */
	PropertyName?: string | null;

	/**
	 * QuantityQuery
	 */
	QuantityQuery?: string | null;

	/**
	 * ValueDetail
	 */
	ValueDetail?: string | null;
}
