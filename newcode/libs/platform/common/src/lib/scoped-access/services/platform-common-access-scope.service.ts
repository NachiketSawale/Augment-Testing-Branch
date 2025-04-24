/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';

import { Permissions, PlatformPermissionService, Translatable } from '../../..';

import { AccessScope, AccessScopedPermissions, IAccessScopeInfo } from '..';
import { AccessPermissionData, RequiredAccessPermission } from '../model/required-access-permissions.type';
import { CheckAccessRightsResult } from '../model/check-access-rights-result.type';

const accessScopeSettings = new Map<AccessScope, IAccessScopeInfo>([
	[AccessScope.User, {
		scope: AccessScope.User,
		id: 'u',
		longId: 'user',
		value: '0',
		title: {
			key: 'basics.common.configLocation.user'
		},
		get name(): Translatable {
			return this.title;
		},
		priority: 1000
	}],
	[AccessScope.Role, {
		scope: AccessScope.Role,
		id: 'r',
		longId: 'role',
		value: '2',
		title: {
			key: 'basics.common.configLocation.role'
		},
		get name(): Translatable {
			return this.title;
		},
		priority: 100
	}],
	[AccessScope.Global, {
		scope: AccessScope.Global,
		id: 'g',
		longId: 'system',
		value: '1',
		title: {
			key: 'basics.common.configLocation.system'
		},
		get name(): Translatable {
			return this.title;
		},
		priority: 10
	}],
	[AccessScope.Portal, {
		scope: AccessScope.Portal,
		id: 'p',
		longId: 'portal',
		value: '3',
		title: {
			key: 'basics.common.configLocation.portal'
		},
		get name(): Translatable {
			return this.title;
		},
		priority: 50
	}]
]);


/**
 * This service provides utility routines for working with the {@link AccessScope} type.
 */
@Injectable({
	providedIn: 'root'
})
export class PlatformCommonAccessScopeService {

	private readonly platformPermissionService = inject(PlatformPermissionService);

	/**
	 * Returns an object with information about a given access scope.
	 * @param scope The access scope.
	 * @returns The information object about the access scope.
	 * @throws `Error` if `scope` has an unknown value
	 */
	public getInfo(scope: AccessScope): IAccessScopeInfo {
		const result = accessScopeSettings.get(scope);
		if (!result) {
			throw new Error(`Unknown access scope: ${scope}`);
		}
		return result;
	}

	/**
	 * Returns an object with information about a given access scope based on the scope's short ID.
	 * @param id The short ID of the access scope.
	 * @returns The information object about the access scope.
	 * @throws `Error` if `id` has an unknown value
	 */
	public getInfoById(id: string): IAccessScopeInfo {
		for (const pair of accessScopeSettings) {
			if (pair[1].id === id) {
				return pair[1];
			}
		}

		throw new Error(`Unknown access scope ID: ${id}`);
	}

	/**
	 * Returns an object with information about a given access scope based on the scope's long ID.
	 * @param longId The long ID of the access scope.
	 * @returns The information object about the access scope.
	 * @throws `Error` if `longId` has an unknown value
	 */
	public getInfoByLongId(longId: string): IAccessScopeInfo {
		for (const pair of accessScopeSettings) {
			if (pair[1].longId === longId) {
				return pair[1];
			}
		}

		throw new Error(`Unknown access scope ID: ${longId}`);
	}

	/**
	 * Checks whether something from one access scope can access something from another access scope.
	 * @param from The short or long ID of the source access scope.
	 * @param to The short or long ID of the target access scope.
	 * @returns A value that indicates whether something from scope `from` can access something from
	 *   scope `to`.
	 * @throws `Error` if `from` or `to` has an unknown value
	 */
	public canAccess(from: AccessScope, to: AccessScope): boolean {
		const fromScope = this.getInfo(from);
		const toScope = this.getInfo(to);

		return fromScope.priority >= toScope.priority;
	}

	/**
	 * Returns all supported {@link AccessScope} values.
	 *
	 * @returns The values.
	 */
	public getAllScopes(): AccessScope[] {
		return Array.from(accessScopeSettings.keys());
	}


	/**
	 * Checks whether certain permissions are granted by access scope.
	 * 
	 * @param {AccessScopedPermissions | AccessScopedPermissions[]} requiredPermissions
	 * permission items with access scope
	 * 
	 * @returns {Promise<CheckAccessRightsResult | CheckAccessRightsResult[]>}
	 * Returns a promise that is resolved to an object with one property per access
	 * scope. Each property contains a boolean value that is `true` 
	 * if and only if all permissions for the access scope are granted.
	 */
	public async checkAccessRights(requiredPermissions: AccessScopedPermissions | AccessScopedPermissions[]): Promise<CheckAccessRightsResult | CheckAccessRightsResult[]> {

		const checkAllAccessRightsResult: CheckAccessRightsResult[] = [];

		if (Array.isArray(requiredPermissions)) {

			await Promise.all(requiredPermissions.map(async (item) => {
				const result = await this.processRequiredPermissionItems(item);
				checkAllAccessRightsResult.push(result);
				return result;
			}));

			return checkAllAccessRightsResult;

		} else {
			const checkAccessRightsResult = await this.processRequiredPermissionItems(requiredPermissions);

			return checkAccessRightsResult;
		}
	}


	/**
	 * Processes permission items data and returns if permissions are granted by access
	 * scope.
	 * 
	 * @param {AccessScopedPermissions} requiredPermissions permission items with 
	 * access scope
	 * @returns {Promise<CheckAccessRightsResult>} Returns a promise that is resolved 
	 * to an object with one property per access scope.
	 */
	public async processRequiredPermissionItems(requiredPermissions: AccessScopedPermissions): Promise<CheckAccessRightsResult> {
		const requiredAccess: AccessPermissionData = {
			allDescriptors: [],
			u: [],
			r: [],
			g: [],
			p: []
		};

		this.retrieveRequiredPermissionsData(requiredPermissions, requiredAccess);

		if (requiredAccess.allDescriptors.length > 0) {

			await this.platformPermissionService.loadPermissions(requiredAccess.allDescriptors);
			const result = this.checkForRequiredPermissions(requiredAccess);
			return result;

		} else {
			const result = {} as CheckAccessRightsResult;
			accessScopeSettings.forEach((accessScope) => {
				result[accessScope.scope as keyof CheckAccessRightsResult] = true;
			});

			return Promise.resolve(result);
		}
	}


	/**
	 * Used to retrieve descriptor and permission for each permission item 
	 * based on each access scope id from accessScopeSettings.
	 * @param {AccessScopedPermissions} requiredPermissions permission items with 
	 * access scope
	 * @param {AccessPermissionData} requiredAccess Object with each access scope
	 * property.
	 */
	public retrieveRequiredPermissionsData(requiredPermissions: AccessScopedPermissions, requiredAccess: AccessPermissionData) {

		accessScopeSettings.forEach((accessScope) => {

			if (requiredPermissions) {
				const requiredScopedPermissions = requiredPermissions[accessScope.id as keyof AccessScopedPermissions] ??
					requiredPermissions[accessScope.longId as keyof AccessScopedPermissions] ??
					requiredPermissions[accessScope.scope as unknown as keyof AccessScopedPermissions];

				if (requiredScopedPermissions) {
					const requiredScopedPermissionsArray = Array.isArray(requiredScopedPermissions) ? requiredScopedPermissions : [requiredScopedPermissions];

					requiredAccess[accessScope.id as keyof RequiredAccessPermission] = requiredScopedPermissionsArray.map((item) => this.retrievePermissionItem(item, requiredAccess, requiredPermissions));

				} else {
					requiredAccess[accessScope.id as keyof RequiredAccessPermission] = [];
				}

			} else {
				requiredAccess[accessScope.id as keyof RequiredAccessPermission] = [];
			}
		});
	}


	/**
	* Check if permission item contains descriptor with access rights
	* (eg. string end with `#c` c for create) else used permission value from 
	* provided item and return object of descriptor and permission for each 
	* accessScope.
	* 
	* @param {string} item descriptor
	* @param {AccessPermissionData} requiredAccess Object with each access scope
	* property.
	* @param {AccessScopedPermissions} requiredPermissions permission items with 
	* access scope
	* 
	* @returns {Record<string, Permissions>} return object of descriptor and permission for each 
	* accessScope.
	*/
	public retrievePermissionItem(item: string,
		requiredAccess: AccessPermissionData,
		requiredPermissions: AccessScopedPermissions): Record<string, Permissions> {

		const permissionData: Record<string, Permissions> = {};

		if (item) {
			if (item.includes('#') || !requiredPermissions.permission) {
				const split = item.split('#');
				requiredAccess.allDescriptors.push(split[0]);
				permissionData[split[0]] = this.platformPermissionService.permissionsFromString(split[1]);

			} else {
				requiredAccess.allDescriptors.push(item);
				permissionData[item] = requiredPermissions.permission;
			}

			return permissionData;

		} else {
			throw new Error('Permission items must not be falsy.');
		}
	}


	/**
	 * Check given descriptors for required permissions for each permission item.
	 * 
	 * @param {AccessPermissionData} requiredAccess Object with each access scope
	 * property.
	 * 
	 * @returns {CheckAccessRightsResult} Returns object with one property per access
	 * scope. Each property contains a boolean value that is `true` 
	 * if and only if all permissions for the access scope are granted.
	 */
	public checkForRequiredPermissions(requiredAccess: AccessPermissionData): CheckAccessRightsResult {
		const result = {} as CheckAccessRightsResult;

		accessScopeSettings.forEach((accessScopeData) => {
			result[accessScopeData.scope as keyof CheckAccessRightsResult] = true;

			requiredAccess[accessScopeData.id as keyof RequiredAccessPermission].forEach((reqPermission) => {

				Object.keys(reqPermission).forEach((descriptor) => {
					if (!this.platformPermissionService.has(descriptor, reqPermission[descriptor])) {
						result[accessScopeData.scope as keyof CheckAccessRightsResult] = false;
					}
				});
			});
		});
		return result;
	}

}
