/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IModuleTabView, IModuleTabViewAdditionalConfig } from '../tab/module-tab-view.interface';
import { IModuleTab } from '../tab/module-tab.interface';
import { Observable } from 'rxjs';
import { ITabChangedArgs } from '../tab/tab-changed-args';
import { AccessScope } from '@libs/platform/common';
import { IContainerLayout } from './container-layout.interface';
import { ContainerModuleInfoBase } from '../container-module-info-base.class';
import { ILayoutApi } from './layout-api.interface';
import { ILayoutExportItem } from '../layout-export-item.interface';

/**
 * Represents an updater of the layout.
 */
export interface IContainerLayoutUpdater {
	/**
	 * Save current activated view or a specified view.
	 * @param viewInfo Current activated view or a specified view.
	 * @param accessScope The access scope of the view.
	 * @param additionalConfig Additional configuration.
	 */
	saveView: (viewInfo: IModuleTabView, accessScope?: AccessScope, additionalConfig?: IModuleTabViewAdditionalConfig) => Promise<IModuleTabView>;

	/**
	 * Change the current view with a specified view.
	 * @param view The view to be applied.
	 */
	changeView: (view: IModuleTabView) => Promise<IModuleTabView>;

	/**
	 * Update the layout of current view.
	 * @param layout The layout tobe updated.
	 */
	updateLayout: (layout: IContainerLayout) => Promise<IModuleTabView>;

	/**
	 * Apply the layout to current view.
	 * @param layout The layout to be applied.
	 */
	applyLayout: (layout: IContainerLayout) => Promise<IModuleTabView>;

	/**
	 * import the layouts
	 * @param tabId
	 * @param fileReaderData
	 */
	importLayouts: (tabId:number, fileReaderData:string | ArrayBuffer)=> Promise<void>;

	/**
	 * export the layouts
	 * @param items
	 * @param tabId
	 */
	exportLayouts: (items: ILayoutExportItem[], tabId:number)=> void;
}

/**
 * Represents a visitor of layout.
 */
export interface IContainerLayoutVisitor {
	/**
	 * Retrieves all tabs.
	 */
	getTabs: () => IModuleTab[];

	/**
	 * Retrieves current active tab.
	 */
	getActiveTab: () => IModuleTab;

	/**
	 * Retrieves current active view.
	 */
	getActiveView: () => IModuleTabView;

	/**
	 * Retrieves the view with specified id.
	 * @param id The view id.
	 */
	getViewById: (id: number) => IModuleTabView;
}

/**
 * Represents the events of the layout.
 */
export interface IContainerLayoutEvents {
	/**
	 * Tab change event.
	 */
	readonly tabChanged: Observable<ITabChangedArgs>;

	/**
	 * View change event.
	 */
	readonly viewChanged: Observable<IModuleTabView>;
}

/**
 * Represents the manager initialize context.
 */
export interface ILayoutManagerContext {
	/**
	 * The module info.
	 */
	moduleInfo: ContainerModuleInfoBase;

	/**
	 * The module tabs.
	 */
	tabs: IModuleTab[];

	/**
	 * The layout proxy to back-end server.
	 */
	layoutApi: ILayoutApi;

	/**
	 * The current role id.
	 */
	permissionRoleId?: number;

	/**
	 * Indicates whether logon in portal mode.
	 */
	isPortal: boolean;
}

/**
 * Represents the manager of layout.
 */
export interface ILayoutManager extends IContainerLayoutUpdater, IContainerLayoutVisitor, IContainerLayoutEvents {
	/**
	 * Sets the current active tab.
	 * @param tabId The id of tab.
	 */
	setActiveTab: (tabId: number) => Promise<IModuleTabView>;
}