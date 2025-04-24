/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityRuntimeData } from '@libs/platform/data-access';
import { IAccessRoleEntity } from './access-role-entity.interface';

/**
 * Role Category Info
 */
export interface IAccessRoleCategory {
	/**
	 * Role Name
	 */
	Name: string;

	/**
	 * Role Description
	 */
	Description?: string;

	/**
	 * Id
	 */
	Id: number;
}

/**
 * Access Category Roles Details
 */
export interface IAccessRoleCategoryDetails {
	/**
	 * Selected Entity Role
	 */
	selectedRoles: IAccessRoleEntity[];
	/**
	 * Access Role Category
	 */
	categories: IAccessRoleCategory[];
}

/**
 * Access Role Category Entity
 */
export interface IAccessRoleCategoryEntity {
	/**
	 * Select Role Count
	 */
	roleCount?: number;
	/**
	 * Access Role Category
	 */
	category: number;
}

/**
 * Access Role Category Entry
 */
export interface IAccessRoleCategoryEntry {
	/**
	 * Access Role Category Entity
	 */
	item: IAccessRoleCategoryEntity;
	/**
	 * Entity Runtime Data on IAccessRoleCategoryEntity
	 */
	runtime?: EntityRuntimeData<IAccessRoleCategoryEntity>;
}

/**
 * Update Role Category Request Data
 */
export interface IUpdateCategoryBulk {
	/**
	 *  Role New Category
	 */
	NewCategory: number;
	/**
	 * selected Role Id
	 */
	RoleIds: number[];
}
