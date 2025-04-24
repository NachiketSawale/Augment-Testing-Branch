/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { USER_ENTITY_INFO } from './user-entity-info.model';
import { ACCESS_USER2_GROUP_ENTITY_INFO } from './usermanagement-user-2group-entity-info.model';

/**
 * The module info object for the `usermanagement.user` content module.
 */
export class UsermanagementUserModuleInfo extends BusinessModuleInfoBase {

	/**
	 * Returns the singleton instance of the class.
	 */
	public static readonly instance = new UsermanagementUserModuleInfo();

	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 *
	 * @return The internal module name.
	 */
	public override get internalModuleName(): string {
		return 'usermanagement.user';
	}

	/**
	 * Returns the unique internal module name in PascalCase.
	 */
	public override get internalPascalCasedModuleName() {
		return 'UserManagement.Main';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ USER_ENTITY_INFO, ACCESS_USER2_GROUP_ENTITY_INFO ];
	}
}
