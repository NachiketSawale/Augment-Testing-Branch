/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IDescriptorStructureEntity } from './descriptor-structure-entity.interface';

/**
 * Usermanagement Right Descriptor Structure Entity Details
 */
export interface IDescriptorStructureEntityGenerated extends IEntityBase {
	/**
	 * Entity Id
	 */
	Id: number | null;

	/**
	 * Entity Type
	 */
	Type?: boolean | null;

	/**
	 * Entity Name
	 */
	Name?: string | null;

	/**
	 * Entity Guid
	 */
	Guid?: string | null;

	/**
	 * Entity Parent Guid
	 */
	ParentGuid?: string | null;

	/**
	 * Entity Acces GUID
	 */
	AccessGUID?: string | null;

	/**
	 * Entity Description
	 */
	Description?: string | null;

	/**
	 * Access of Read
	 */
	Read?: boolean | null;

	/**
	 * Access of Write
	 */
	Write?: boolean | null;

	/**
	 * Access of Create
	 */
	Create?: boolean | null;

	/**
	 * Access of Delete
	 */
	Delete?: boolean | null;

	/**
	 * Access of Execute
	 */
	Execute?: boolean | null;

	/**
	 * Access of Read Deny
	 */
	ReadDeny?: boolean | null;

	/**
	 * Access of Write Deny
	 */
	WriteDeny?: boolean | null;

	/**
	 * Access of Create Deny
	 */
	CreateDeny?: boolean | null;

	/**
	 * Access of Delete Deny
	 */
	DeleteDeny?: boolean | null;

	/**
	 * Access of Execute Deny
	 */
	ExecuteDeny?: boolean | null;

	/**
	 * Entity Descriptor Structure Right Parent Details
	 */
	DescriptorStructureRightParent?: IDescriptorStructureEntity | null;

	/**
	 * Entity Descriptor Structure Node
	 */
	Nodes?: IDescriptorStructureEntity[] | null;
}
