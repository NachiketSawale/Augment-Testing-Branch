/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Detailed information about a descriptor.
 * Used to be shown in error dialogues or access denied container component.
 */
export interface IDescriptorInfo {
	/**
	 * Id of descriptor
	 */
	id: number;

	/**
	 * uuid of descriptor
	 */
	uuid: string; // descriptor uuid

	/**
	 * Name of descriptor
	 */
	name: string;

	/**
	 * Additional description
	 */
	description: string | null;

	/**
	 * Sort order path
	 */
	sortOrderPath: string;

	/**
	 * Path === sortOrderPath + '/' + name
	 */
	path: string;
}
