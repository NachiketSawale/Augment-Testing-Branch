/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject, OnDestroy, OnInit, ViewEncapsulation, Renderer2, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { UiSidebarService } from '../../services/sidebar.service';
import { UiSidebarPinSettingsService } from '../../services/sidebar-pin-settings.service';

import { SidebarOptions } from '../../model/class/sidebar-options.class';
import { SidebarTab } from '../../model/class/sidebar-tab.class';

import { ICollectionChange, PlatformModuleManagerService } from '@libs/platform/common';
import { ConcreteMenuItem, IMenuItem, IMenuItemsList, IRadioMenuItem, ItemType } from '@libs/ui/common';

/**
 * This class represent the sidebar functionality.
 */
@Component({
	selector: 'ui-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class UiSidebarComponent implements OnInit, OnDestroy {
	/**
	 * Stores sidebar options class instance.
	 */
	public sidebarOptions: SidebarOptions;

	/**
	 * Represent sidebar menu options.
	 */
	public menuOptions: IMenuItemsList = {
		cssClass: '',
		items: [],
		showImages: false,
		showTitles: false,
		activeValue: '',
	};

	/**
	 * Stores activeTab subscription to unsubscribe it.
	 */
	private activeSubscription!: Subscription;

	/**
	 * Stores tabUpdate subscription to unsubscribe it.
	 */
	private updateTabSubscription!: Subscription;

	/**
	 * Sidebar service instance.
	 */
	public sidebarService = inject(UiSidebarService);

	/**
	 * Sidebar pin service instance.
	 */
	public sidebarPinservice = inject(UiSidebarPinSettingsService);

	/**
	 * Keeps track of all available modules in the application.
	 */
	private moduleManagerService=inject(PlatformModuleManagerService);

	/**
	 * Stores the state if sidebar is initialized/
	 */
	private initial:boolean=true;

	/**
	 * Stores activeModule subscription to unsubscribe it.
	 */
	private activeModule!: Subscription;

	/**
	 * Constructor to initialize sidebar component.
	 */
	private outsideClickListener: (() => void) | null = null;

	public constructor(
		private renderer: Renderer2,
		private elRef: ElementRef) {
		this.sidebarOptions = this.sidebarService.sidebarOptions;
		this.updateActiveTabValue(this.sidebarPinservice.getPinStatus().lastButtonId);
	}

	/**
	 * Updates active tab and menu options.
	 */
	public ngOnInit(): void {
		this.activeSubscription = this.sidebarService.activeTab$.subscribe((data: string) => {
			this.updateActiveTabValue(data);
			this.cmdbarredirectTo(data);
		});
		this.updateMenulistInfo();
		this.updateMenuOptionItems();
		this.initSidebar();

		this.activeModule=this.moduleManagerService.activeModule$.subscribe((data)=>{
			if(!this.sidebarOptions.isPinned && !this.initial){
				this.sidebarOptions.lastButtonId='';
			}else{
				this.initial=false;
			}
		});

		this.outsideClickListener = this.renderer.listen('document', 'click', (event: Event) => this.onClickOutside(event));
	}

	/**
	 * update menulist options.
	 */
	private updateMenulistInfo() {
		this.menuOptions.cssClass = this.sidebarOptions.cssClass;
		this.menuOptions.items = this.addSidebarTabButtons();
		this.menuOptions.showImages = this.sidebarOptions.showImages;
		this.menuOptions.showTitles = this.sidebarOptions.showTitles;
		this.sidebarService.sortSidebarItems(this.menuOptions.items);
	}

	/**
	 * It update active tab value into menuOptions.
	 * @param data Sidebar Tab ID.
	 */
	private updateActiveTabValue(data: string) {
		this.menuOptions.activeValue === data ? (this.menuOptions.activeValue = '') : (this.menuOptions.activeValue = data);
	}

	/**
	 * provides sidebar tabs information to update menu items.
	 * @returns sidebar tabs information.
	 */
	private addSidebarTabButtons(): ConcreteMenuItem[] {
		const sidebarTabs: IRadioMenuItem[] = [];

		this.sidebarOptions.items.forEach((ele: SidebarTab) => {
			sidebarTabs.push(this.newMenuItem(ele));
		});
		return sidebarTabs;
	}

	/**
	 * Provides new menu item for menuOptions.
	 * @param ele sidebar tab info.
	 * @returns new menuItem.
	 */
	private newMenuItem(ele: SidebarTab) {
		const menuItem: IRadioMenuItem = {
			type: ItemType.Radio,
		};
		menuItem.id = ele.id;
		menuItem.caption = ele.caption;
		menuItem.svgSprite = ele.svgSprite;
		menuItem.svgImage = ele.svgImage;
		menuItem.sort = ele.sorting;
		menuItem.fn = ele.fn;
		return menuItem;
	}

	/**
	 * Update menuOptions items when new sidebar tabs added
	 * @param tabs Sidebar tabs.
	 */
	public addNewTabsInMenuOption(tabs: SidebarTab[]) {
		tabs.forEach((ele: SidebarTab) => {
			const tab = (this.menuOptions.items as IMenuItem[]).find((item) => {
				return item.id === ele.id;
			});
			if (tab) {
				return;
			}
			(this.menuOptions.items as IMenuItem[]).push(this.newMenuItem(ele));
			this.sidebarService.sortSidebarItems(this.menuOptions.items as IMenuItem[]);
		});
	}

	/**
	 * Update menuOptions items.
	 */
	public updateMenuOptionItems() {
		this.updateTabSubscription = this.sidebarService.tabUpdate$.subscribe((data: ICollectionChange<SidebarTab, string>) => {
			if (data.added) {
				this.addNewTabsInMenuOption(data.added);
			} else if (data.removed) {
				this.removeMenuItems(data.removed);
			} else if (data.modified) {
				this.modifyMenuItems(data.modified);
			}
		});
	}

	/**
	 * Remove tabs from menuOptions items, added at module level.
	 * @param tabIds Sidebar tab ids.
	 */
	private removeMenuItems(tabIds: string[]) {
		tabIds.forEach((data: string) => {
			this.menuOptions.items = this.menuOptions.items?.filter((ele) => {
				return ele.id !== data;
			});
		});
	}

	/**
	 * Modify menuOptions items.
	 * @param tabs Sidebar tabs to be modify.
	 */
	private modifyMenuItems(tabs: SidebarTab[]) {
		tabs.forEach((tab: SidebarTab) => {
			this.menuOptions.items =
				this.menuOptions.items?.filter((ele) => {
					return ele.id !== tab.id;
				}) ?? [];
			this.menuOptions.items.push(this.newMenuItem(tab));
		});
		this.sidebarService.sortSidebarItems(this.menuOptions.items as IMenuItem[]);
	}

	/**
	 * To initialize sidebar component.
	 */
	private initSidebar() {
		const pinStatus = this.sidebarPinservice.getPinStatus();
		if (pinStatus) {
			this.openSidebar(pinStatus.lastButtonId, pinStatus.active);
		}
	}

	/**
	 * Implements sidebar tab click functionality.
	 * @param cmdid Sidebar tab id.
	 */
	public cmdbarredirectTo(cmdid: string) {
		const curButtonID = this.sidebarOptions.lastButtonId;

		if (curButtonID === cmdid) {
			this.sidebarOptions.lastButtonId = '';
		} else {
			this.sidebarOptions.lastButtonId = cmdid;
		}

		this.sidebarPinservice.setPinStatus(this.sidebarOptions.isPinned, this.sidebarOptions.lastButtonId);
	}

	/**
	 * Implements sidebar pin functionality and resizes the client area.
	 * @param pineSidebar Pin status.
	 */
	public pinSidebar(pineSidebar?: boolean) {
		if (pineSidebar === undefined) {
			this.sidebarOptions.isPinned = !this.sidebarOptions.isPinned;

			this.sidebarPinservice.setPinStatus(this.sidebarOptions.isPinned, this.sidebarOptions.lastButtonId);
		} else {
			this.sidebarOptions.isPinned = pineSidebar;
		}
	}

	/**
	 * Opens the sidebar tab on sidebar initialization.
	 * @param lastButtonId Sidebar tab ID.
	 * @param isActive Pin status.
	 */
	public openSidebar(lastButtonId: string, isActive: boolean) {
		if (isActive) {
			this.pinSidebar(isActive);
		}
		if (lastButtonId) {
			this.cmdbarredirectTo(lastButtonId);
		}
	}

	/**
	 * Check if the click is outside the sidebar
	 * @param event 
	 */
	public onClickOutside(event: Event) {
		if (!this.sidebarOptions.isPinned && !this.elRef.nativeElement.contains(event.target)) {
			this.sidebarOptions.lastButtonId = '';
			this.sidebarPinservice.setPinStatus(this.sidebarOptions.isPinned, '');
		}
	}

	/**
	 * Close the sidebar
	 */
	public closeSidebar() {
		// Reset the active tab to close the sidebar
		this.sidebarOptions.lastButtonId = '';
		this.sidebarPinservice.setPinStatus(this.sidebarOptions.isPinned, this.sidebarOptions.lastButtonId);
	}

	/**
	 * unsubscribe activeTab, moduleTab and updateTab events.
	 */
	public ngOnDestroy() {
		this.activeSubscription.unsubscribe();
		this.updateTabSubscription.unsubscribe();
		this.activeModule.unsubscribe();
		if (this.outsideClickListener) {
			this.outsideClickListener();
			this.outsideClickListener = null;
		}
	}
}
