/*
 * Copyright(c) RIB Software GmbH
 */

/***
 * Structure of parameters array item in IRuleOperatorInfo
 */
export interface IRuleOperatorInfoParameter {
	/**
	 * DisplayText
	 */
	DisplayText: string;

	/**
	 * IsSet
	 */
	IsSet?: boolean;

	/**
	 * AllowRange
	 */
	AllowRange?: boolean;
}