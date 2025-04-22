/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { ITranslatable, PlatformTranslateService } from '@libs/platform/common';

import { IQuickstartAccordionData, IQuickstartModuleTab, IQuickstartSettings, UiSidebarQuickstartDataHandlingService, UiSidebarQuickstartTabsSettingsService } from '../../../index';
import { Router } from '@angular/router';
/**
 * Component handling Quickstart basic functionality.
 */
@Component({
	selector: 'ui-sidebar-quickstart-tab',
	templateUrl: './quickstart-sidebar-tab.component.html',
	styleUrls: ['./quickstart-sidebar-tab.component.scss'],
})
export class UiSidebarQuickstartSidebarTabComponent implements OnInit, OnDestroy {
	/**
	 * Quickstart page data.
	 */
	public pageAccordionData: IQuickstartAccordionData[] = [];

	/**
	 * Quickstart module tab data.
	 */
	public moduleAccordionData: IQuickstartAccordionData[] = [];

	/**
	 * Service prepares the quickstart data.
	 */
	private quickstartDataHandlingService = inject(UiSidebarQuickstartDataHandlingService);

	/**
	 * Service handles the module tabs state.
	 */
	private quickstartTabsSettingsService = inject(UiSidebarQuickstartTabsSettingsService);

	/**
	 * Service is useful for language translation.
	 */
	private platformTranslateService = inject(PlatformTranslateService);

	/**
	 *  Property to display overlay.
	 */
	public asyncInProgress: boolean = false;

	/**
	 * Module Accordion original data.
	 */
	private moduleAccordionDataOriginal: IQuickstartAccordionData[] = [];

	/**
	 * Is tabs visible.
	 */
	private showTabs!: boolean;

	/**
	 * search string
	 */
	public searchString: string = '';

	/**
	 * Holds the subscriptions objects.
	 */
	private subscriptions: Subscription[] = [];

	/**
	 * Handling router data using Router module
	 */
	private router = inject(Router);

	public ngOnInit(): void {
		this.platformTranslateService.load(['cloud.desktop']);
		this.showModules(true);
		this.watchSettingsChange();
	}

	/**
	 * Subscription called when quickstart settings change.
	 */
	private watchSettingsChange() {
		const subscription = this.quickstartDataHandlingService.settingsChanged$.subscribe(() => {
			this.showModules(false);
		});

		this.subscriptions.push(subscription);
	}

	/**
	 * @param {boolean} refreshData If true, the data is redetermined, that means loaded from the database. Otherwise the cached data will be fetched.
	 *
	 * Function prepares the data(page/module) fetched from server according to accordion.
	 */
	private showModules(refreshData: boolean) {
		this.asyncInProgress = true;
		const subscription = this.quickstartDataHandlingService.loadSettings$(refreshData).subscribe((settings) => {
			if (settings.showPages && settings.pages) {
				const uniquePages = settings.pages.filter((ele, index) => settings.pages?.findIndex((obj) => obj.id === ele.id) === index);

				const pages = uniquePages;

				this.pageAccordionData = this.getAccordionData(pages);
			} else {
				this.pageAccordionData = [];
			}
			const moduleItems = settings.desktopItems;
			this.showTabs = settings.showTabs;
			this.prepareModuleItems(moduleItems, settings.showTabs);
		});

		this.subscriptions.push(subscription);
	}

	/**
	 * Function prepares the data according to accordion.
	 *
	 * @param {IQuickstartSettings[]} items Quickstart data from server.
	 * @returns {IQuickstartAccordionData[]} Quickstart accordion data.
	 */
	private getAccordionData(items: IQuickstartSettings[]): IQuickstartAccordionData[] {
		const accordionData: IQuickstartAccordionData[] = [];
		items.forEach((item) => {
			const accordionDataItem: IQuickstartAccordionData = {
				id: item.id,
				hasChild: false,
				imgCss: item.iconClass,
				title: item.displayName,
				redirect: item.targetRoute,
				children: [],
			};
			accordionData.push(accordionDataItem);
		});

		return accordionData;
	}

	/**
	 * Prepares data for module tabs according to accordion.
	 *
	 * @param {IQuickstartSettings[]} moduleItems Module items from server and system.
	 * @param {boolean} showTabs
	 */
	private prepareModuleItems(moduleItems: IQuickstartSettings[], showTabs: boolean) {
		if (showTabs) {
			const tabId: string[] = [];
			moduleItems.forEach((item) => tabId.push(item.id));
			const subscription = this.quickstartTabsSettingsService.getTabsByModulenames$(tabId).subscribe((response) => {
				this.prepareModuleItemsWithTabs(moduleItems, response);
				this.search(this.searchString);
			});
			this.subscriptions.push(subscription);
		} else {
			const accordionData = this.getAccordionData(moduleItems);
			this.moduleAccordionData = accordionData;
			this.moduleAccordionDataOriginal = JSON.parse(JSON.stringify(accordionData));
			this.search(this.searchString);
		}
		this.asyncInProgress = false;
	}

	/**
	 * Prepares data for module tabs when tabs present according to accordion.
	 *
	 * @param {IQuickstartSettings[]} moduleItems Module items from server and system.
	 * @param {{ [key: string]: IQuickstartModuleTab[] }} tabsData Tabs items data.
	 */
	private prepareModuleItemsWithTabs(moduleItems: IQuickstartSettings[], tabsData: { [key: string]: IQuickstartModuleTab[] }) {
		const expandedTabs = this.quickstartTabsSettingsService.getTabsExpandedStatus();
		const tabKeys = Object.keys(tabsData);
		moduleItems = moduleItems.filter((item) => {
			return tabKeys.includes(item.id);
		});
		const accordionData = this.getAccordionData(moduleItems);
		accordionData.forEach((data) => {
			const tabData = tabsData[data.id];
			const childAccordionData: IQuickstartAccordionData[] = [];
			if (tabData.length > 1) {
				data.hasChild = true;
				tabData.forEach((tab) => {
					const childData: IQuickstartAccordionData = {
						id: tab.Id,
						title: tab.Description ? tab.Description : '',
						moduleId: data.id,
					};
					childAccordionData.push(childData);
				});
				data.children = childAccordionData;
				if (expandedTabs.includes(<string>data.id)) {
					data.expanded = true;
				} else {
					data.expanded = false;
				}
			} else {
				data.hasChild = false;
			}
		});
		this.moduleAccordionData = accordionData;
		this.moduleAccordionDataOriginal = JSON.parse(JSON.stringify(accordionData));
	}

	/**
	 * Function called when panel is closed.
	 *
	 * @param {IQuickstartAccordionData} item Accordion item data.
	 */
	public onPanelClosed(item: IQuickstartAccordionData) {
		this.quickstartTabsSettingsService.deleteExpandedTabId(<string>item.id);
	}

	/**
	 * Function called when panel is open.
	 *
	 * @param {IQuickstartAccordionData} item Accordion item data.
	 */
	public onPanelOpen(item: IQuickstartAccordionData) {
		this.quickstartTabsSettingsService.setTabsExpandedStatus(<string>item.id);
	}

	/**
	 * Function called when panel is selected.
	 *
	 * @param {IQuickstartAccordionData} item Accordion item data.
	 */
	public onPanelSelected(item: IQuickstartAccordionData) {
		//TODO:Functionality to be carried out on item click.
		console.log(item);
		const targetRoute = item.redirect;
		this.router.navigate([targetRoute]);
	}

	/**
	 * Function called when search string entered.
	 *
	 * @param {string} searchData
	 */
	public search(searchData: string) {
		const searchString = searchData.toLowerCase();
		const expandedTabs = this.quickstartTabsSettingsService.getTabsExpandedStatus();
		if (this.pageAccordionData.length > 0) {
			this.pageAccordionData.forEach((page: IQuickstartAccordionData, index: number) => {
				const pageId = (<ITranslatable>page.id).toString().toLowerCase() || '';
				const pageTitle = (<ITranslatable>page.title).text?.toLowerCase() || '';
				const children = page.children ?? [];
				const matchingChildren = children.filter((child) => (<string>child.title).toLowerCase().includes(searchString));
				if (pageTitle.includes(searchString) || pageId === searchString) {
					page.hidden = false;
					page.children = matchingChildren;
					page.hasChild = matchingChildren.length > 0;
				} else {
					page.hidden = true;
					page.children = [];
					page.hasChild = false;
				}
			});
		} else {
			this.moduleAccordionDataOriginal.forEach((data: IQuickstartAccordionData, index: number) => {
				let count = 0;
				const childDataModule = this.moduleAccordionData[index].children;
				if (this.showTabs) {
					data.children?.forEach((childData: IQuickstartAccordionData, childIndex: number) => {
						const titleData = (<string>childData.title).toLowerCase();
						const moduleId = (<string>childData.id).toLowerCase();
						const findIndex = childDataModule?.findIndex((tabData) => {
							return tabData.id === childData.id;
						});
						if (titleData.includes(searchString) || moduleId === searchString) {
							this.moduleAccordionData[index].hasChild = true;
							if (childDataModule && findIndex !== undefined && findIndex !== -1) {
								childDataModule[findIndex].hidden = false;
							} else {
								childDataModule?.splice(childIndex, 0, { ...childData });
							}
							this.moduleAccordionData[index].expanded = expandedTabs.includes(<string>data.id) ? true : false;
						} else {
							if (childDataModule && findIndex !== undefined && findIndex !== -1) {
								childDataModule[findIndex].hidden = true;
								count = count + 1;
							}
						}
					});
					if (count === childDataModule?.length) {
						this.moduleAccordionData[index].children = [];
						this.moduleAccordionData[index].hasChild = false;
					}
				}
				const headerTitle = (<ITranslatable>this.moduleAccordionData[index].title).text?.toLowerCase();
				const isPresent = !headerTitle?.includes(searchString) && count === childDataModule?.length;
				this.moduleAccordionData[index].hidden = isPresent ? true : false;
			});
		}
	}

	public ngOnDestroy() {
		this.subscriptions.forEach((s) => s.unsubscribe());
	}
}
