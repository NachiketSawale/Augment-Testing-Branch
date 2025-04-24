/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EventEmitter, Injectable, inject } from '@angular/core';

import { SidebarOptions } from '../model/class/sidebar-options.class';
import { SidebarTab } from '../model/class/sidebar-tab.class';

import { UiSidebarPinSettingsService } from './sidebar-pin-settings.service';

import { ICollectionChange } from '@libs/platform/common';
import { IMenuItem, IMenuItemEventInfo } from '@libs/ui/common';

/**
 * This class represent the sidebar tab functionality.
 */
@Injectable({
	providedIn: 'root',
})
export class UiSidebarService {
	/**
	 * Stores sidebar options class instance.
	 */
	public sidebarOptions!: SidebarOptions;

	/**
	 * Hold active sidebar tab id.
	 */
	public activeTab$: EventEmitter<string> = new EventEmitter<string>();

	/**
	 * Holds update tab data.
	 */
	public tabUpdate$: EventEmitter<ICollectionChange<SidebarTab, string>> = new EventEmitter<ICollectionChange<SidebarTab, string>>();

	public sidebarPinservice = inject(UiSidebarPinSettingsService);

	/**
	 * Initialize the sidebar and set the default value.
	 */
	public initializeSidebar() {
		this.sidebarOptions = new SidebarOptions();
		this.bindEventToTabs();
	}

	/**
	 * To bind functionality to sidebar tab button.
	 * @param info The menu item that represents the sidebar tab.
	 */
	public clickTab(info: IMenuItemEventInfo): void {
		if (info.item.id) {
			this.sidebarOptions.activeValue === info.item.id ? (this.sidebarOptions.activeValue = '') : (this.sidebarOptions.activeValue = info.item.id);
			this.activeTab$.emit(info.item.id);
		}
	}

	/**
	 * Add single or multiple tabs into sidebar.
	 * @param addTabs Sidebar tabs information to be added.
	 */
	public addSidebarTabs(addTabs: SidebarTab[]) {
		const updateTabData: ICollectionChange<SidebarTab, string> = {
			added: addTabs,
			removed: undefined,
			modified: undefined,
		};

		addTabs.forEach((moduleTab) => {
			const tab = this.sidebarOptions.items.find((item) => {
				return item.id === moduleTab.id;
			});
			if (tab) {
				return;
			}
			moduleTab.fn = this.clickTab.bind(this);
			this.sidebarOptions.items.push(moduleTab);
		});
		this.tabUpdate$.emit(updateTabData);
	}

	/**
	 * Remove single or multiple tabs from sidebar.
	 * @param removeTabs Sidebar tabs id to be remove
	 */
	public removeSidebarTabs(removeTabs: string[]) {
		const updateTabData: ICollectionChange<SidebarTab, string> = {
			added: undefined,
			removed: removeTabs,
			modified: undefined,
		};

		removeTabs.forEach((data: string) => {
			this.sidebarOptions.items = this.sidebarOptions.items.filter((ele) => {
				return ele.id !== data;
			});
		});
		this.tabUpdate$.emit(updateTabData);
	}

	/**
	 * update single or multiple sidebar tabs.
	 * @param updateTabs Sidebar tabs information to be update.
	 */
	public updateSidebarTabs(updateTabs: SidebarTab[]) {
		const updateTabData: ICollectionChange<SidebarTab, string> = {
			added: undefined,
			removed: undefined,
			modified: updateTabs,
		};

		updateTabs.forEach((data) => {
			this.sidebarOptions.items = this.sidebarOptions.items.filter((ele) => {
				return ele.id !== data.id;
			});
			data.fn = this.clickTab.bind(this);
			this.sidebarOptions.items.push(data);
		});
		this.tabUpdate$.emit(updateTabData);
	}

	/**
	 * binds functionality to defalut tabs.
	 */
	private bindEventToTabs() {
		this.sidebarOptions.items.map((item: SidebarTab) => {
			item.fn = this.clickTab.bind(this);
		});
	}

	/**
	 * Sorts the itemlist based on sorting index.
	 * @param tabs Sidebar tabs.
	 */
	public sortSidebarItems(tabs: IMenuItem[]) {
		tabs.sort((item1: IMenuItem, item2: IMenuItem) => {
			return (item1.sort as number) - (item2.sort as number);
		});
	}
}
