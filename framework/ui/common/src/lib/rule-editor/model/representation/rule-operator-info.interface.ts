/*
 * Copyright(c) RIB Software GmbH
 */

import { IRuleOperatorInfoParameter } from './rule-operator-info-parameter.interface';

/***
 * Structure of all operator response from server
 */
export interface IRuleOperatorInfo {
	/**
	 * StringId
	 */
	StringId: string; // enum OperatorKind

	/**
	 * IntId
	 */
	IntId: number; // int value of the corresponding operator kind

	/**
	 * ConditionTypeFk
	 */
	ConditionTypeFk: number;

	/**
	 * DisplayName
	 */
	DisplayName: string;

	/**
	 * If true, operator is shown only for nullable fields
	 */
	OnlyForNullable?: boolean;

	/**
	 * List of UI types for which the operator will be shown
	 */
	UiTypes: string[] | null;

	/**
	 * Parameter list
	 */
	Parameters?: IRuleOperatorInfoParameter[];
}