/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Access right descriptor for template
 */
export interface IAccessRightDescriptor {
	/**
	 * Description of descriptor
	 */
	DescriptorDesc: string;

	/**
	 * Name of desc
	 */
	Name: string;

	/**
	 * Sort order path of descriptor
	 */
	SortOrderPath: string;

	/**
	 * Access mask of descriptor
	 */
	AccessMask: number;

	/**
	 * Module for access mask
	 */
	ModuleName: string;

	/**
	 * Id of access right
	 */
	Id?: number;

	/**
	 * Guid of access right
	 */
	AccessGuid?: string;
}