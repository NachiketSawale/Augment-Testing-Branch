/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * Represents configuration options for a *select* control.
 *
 * @group Fields API
 */
export interface ISelectOptions {

	/**
	 * The name of the member on each item interpreted as the value.
	 */
	valueMember?: string;

	/**
	 * The name of the member on each item used as the human-readable name.
	 */
	displayMember?: string;
}