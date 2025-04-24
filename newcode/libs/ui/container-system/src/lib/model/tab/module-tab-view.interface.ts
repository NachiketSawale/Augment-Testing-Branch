/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IModuleTab } from './module-tab.interface';
import { IContainerLayout } from '../layout/container-layout.interface';
import { IModuleTabViewConfig } from './module-tab-view-config.interface';
import { IEntityBase } from '@libs/platform/common';

/**
 * Represent the module tab view additional configuration info.
 */
export interface IModuleTabViewAdditionalConfig {
	/**
	 * Sidebar filter id.
	 */
	filterId?: string;

	/**
	 * Determine whether load data at module start.
	 */
	loadDataModuleStart?: boolean;

	/**
	 * Determine whether load data at view changed.
	 */
	loadDataTabChanged?: boolean;
}

/**
 * Represent the module tab view layout configuration info.
 */
export type IModuleTabViewLayoutConfig = IContainerLayout & IModuleTabViewAdditionalConfig;

/**
 * Represent the module tab view info.
 */
export interface IModuleTabView extends IEntityBase {
	/**
	 * View Id
	 */
	Id: number;

	/**
	 * View belong to module
	 */
	BasModuletabFk: number;

	/**
	 * View description
	 */
	Description: string | null;

	/**
	 * View description translation
	 */
	DescriptionTr?: number;

	/**
	 * View belong to user
	 */
	FrmUserFk?: number;

	/**
	 * View belong to role
	 */
	FrmAccessroleFk?: number;

	/**
	 * Used to check if tab is active
	 */
	Isactivetab: boolean;

	/**
	 * Property for view with system view type
	 */
	Issystem: boolean;

	/**
	 * Property for view which set as default
	 */
	Isdefault: boolean;

	/**
	 * Property for view with portal view type
	 */
	IsPortal: boolean;

	/**
	 * Property contains number for module tab view
	 */
	ModuleTabViewOriginFk?: number;

	/**
	 * Property fot force view reset
	 */
	Forceviewreset?: boolean;

	/**
	 * Property used for module tab entity
	 */
	ModuletabEntity?: IModuleTab;

	/**
	 * Contains properties for module tab view entities.
	 */
	ModuleTabViewConfigEntities: IModuleTabViewConfig[];

	/**
	 * Property fot format version for save view.
	 */
	FormatVersion: number;

	/**
	 * View layout
	 */
	Config: string | IModuleTabViewLayoutConfig;

	/**
	 * view is hidden or not.
	 */
	hidden?: boolean;

	/**
	 * css of the view
	 */
	css?: string | null;
}