/*
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '../../..';
import { AccessScope } from '..';

/**
 * Stores information about an {@link AccessScope}.
 */
export interface IAccessScopeInfo {

	/**
	 * The access scope value.
	 */
	readonly scope: AccessScope;

	/**
	 * The unique short ID of the access scope.
	 */
	readonly id: string;

	/**
	 * The unique long ID of the access scope.
	 */
	readonly longId: string;

	/**
	 * The unique value of the access scope.
	 */
	readonly value: string;

	/**
	 * The human-readable title of the access scope (normally, same as {@link name}.
	 */
	readonly title: Translatable;

	/**
	 * The human-readable title of the access scope (normally, same as {@link title}.
	 */
	readonly name: Translatable;

	/**
	 * The priority of the access scope, used for sorting and fallback evaluations.
	 */
	readonly priority: number;
}