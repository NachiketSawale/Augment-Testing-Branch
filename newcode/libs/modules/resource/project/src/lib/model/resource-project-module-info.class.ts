/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ContainerModuleInfoBase, ContainerDefinition } from '@libs/ui/container-system';

/**
 * The module info class for `resource.project`.
 */
export class ResourceProjectModuleInfo extends ContainerModuleInfoBase {

	public override get internalModuleName(): string {
		return 'resource.project';
	}

	/**
	 * Returns all containers available in the module.
	 */
	protected override get containers(): ContainerDefinition[] {
		return [];
	}

}