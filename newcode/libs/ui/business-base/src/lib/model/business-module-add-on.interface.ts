/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '../entities/index';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';

/**
 * Provides additional declarations that can be loaded into other business modules.
 */
export interface IBusinessModuleAddOn {

	/**
	 * Non-entity-based containers supplied for the other business module.
	 */
	readonly containers?: (ContainerDefinition | IContainerDefinition)[];

	/**
	 * Entities supplied for the other business module.
	 */
	readonly entities?: EntityInfo[];
}
