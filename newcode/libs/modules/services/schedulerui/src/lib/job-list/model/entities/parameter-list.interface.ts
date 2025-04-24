/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Used to initialized parameter list
 */
export interface IParameterList {
	/**
	 * Description
	 */
	Description: string | null;

	/**
	 * Name
	 */
	Name: string;

	/**
	 * Password
	 */
	Password?: boolean;

	/**
	 * ReadOnly
	 */
	ReadOnly?: boolean;

	/**
	 * Required
	 */
	Required?: boolean;

	/**
	 * Type
	 */
	Type: string;

	/**
	 * value
	 */
	Value: string;

	/**
	 * Id
	 */
	Id?: number;

	/**
	 * DescriptionKey.
	 */
	DescriptionKey?: string | null;
}
