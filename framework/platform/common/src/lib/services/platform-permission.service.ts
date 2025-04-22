/*
 * Copyright (c) RIB Software GmbH
 */

import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, inject } from '@angular/core';
import { PlatformConfigurationService } from './platform-configuration.service';
import { isBoolean, isNumber, without } from 'lodash';
import { Permissions } from '../model/permission/permissions.enum';
import { catchError, forkJoin, Observable, of } from 'rxjs';
import { IDescriptorInfo } from '../model/permission/descriptor-info.interface';
import { noop } from 'lodash';

type UuidResult = Array<{ descriptor: string, right: number }>;
type IdResult = { mappings: Array<{ id: number, descriptor: string }>, permissions: UuidResult };
type ApiResult = IdResult | UuidResult;

/**
 *  Permission service provides functionality for loading and checking access rights.
 *  The service handles switching sets of access rights between login role and object permissions.
 */
@Injectable({
	providedIn: 'root'
})
export class PlatformPermissionService {
	private readonly cachedPermissions = new Map<string, Map<string, number>>();
	private readonly cachedDescriptor = new Map<string, IDescriptorInfo>();
	private readonly restrictedPermissions = new Map<string, number>();
	private readonly loadedIds = new Map<number, string>();
	private permissionSelector = '';
	private configurationService = inject(PlatformConfigurationService);
	private http = inject(HttpClient);

	/**
	 * Emits when internal state has been changed/updated.
	 * Emits 'permission-service:updated' and 'permission-service:changed'
	 */
	public stateChanged = new EventEmitter();

	/**
	 * Constructor
	 */
	public constructor() {
		this.cachedPermissions.set(this.permissionSelector, new Map<string, number>());
	}

	private register(type: string) {
		let keys = [...(this.cachedPermissions.get('')?.keys() ?? [])];

		switch (type) {
			case 'companyConfiguration':
				this.loadPermissions(keys, true).then(() => {
					noop();
				});
				break;

			case 'permissionObjectInfo': {
				const info = this.configurationService.permissionObjectInfo;

				if (info) {
					const oldPermissionSelector = this.permissionSelector;

					this.permissionSelector = info.substring(0, info.lastIndexOf('|'));

					if (this.permissionSelector !== oldPermissionSelector) {
						let loadedPermissions = this.cachedPermissions.get(this.permissionSelector);
						let promise = new Promise((resolve) => resolve(true));

						if (!loadedPermissions) {
							this.cachedPermissions.set(this.permissionSelector, new Map<string, number>());
							loadedPermissions = this.cachedPermissions.get(this.permissionSelector);
						} else {
							keys = without(keys, ...loadedPermissions.keys());
						}

						if (keys.length) {
							promise = this.loadPermissions(keys, false);
						}

						promise.then(() => {
							this.stateChanged.emit('permission-service:updated');
							this.stateChanged.emit('permission-service:changed');
						});
					}
				} else {
					this.permissionSelector = '';

					this.stateChanged.emit('permission-service:updated');
					this.stateChanged.emit('permission-service:changed');
				}

				break;
			}
		}
	}

	/**
	 * Loads access rights for given set of descriptors.
	 * Function must be executed before calling any functions checking an access right like hasRead, hasWrite, ...
	 * Descriptors that are already loaded (cached) will not be requested again from back-end.
	 *
	 * @param {string | number | Array<string | number>} descriptor descriptor(s) or descriptor id(s) to be loaded
	 * @param {boolean} forceRole set to true if role descriptors must be loaded (forced), default value is false
	 * @returns {Promise} Promise returning true when operation has been finished
	 */
	public loadPermissions(descriptor: string | number | Array<string | number>, forceRole: boolean = false): Promise<boolean> {
		// check for valid permission context, otherwise force exception
		if (!this.configurationService.permissionClientId) {
			console.error('PermissionService.loadPermissions(...) failed. There is no valid PermissionContextId.', this.configurationService.permissionClientId);
		}

		if (!descriptor) {
			return new Promise<boolean>(resolve => resolve(true));
		}

		const data: string[] = [];
		const idData: number[] = [];
		const operations: Observable<ApiResult>[] = [];
		const permissionSelector = forceRole ? '' : this.permissionSelector;

		if (!this.cachedPermissions.has(permissionSelector)) {
			this.cachedPermissions.set(this.permissionSelector, new Map<string, number>());
		}

		const loadedPermissions = this.cachedPermissions.get(permissionSelector);

		(Array.isArray(descriptor) ? descriptor : [descriptor]).forEach((descriptor: string | number): void => {
			if (typeof descriptor === 'string') {
				if (descriptor.length === 32) {
					if (!loadedPermissions?.has(descriptor)) {
						data.push(descriptor);
					}
				} else {
					descriptor = parseInt(descriptor);

					if (!isNaN(descriptor) && !this.loadedIds.has(descriptor)) {
						idData.push(descriptor);
					}
				}
			} else {
				if (!this.loadedIds.has(descriptor)) {
					idData.push(descriptor);
				}
			}
		});

		if (data.length) {
			operations.push(this.http.post<UuidResult>(this.configurationService.webApiBaseUrl + 'services/platform/loadpermissions', data, {
				params: {
					forceRole: forceRole
				}
			}));
		}

		if (idData.length) {
			operations.push(this.http.post<IdResult>(this.configurationService.webApiBaseUrl + 'services/platform/loadpermissionsbyid', idData));
		}

		if (!operations.length) {
			return new Promise((resolve) => resolve(true));
		}

		return new Promise((resolve) => {
			const subscription = forkJoin(operations)
				.subscribe((results) => {
					if (data.length) {
						(results[0] as UuidResult).forEach((item) => {
							loadedPermissions?.set(item.descriptor, item.right);
						});
					}

					if (idData.length) {
						const idResult = (data.length ? results[1] : results[0]) as IdResult;

						if (idResult) {
							idResult.mappings.forEach((item) => {
								this.loadedIds.set(item.id, item.descriptor);
							});

							idResult.permissions.forEach((item) => {
								loadedPermissions?.set(item.descriptor, item.right);
							});
						}
					}

					subscription.unsubscribe();

					resolve(true);
				});
		});
	}

	/**
	 * Checks given descriptor(s) for required permission
	 *
	 * @param {string | number | Array<string | number>} descriptor descriptor(s) or descriptor ids to be checked
	 * @param {number} permission permission to be checked
	 * @param {boolean} forceRole set to true if logon role should be used
	 * @returns {boolean} true when permission
	 */
	public has(descriptor: string | number | Array<string | number>, permission: number | Permissions, forceRole: boolean = false): boolean {
		if (!descriptor) {
			return false;
		}

		const permissionSelector = forceRole ? '' : this.permissionSelector;

		return (Array.isArray(descriptor) ? descriptor : [descriptor]).every((descriptor) => {
			if (isNumber(descriptor)) {
				descriptor = this.loadedIds.get(descriptor) ?? '';
			} else if (descriptor.length !== 32) {
				descriptor = this.loadedIds.get(parseInt(descriptor)) ?? '';
			}

			const currentRight = this.cachedPermissions.get(permissionSelector)?.get(descriptor) ?? 0;

			if (!descriptor.length && !currentRight) {
				return false;
			}

			return (currentRight & (this.restrictedPermissions.get(descriptor) ?? 0x1f) & permission) === permission;
		});
	}

	/**
	 * Restricts permissions for given descriptor(s) to lower permission than the loaded permission.
	 * Can be used to change container access rights to lower permission (read, no access) depending on application state.
	 * E.g. a container having RWCD access but the application/module/entity state might restrict access to RW to disable deletion or creation of new entities.
	 *
	 * @param descriptor {string | Array} descriptor(s) to be restricted
	 * @param permission {number | boolean} permission to be set (resulting permission will be equal/lower than permission loaded from server) or false to remove restriction
	 * @param suppressEvent {boolean} optional; internally used to prevent unneeded notifications
	 */
	public restrict(descriptor: string | Array<string>, permission: number | boolean, suppressEvent: boolean = false): void {
		if (Array.isArray(descriptor)) {
			descriptor.forEach((descriptor) => {
				this.restrict(descriptor, permission, true);
			});
		} else {
			this.restrictedPermissions.set(descriptor, isBoolean(permission) ? 0x1f : permission);
		}

		if (!suppressEvent) {
			this.stateChanged.emit('permission-service:updated');
			this.stateChanged.emit('permission-service:changed');
		}
	}

	/**
	 * Checks given descriptor(s) for read permission
	 *
	 * @param {string | Array<string>} descriptor  descriptor(s) to be checked
	 * @param {boolean} forceRole set to true if logon role should be used
	 * @returns {boolean} true when read permission
	 */
	public hasRead(descriptor: string | Array<string>, forceRole: boolean = false): boolean {
		return this.has(descriptor, Permissions.Read, forceRole);
	}

	/**
	 * Checks given descriptor(s) for write permission
	 *
	 * @param {string|Array} descriptor descriptor(s) to be checked
	 * @param {boolean} forceRole set to true if logon role should be used
	 * @returns {boolean} true when write permission
	 */
	public hasWrite(descriptor: string | Array<string>, forceRole: boolean = false): boolean {
		return this.has(descriptor, Permissions.Write, forceRole);
	}

	/**
	 * Checks given descriptor(s) for create permission
	 *
	 * @param {string|Array} descriptor descriptor(s) to be checked
	 * @param {boolean} forceRole set to true if logon role should be used
	 * @returns {boolean} true when create permission
	 */
	public hasCreate(descriptor: string | Array<string>, forceRole: boolean = false): boolean {
		return this.has(descriptor, Permissions.Create, forceRole);
	}

	/**
	 * Checks given descriptor(s) for delete permission
	 *
	 * @param {string|Array} descriptor descriptor(s) to be checked
	 * @param {boolean} forceRole set to true if logon role should be used
	 * @returns {boolean} true when delete permission
	 */
	public hasDelete(descriptor: string | Array<string>, forceRole: boolean = false): boolean {
		return this.has(descriptor, Permissions.Delete, forceRole);
	}

	/**
	 * Checks given descriptor(s) for execute permission
	 *
	 * @param {string|Array} descriptor descriptor(s) to be checked
	 * @param {boolean} forceRole set to true if logon role should be used
	 * @returns {boolean} true when execute permission
	 */
	public hasExecute(descriptor: string | Array<string>, forceRole: boolean = false): boolean {
		return this.has(descriptor, Permissions.Execute, forceRole);
	}

	/**
	 * object helper to map permission character to permission enum value
	 * @private
	 */
	private permissionsLookup: Record<string, Permissions> = {
		r: Permissions.Read,
		w: Permissions.Write,
		c: Permissions.Create,
		d: Permissions.Delete,
		e: Permissions.Execute
	};

	/**
	 * Converts a string containing access rights as characters (rwcde) to permissions-flags
	 *
	 * @param {string} rights right as string
	 * @returns {number} or-ed permissions flags
	 */
	public permissionsFromString(rights: string): number {
		return [...rights].reduce((result: number, right: string) => {
			result |= this.permissionsLookup[right];

			return result;
		}, 0);
	}

	/**
	 * Loads descriptor info of given descriptor
	 *
	 * @param {string} descriptor descriptor to be loaded
	 * @returns {Promise} promise resolved when descriptor info is loaded or already available
	 */
	public loadDescriptor(descriptor: string): Promise<IDescriptorInfo | null> {
		if (!descriptor || descriptor.length !== 32) {
			return new Promise((resolve) => resolve(null));
		}

		const item = this.cachedDescriptor.get(descriptor);

		if (item) {
			return new Promise((resolve) => resolve(item));
		}

		return new Promise((resolve) => {
			const subscription = this.http.get<IDescriptorInfo>(this.configurationService.webApiBaseUrl + 'services/platform/loaddescriptor', {
				params: {
					uuid: descriptor
				}
			}).pipe(catchError(() => of({
				id: -1,
				uuid: descriptor,
				name: 'n/a',
				description: null,
				sortOrderPath: 'n/a',
				path: 'n/a'
			} as IDescriptorInfo))).subscribe((data) => {
				this.cachedDescriptor.set(descriptor, data);
				subscription.unsubscribe();
				resolve(data);
			});
		});
	}

	/**
	 * Applies mock data to permission cache.
	 * Can be used to provide a preloaded cache for unit tests.
	 *
	 * @param {Map<string, number>} data permission data to be inserted
	 */
	public applyMockData(data: Map<string, number>): void {
		if (this.permissionSelector.length === 0 && this.cachedPermissions.get(this.permissionSelector)?.size === 0) {
			this.cachedPermissions.set(this.permissionSelector, data);
		} else {
			throw new Error('Cache must be empty to apply mock data');
		}
	}
}
