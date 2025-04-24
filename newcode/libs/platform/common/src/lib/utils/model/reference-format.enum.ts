/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Defines how a reference to a database record is stored.
 */
export enum ReferenceFormat {

	/**
	 * The reference is stored as a simple integer value.
	 */
	Integer = 0,

	/**
	 * The reference is stored as an {@link IIdentificationData} object.
	 */
	IdentificationData = 1
}