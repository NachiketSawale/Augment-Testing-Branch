/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { ComponentType } from '@angular/cdk/portal';
import { Component, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { UiSidebarService } from '../../services/sidebar.service';
import { UiSidebarPinSettingsService } from '../../services/sidebar-pin-settings.service';

import { SidebarOptions } from '../../model/class/sidebar-options.class';
import { SidebarTab } from '../../model/class/sidebar-tab.class';

/**
 * This component renders content of active sidebar tab.
 */
@Component({
	selector: 'ui-sidebar-content',
	templateUrl: './sidebar-content.component.html',
	styleUrls: ['./sidebar-content.component.scss'],
})
export class SidebarContentComponent implements OnInit, OnDestroy {

	/**
	 * Stores sidebar options class instance.
	 */
	public sidebarOptions!: SidebarOptions;

	/**
	 * Active component type of sidebar tab.
	 */
	public activeContainer!: ComponentType<unknown> | null;

	/**
	 * Active sidebar tab id.
	 */
	public activeTabId!: string;

	/**
	 * Stores activeTab subscription to unsubscribe it.
	 */
	private activeSubscription!: Subscription;
	/**
	 * sidbar service instance.
	 */
	public sidebarService = inject(UiSidebarService);

	/**
	 * sidbar pin service instance.
	 */
	public sidebarPinservice = inject(UiSidebarPinSettingsService);


	public constructor() {
		this.sidebarOptions = this.sidebarService.sidebarOptions;
	}

	/**
	 * Provide active tab information at the time of initialization.
	 */
	public ngOnInit() {
		this.previousTabInfo();

		this.activeSubscription = this.sidebarService.activeTab$.subscribe((data: string) => {
			this.activeSidebarContainer(data);
		});
	}

	/**
	 * To get previous saved tab inforamtion.
	 */
	private previousTabInfo() {
		const buttonId = this.sidebarPinservice.getPinStatus().lastButtonId;

		if (buttonId !== '') {
			this.activeSidebarContainer(buttonId);
		}
	}

	/**
	 * To set active sidebar tab content information in activeContainer.
	 * @param data Active sidebar tab id.
	 */
	private activeSidebarContainer(data: string) {
		this.sidebarOptions.isMaximized = false;
		this.activeTabId = data;
		const activeTab = this.sidebarService.sidebarOptions.items.find((ele: SidebarTab) => {
			return ele.id === data;
		});

		if (activeTab) {
			activeTab.getContentType$().then((data) => {
				this.activeContainer = data;
			});
		} else {
			this.activeContainer = null;
		}
	}
/**
     * Prevents the event from bubbling up when clicking inside the sidebar.
     */
    @HostListener('click', ['$event'])
    public stopPropagation(event: Event): void {
        event.stopPropagation();
    }
	/**
	 * Unsubscribe activeTab event.
	 */
	public ngOnDestroy() {
		this.activeSubscription.unsubscribe();
	}
}