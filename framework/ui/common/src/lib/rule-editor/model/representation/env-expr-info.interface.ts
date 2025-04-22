/*
 * Copyright(c) RIB Software GmbH
 */

/***
 * The structure of environment expressions response from server
 */
export interface IEnvExprInfo {
	/**
	 * Kind
	 */
	Kind: string;

	/**
	 * Id
	 */
	Id: number,

	/**
	 * IsRange
	 */
	IsRange: boolean;

	/**
	 * Name
	 */
	Name: string;

	/**
	 * UiTypeId
	 */
	UiTypeId: string;

	/**
	 * TargetId
	 */
	TargetId: number;

	/**
	 * IsNullable
	 */
	IsNullable: boolean
}