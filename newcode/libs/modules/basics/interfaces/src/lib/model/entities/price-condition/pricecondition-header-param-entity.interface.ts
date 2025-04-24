/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPriceConditionHeaderParamEntity extends IEntityBase {

	/**
	 * Code
	 */
	Code?: string | null;

	/**
	 * CommentText
	 */
	CommentText?: string | null;

	/**
	 * ContextFk
	 */
	ContextFk: number;

	/**
	 * Formula
	 */
	Formula?: string | null;

	/**
	 * Id
	 */
	Id: number;

	/**
	 * PriceConditionTypeFk
	 */
	PriceConditionTypeFk: number;

	/**
	 * Type
	 */
	Type: number;

	/**
	 * Value
	 */
	Value: number;
}
