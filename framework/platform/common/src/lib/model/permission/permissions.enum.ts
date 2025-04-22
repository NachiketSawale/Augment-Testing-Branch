/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Enum defining all available access rights
 */
export enum Permissions {
	/**
	 * Read permission (read access right)
	 */
	Read = 0x01,
	/**
	 * Read permission (read access right)
	 * @deprecated please use Permissions.Read
	 */
	//read = 0x01,
	/**
	 * Write permission (write access right)
	 */
	Write= 0x02,

	/**
	 * Create permission (create access right)
	 */
	Create = 0x04,

	/**
	 * Delete permission (delete access right)
	 */
	Delete = 0x08,

	/**
	 * Execute permission (execute access right)
	 */
	Execute = 0x10,
}
