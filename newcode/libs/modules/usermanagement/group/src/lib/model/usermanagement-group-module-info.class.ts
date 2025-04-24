/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { USERMANAGEMENT_GROUP_ENTITY_INFO } from './usermanagement-group-entity-info.model';

import { USERMANAGEMENT_GROUP_USERS_IN_GROUP_ENTITY_INFO } from './usermanagement-users-in-group-entity-info.model';
import { USERMANAGEMENT_GROUP_LOG_ENTITY_INFO } from '../schedular-log-entity/model/usermanagement-group-log-entity-info.model';

/**
 * The module info object for the `usermanagement.group` content module.
 */
export class UsermanagementGroupModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: UsermanagementGroupModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): UsermanagementGroupModuleInfo {
		if (!this._instance) {
			this._instance = new UsermanagementGroupModuleInfo();
		}

		return this._instance;
	}

	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 *
	 * @return The internal module name.
	 */
	public override get internalModuleName(): string {
		return 'usermanagement.group';
	}

	public override get internalPascalCasedModuleName(): string {
		return 'UserManagement.Group';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ USERMANAGEMENT_GROUP_ENTITY_INFO, USERMANAGEMENT_GROUP_LOG_ENTITY_INFO, USERMANAGEMENT_GROUP_USERS_IN_GROUP_ENTITY_INFO ];
	}
}
