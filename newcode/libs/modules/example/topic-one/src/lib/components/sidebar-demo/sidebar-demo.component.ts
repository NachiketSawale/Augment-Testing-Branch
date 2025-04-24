/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
	SidebarTab,
	UiSidebarChatbotSidebarTabComponent,
	UiSidebarFavoritesSidebarTabComponent,
	UiSidebarHistorySidebarTabComponent,
	UiSidebarQuickstartSidebarTabComponent,
	UiSidebarReportTabComponent,
	UiSidebarWizardsSidebarTabComponent
} from '@libs/ui/sidebar';
import { UiSidebarService, UiSidebarPinSettingsService } from '@libs/ui/sidebar';
import { ContainerBaseComponent } from '@libs/ui/container-system';

/**
 * Sidebar demo component to test sidebar functionality.
 */
@Component({
	selector: 'example-topic-one-sidebar-demo',
	templateUrl: './sidebar-demo.component.html',
	styleUrls: ['./sidebar-demo.component.scss'],
})
export class SidebarDemoComponent extends ContainerBaseComponent {
	/**
	 * Sidebar service instance.
	 */
	public sidebarService = inject(UiSidebarService);

	/**
	 * Sidebar pin service instance
	 */
	public sidebarPinservice = inject(UiSidebarPinSettingsService);

	/**
	 * Router instance.
	 */
	private router = inject(Router);

	/**
	 * Add sidebar tabs on button click.
	 */
	public onClick() {
		const addTabsData = [
			new SidebarTab('sidebar-report', {key: 'cloud.desktop.sdCmdBarReport'}, 'sidebar-icons', 'ico-report', 8, async () => UiSidebarReportTabComponent),
			new SidebarTab('sidebar-newWizard', {key: 'cloud.desktop.sdCmdBarWizard'}, 'sidebar-icons', 'ico-wiz', 3, async () => UiSidebarWizardsSidebarTabComponent),
		];

		this.sidebarService.addSidebarTabs(addTabsData);
	}

	/**
	 * Redirect to desktop and remove module level tabs.
	 */
	public goToDesktop() {
		const removeTabsData = ['sidebar-report', 'sidebar-newWizard'];
		this.sidebarService.removeSidebarTabs(removeTabsData);

		const status = this.sidebarService.sidebarOptions.items.some((value) => value.id === this.sidebarPinservice.getPinStatus().lastButtonId);

		if (!status) {
			this.sidebarService.activeTab$.emit('sidebar-quickstart');
		}

		this.router.navigate(['app/main']);
	}

	/**
	 * Update sidebar tabs.
	 */
	public updateTabs() {
		const updateTabsData = [
			new SidebarTab('sidebar-report', {key: 'cloud.desktop.sdCmdBarReport'}, 'sidebar-icons', 'ico-report', 3, async () => UiSidebarReportTabComponent),
			new SidebarTab('sidebar-newWizard', {key: 'cloud.desktop.sdCmdBarWizard'}, 'sidebar-icons', 'ico-wiz', 8, async() => UiSidebarWizardsSidebarTabComponent),
			new SidebarTab('sidebar-quickstart', {key: 'cloud.desktop.sdCmdBarQuickstart'}, 'sidebar-icons', 'ico-apps', 1, async () => UiSidebarQuickstartSidebarTabComponent),
			new SidebarTab('sidebar-favorites', {key: 'cloud.desktop.sdCmdBarFavorites'}, 'sidebar-icons', 'ico-project-favorites', 2, async () => UiSidebarFavoritesSidebarTabComponent),
			new SidebarTab('sidebar-chatBot', {key: 'cloud.desktop.sdCmdBarChatBot'}, 'sidebar-icons', 'ico-chatbot', 4, async () => UiSidebarChatbotSidebarTabComponent),
			new SidebarTab('sidebar-lastobjects', {key: 'cloud.desktop.sdCmdBarLastObjects'}, 'sidebar-icons', 'ico-last-objects', 5, async () => UiSidebarHistorySidebarTabComponent),
		];
		this.sidebarService.updateSidebarTabs(updateTabsData);
	}
}
