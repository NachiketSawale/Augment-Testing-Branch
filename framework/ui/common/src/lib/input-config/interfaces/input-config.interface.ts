/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Interface representing the configuration for an input element.
 */
export interface IInputConfig {
	/**
	 * The unique identifier for the input element.
	 */
	id?: string;

	/**
	 * The class or classes to be applied to the input element.
	 */
	class?: string | string[];

	/**
	 * A dictionary of style properties to be applied to the input element.
	 */
	style?: { [key: string]: string | number };

	/**
	 * The title of the input element.
	 */
	title?: string;

	/**
	 * The placeholder text for the input element.
	 */
	placeholder?: string;
}
