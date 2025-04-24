/**
 * Copyright(c) RIB Software GmbH
 */

import { ComponentType } from '@angular/cdk/portal';

import { ITranslatable } from '@libs/platform/common';
import { IMenuItemEventInfo, ISimpleMenuItem, ItemType } from '@libs/ui/common';


/**
 * Defines metadata for Sidebar Tab
 */
export class SidebarTab implements ISimpleMenuItem {

	/**
	 * Initializes a new instance for sidebar tab.
	 * @param id Unique ID for the sidebar tab.
	 * @param caption Caption for the sidebar tab.
	 * @param svgSprite Svg sprite for sidebar tab.
	 * @param svgImage Image to be rendered for sidebar tab.
	 * @param sorting sorting index for tab.
	 * @param getContentType Function returns promise that provide component type of sidebar tab.
	 * @param fn Optional, Functionality to be performed when sidebar tab is clicked.
	 */
	public constructor(
		public id: string,
		public caption: ITranslatable | string,
		public svgSprite: string,
		public svgImage: string,
		public sorting:number,
		public getContentType$: ()=>Promise<ComponentType<unknown>>,
		public fn?: (info: IMenuItemEventInfo) => void
	) {}

	public readonly type = ItemType.Item;
	
}
