/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { USERMANAGEMENT_ROLE_2ROLE_ENTITY_INFO } from '../role-xrole/model/usermanagement-role-2role-entity-info.model';
import { USERMANAGEMENT_RIGHT_ENTITY_INFO } from '../right/model/usermanagement-right-entity-info.model';
import { USERMANAGEMENT_ROLE_ENTITY_INFO } from '../roles/model/usermanagement-role-entity-info.model';

/**
 * The module info object for the `usermanagement.right` content module.
 */
export class UsermanagementRightModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: UsermanagementRightModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): UsermanagementRightModuleInfo {
		if (!this._instance) {
			this._instance = new UsermanagementRightModuleInfo();
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
		return 'usermanagement.right';
	}

	public override get internalPascalCasedModuleName(): string {
		return 'UserManagement.Right';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
				USERMANAGEMENT_ROLE_ENTITY_INFO,
				USERMANAGEMENT_RIGHT_ENTITY_INFO,
				USERMANAGEMENT_ROLE_2ROLE_ENTITY_INFO
				];
	}
}
