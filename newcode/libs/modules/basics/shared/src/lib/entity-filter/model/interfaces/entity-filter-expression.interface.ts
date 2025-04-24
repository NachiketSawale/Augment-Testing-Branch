/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityFilterType, EntityFilterOperator } from '../enums';

/**
 * Interface representing an entity filter expression.
 */
export interface IEntityFilterExpression {
	/** The id of filter */
	Id: string;

	/** The source of filter */
	Source: number;

	/** The type of filter */
	Type: EntityFilterType;

	/** Active Operator */
	Operator?: EntityFilterOperator;

	/** Factors */
	Factors?: unknown[];

	/** Predefined factors */
	PredefinedFactors?: unknown[];

	/** Descriptions of factors */
	Descriptions?: string[];

	/** readonly indicator */
	Readonly?: boolean;
}
