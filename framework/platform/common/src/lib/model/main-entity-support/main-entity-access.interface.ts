/*
 * Copyright(c) RIB Software GmbH
 */

import { INavigationBarControls } from './navigation-bar-controls.interface';
import { Observable } from 'rxjs';
import { Translatable } from '../translation/translatable.interface';
import { ISidebarSearchSupport } from './sidebar-search-support.interface';

/**
 * Provides access to resources related to the main entity of the module.
 */
export interface IMainEntityAccess {

	/**
	 * Provides access to the commands available to the application nav bar.
	 */
	readonly navBarCommands?: INavigationBarControls;

	/**
	 * Provides interface for loading data according filters configured by the user in the sidebar.
	 * Sidebar is not supported in case of undefined or ISidebarSearchSupport.supportsSidebarSearch returns falls (for easiness of implementation in
	 * standard data services
	 */
	readonly sidebarSearchSupport?: ISidebarSearchSupport;

	/**
	 * Returns an observable that supplies the current selection info message.
	 */
	readonly selectionInfo$: Observable<Translatable>;

	/**
	 * Observable for modified entities on the mainEntity and its nodes and their leaf services.
	 */
	readonly entitiesModifiedInfo$: Observable<void>;
}
