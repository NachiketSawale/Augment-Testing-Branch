/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Represents an access level/storage location for configuration data.
 */
export enum AccessScope {

	/**
	 * The configuration data is only accessible to the current user.
	 */
	User = 1,

	/**
	 * The configuration data is only accessible to users in the current permission role.
	 */
	Role = 2,

	/**
	 * The configuration data is accessible to all users.
	 */
	Global = 3,

	/**
	 * The configuration data is accessible to portal users.
	 */
	Portal = 4
}
