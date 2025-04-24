/*
 * Copyright(c) RIB Software GmbH
 */

import { ICosInstanceEntity } from './instance-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IInstanceParameterEntityGenerated extends IEntityBase {
	/**
	 * Id
	 */
	Id: number;

	/**
	 * InstanceEntity
	 */
	InstanceEntity?: ICosInstanceEntity | null;

	/**
	 * InstanceFk
	 */
	InstanceFk: number;

	/**
	 * InstanceHeaderFk
	 */
	InstanceHeaderFk: number;

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
