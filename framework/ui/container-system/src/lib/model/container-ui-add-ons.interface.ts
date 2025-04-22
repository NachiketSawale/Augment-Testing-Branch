/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IInfoOverlay, IModuleNavigationManager, IResizeMessenger } from '@libs/ui/common';
import { IMenuList } from '@libs/ui/common';


/**
 * Provides access to UI add-ons available to all containers.
 */
export interface IContainerUiAddOns {

	/**
	 * The toolbar of the container.
	 */
	get toolbar(): IMenuList;

	/**
	 * The status bar of the container.
	 */
	get statusBar(): IMenuList & {
		isVisible: boolean;
	}; // TODO: revise type in the course of DEV-16988

	/**
	 * An overlay that covers the entire container content.
	 */
	get whiteboard(): IInfoOverlay;

	/**
	 * An overlay that indicates that an operation is currently in progress.
	 */
	get busyOverlay(): IInfoOverlay;

	/**
	 * The resize messenger.
	 */
	get resizeMessenger(): IResizeMessenger;

	/**
	 * The NavigationManager
	 */
	get navigation(): IModuleNavigationManager;
}
