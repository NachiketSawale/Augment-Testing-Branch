/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { SidebarTab } from './sidebar-tab.class';

/**
 * Initializes the sidebar tabs data.
 */
export class Sidebar {
	/**
	 * Holds the sidebar tab instances.
	 */
	public items: SidebarTab[];

	/**
	 * Image show flag.
	 */
	public showImages = true;

	/**
	 * Title show flag.
	 */
	public showTitles = true;

	/**
	 * Represent sidebar css class.
	 */
	public cssClass = 'flex-element';

	/**
	 * Active sidebar tab Id.
	 */
	public activeValue = '';

	public constructor() {
		this.items = this.provideDefaultTabs();
	}

	/**
	 * This function returns the default tabs to render.
	 * @returns default sidebar tabs.
	 */
	public provideDefaultTabs(): SidebarTab[] {
		return [
			new SidebarTab('sidebar-quickstart', { key: 'cloud.desktop.sdCmdBarQuickstart' }, 'sidebar-icons', 'ico-apps', 4, async () => {
				const special = await import('../../components/quickstart-sidebar-tab/quickstart-sidebar-tab.component');
				return special.UiSidebarQuickstartSidebarTabComponent;
			}),
			new SidebarTab('sidebar-favorites', { key: 'cloud.desktop.sdCmdBarFavorites' }, 'sidebar-icons', 'ico-project-favorites', 6, async () => {
				const special = await import('../../components/favorites-sidebar/favorites-sidebar-tab/favorites-sidebar-tab.component');
				return special.UiSidebarFavoritesSidebarTabComponent;
			}),
			new SidebarTab('sidebar-chatBot', { key: 'cloud.desktop.sdCmdBarChatBot' }, 'sidebar-icons', 'ico-chatbot', 2, async () => {
				const special = await import('../../components/chatbot-sidebar-tab/chatbot-sidebar-tab.component');
				return special.UiSidebarChatbotSidebarTabComponent;
			}),
			new SidebarTab('sidebar-lastobjects', { key: 'cloud.desktop.sdCmdBarLastObjects' }, 'sidebar-icons', 'ico-last-objects', 1, async () => {
				const special = await import('../../components/history-sidebar-tab/history-sidebar-tab.component');
				return special.UiSidebarHistorySidebarTabComponent;
			}),
			new SidebarTab('sidebar-task', { key: 'cloud.desktop.sdCmdBarTask' }, 'sidebar-icons', 'ico-task', 7, async () => {
				const special = await import('../../components/task-sidebar-tab/task-sidebar-tab.component');
				return special.UiSidebarTaskSidebarTabComponent;
			}),
			new SidebarTab('sidebar-workflow', { key: 'cloud.desktop.sdCmdBarWorkflow' }, 'sidebar-icons', 'ico-workflow', 8, async () => {
				const special = await import('../../components/workflow-sidebar-tab/workflow-sidebar-tab.component');
				return special.UiSidebarWorkflowSidebarTabComponent;
			}),
			new SidebarTab('sidebar-notification', { key: 'cloud.desktop.sdCmdBarNotification' }, 'sidebar-icons', 'ico-notification', 9, async () => {
				const special = await import('../../components/sidebar-notification/sidebar-notification.component');
				return special.UiSidebarNotificationComponent;
			})
		];
	}
}
