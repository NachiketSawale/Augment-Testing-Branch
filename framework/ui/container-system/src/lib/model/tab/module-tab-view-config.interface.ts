/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IModuleTabView } from './module-tab-view.interface';
import { IEntityBase } from '@libs/platform/common';

/**
 * Represent the module tab view configuration info.
 */
export interface IModuleTabViewConfig extends IEntityBase {
	/**
	 * Used for module tab view id.
	 */
	BasModuletabviewFk: number;

	/**
	 * Contains Guid
	 */
	Guid: string;

	/**
	 * Contains property config for view
	 */
	Propertyconfig?: string;

	/**
	 * Contains grid config for view
	 */
	Gridconfig?: string;

	/**
	 * Contain view data
	 */
	Viewdata?: string;

	/**
	 * Used for module tab view properties.
	 */
	ModuletabviewEntity?: IModuleTabView;
}