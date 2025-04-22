/*
 * Copyright(c) RIB Software GmbH
 */

import { Subscription } from 'rxjs';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';

import { IMenuItemsList, ItemType, IYesNoDialogOptions, UiCommonMessageBoxService } from '@libs/ui/common';

import { UiSidebarFavoritesService } from '../../../services/sidebar-favorites.service';

import { ISidebarFavorites } from '../../../model/interfaces/favorites/sidebar-favorites.interface';
import { ISidebarFavoritesData } from '../../../model/interfaces/favorites/sidebar-favorites-data.interface';
import { ISidebarFavoritesFavInfo } from '../../../model/interfaces/favorites/sidebar-favorites-info.interface';
import { ISidebarFavoritesProject } from '../../../model/interfaces/favorites/sidebar-favorites-project.interface';
import { ISidebarFavoritesFavType } from '../../../model/interfaces/favorites/sidebar-favorites-favtype.interface';
import { ISidebarFavoritesProjectName } from '../../../model/interfaces/favorites/sidebar-favorites-project-name.interface';
import { ISidebarFavoriteAccordionData } from '../../../model/interfaces/favorites/sidebar-favorites-accordion-data.interface';

/*
 * This class implements basic sidebar favorites tab functionality.
 */
@Component({
	selector: 'ui-sidebar-favorites-sidebar-tab',
	templateUrl: './favorites-sidebar-tab.component.html',
	styleUrls: ['./favorites-sidebar-tab.component.scss'],
})
export class UiSidebarFavoritesSidebarTabComponent implements OnInit, OnDestroy {
	/**
	 * Holds sortable(edit/sort) state of sidebar.
	 */
	public isSortable = false;

	/**
	 * Property to render overlay.
	 */
	public refreshPending = true;

	/**
	 * Holds Favorites Accordion data list to render.
	 */
	public favoriteAccordionData: ISidebarFavoriteAccordionData[] = [];

	/**
	 * Sidebar favorite service instance.
	 */
	private sidebarFavoriteService = inject(UiSidebarFavoritesService);

	/**
	 * Base class that provides change detection functionality.
	 */
	private cdRef = inject(ChangeDetectorRef);

	/**
	 * Just disposes the resource held by the subscription.
	 */
	private resultSubscription!: Subscription | undefined;

	/**
	 * This service creates the configuration object for modal dialog and also opens and closes modal dialog.
	 */
	private messageBoxService = inject(UiCommonMessageBoxService);

	/**
	 * Initializes the favorites sidebar tab.
	 */
	public ngOnInit() {
		this.onRefresh();
	}

	/**
	 * Toolbar data for header
	 */
	public readonly toolbarData: IMenuItemsList = {
		cssClass: 'tools',
		items: [
			{
				caption: {
					key: 'cloud.desktop.favorites.addProjectDlgTitle'
				},
				iconClass: 'control-icons ico-plus',
				isDisplayed: true,
				type: ItemType.Item,
				fn: () => {
					this.onAddProject();
				},
				disabled: () => {
					return this.isSortable;
				}
			},
			{
				caption: {
					key: 'cloud.desktop.toolbarRefresh',
				},
				iconClass: 'tlb-icons ico-refresh ',
				isDisplayed: true,
				type: ItemType.Item,
				fn: () => {
					this.onRefresh();
				},
				disabled: () => {
					return this.isSortable;
				}
			},
			{
				caption: { key: 'cloud.desktop.favorites.sort' },
				iconClass: 'tlb-icons ico-edit-list',
				isDisplayed: true,
				type: ItemType.Item,
				fn: () => {
					this.processSortable();
				},
			}
		],
	};

	/**
	 * Function adds the project to favorites list when clicked on add project button.
	 */
	public onAddProject() {
		//TODO: Dialog will get opened to add the project.
		//TODO: Kept static for time being.

		this.sidebarFavoriteService.addProjectToFavorites(1007973, '999-999-04', true);
		this.sidebarFavoriteService.saveFavoritesSetting$().subscribe(() => {
			this.onRefresh();
		});
	}

	/**
	 * Function changes the favorites sidebar tab states when sortable button is clicked.
	 */
	public processSortable() {
		this.isSortable = !this.isSortable;
		if (!this.isSortable) {
			this.disableSortable();
		}
	}

	/**
	 * Function fetches the data from database and processes it according to Accordion data type.
	 */
	public onRefresh() {
		this.refreshPending = true;
		this.sidebarFavoriteService.readFavorites$().subscribe((data: ISidebarFavoritesData) => {
			if (data) {
				this.processFavorites(data);
				this.refreshPending = false;
				this.cdRef.detectChanges();
			}
		});
	}

	/**
	 * Function processes the favorites data received from APi according to Accordion data type.
	 *
	 * @param {ISidebarFavoritesData} apiData Data fetched from APi.
	 */
	private processFavorites(apiData: ISidebarFavoritesData) {
		const favSetting = this.sidebarFavoriteService.favoritesSettings;
		const dataWithSortProp: ISidebarFavoritesProject[] = [];
		const dataWithoutSortProp: ISidebarFavoritesProject[] = [];
		Object.entries(apiData.projectInfo).forEach(([key, value]) => {
			value.addedAt = favSetting[value.projectId].addedAt;
			value.projectName = this.sidebarFavoriteService.isJsonObj(favSetting[value.projectId].projectName) ? JSON.parse(favSetting[value.projectId].projectName) : favSetting[value.projectId].projectName;
			typeof value.projectName === 'string' ? dataWithoutSortProp.push(value) : dataWithSortProp.push(value);
		});

		dataWithoutSortProp.sort((record1, record2) => {
			return record1.addedAt.localeCompare(record2.addedAt);
		});
		dataWithSortProp.sort((record1, record2) => {
			return (<ISidebarFavoritesProjectName>record1.projectName).sort - (<ISidebarFavoritesProjectName>record2.projectName).sort;
		});

		const sortedProjects = dataWithSortProp.concat(dataWithoutSortProp);
		this.addProjects(sortedProjects, favSetting);
	}

	/**
	 * Function prepares the projects accordion data.
	 *
	 * @param {ISidebarFavoritesProject[]} sortedProjects Sorted projects information.
	 * @param {Record<string | number, ISidebarFavorites>} favSetting Project setting data.
	 */
	private addProjects(sortedProjects: ISidebarFavoritesProject[], favSetting: Record<string | number, ISidebarFavorites>) {
		const accordion: ISidebarFavoriteAccordionData[] = [];
		sortedProjects.forEach((project) => {
			this.checkFavSettings(project.projectId, 0);
			const expanded = favSetting[project.projectId].expanded[0];
			const panelItemIdObj = {
				projectId: project.projectId,
				favType: 0,
			};
			const accordionData = this.setBasicInfo(project.projectDescription, panelItemIdObj, 'ico-project', undefined, expanded);
			if (project.itemToFavType && Object.keys(project.itemToFavType).length) {
				accordionData.hasChild = true;
				accordionData.children = this.addfavType(project, favSetting);
			}
			accordion.push(accordionData);
		});

		this.favoriteAccordionData = accordion;
	}

	/**
	 * Function prepares the favType data.
	 *
	 * @param {ISidebarFavoritesProject} project Project information.
	 * @param {Record<string | number, ISidebarFavorites>} favSetting Project setting data.
	 * @returns { ISidebarFavoriteAccordionData[] } Accordion data.
	 */
	private addfavType(project: ISidebarFavoritesProject, favSetting: Record<string | number, ISidebarFavorites>): ISidebarFavoriteAccordionData[] {
		const accordionChild: ISidebarFavoriteAccordionData[] = [];
		const keys: number[] = [];

		Object.keys(project.itemToFavType).forEach((key) => {
			keys.push(+key);
		});

		const sortedKeys = keys.sort((key1, key2) => {
			return (this.getFavTypeInfoById(key1)?.sort ?? 0) - (this.getFavTypeInfoById(key2)?.sort ?? 0);
		});

		const sortedItems: ISidebarFavoritesFavType[][] = [];

		sortedKeys.forEach((key) => {
			sortedItems.push(project.itemToFavType[key]);
		});

		sortedItems.forEach((item, i) => {
			const favType = sortedKeys[i];
			this.checkFavSettings(project.projectId, favType);
			const info = this.getFavTypeInfoById(favType);
			if (info) {
				const expanded = favSetting[project.projectId].expanded[favType];
				const panelItemIdObj = {
					projectId: project.projectId,
					favType: favType,
				};
				const accordionChildData = this.setBasicInfo(info.name, panelItemIdObj, info.ico, undefined, expanded);
				if (item.length) {
					accordionChildData.hasChild = true;
					accordionChildData.children = this.addLeaveNode(item, project.projectId);
				}
				accordionChild.push(accordionChildData);
			}
		});

		return accordionChild;
	}

	/**
	 * Function prepares the leave node panel data.
	 *
	 * @param {ISidebarFavoritesFavType[]} nodeItem Leave item.
	 * @param {number} projectId Unique project id.
	 * @returns {ISidebarFavoriteAccordionData[]} Accordion data.
	 */
	private addLeaveNode(nodeItem: ISidebarFavoritesFavType[], projectId: number): ISidebarFavoriteAccordionData[] {
		const accordionLeaveNode: ISidebarFavoriteAccordionData[] = [];
		nodeItem.forEach((item) => {
			const panelItemIdObj = {
				projectId: projectId,
				favType: item.favType,
			};
			const accordionLeaveNodeData = this.setBasicInfo(item.description, panelItemIdObj, '', item.id);
			accordionLeaveNode.push(accordionLeaveNodeData);
		});
		return accordionLeaveNode;
	}

	/**
	 * Function sets the Basic common information for the panels.
	 *
	 * @param {string} title Item title.
	 * @param {Record<string,number>} panelIdObj Id object
	 * @param {string} imgCss Item css.
	 * @param {number} itemId Optional Unique leave node item id.
	 * @param {boolean} expanded Optional Panel state.
	 * @returns {ISidebarFavoriteAccordionData} AccordionData
	 */
	private setBasicInfo(title: string, panelIdObj: Record<string, number>, imgCss: string, itemId?: number, expanded?: boolean): ISidebarFavoriteAccordionData {
		const accordionData: ISidebarFavoriteAccordionData = { id: '' };
		accordionData.title = title;
		accordionData.imgCss = imgCss;
		accordionData.projectId = panelIdObj['projectId'];
		accordionData.favType = panelIdObj['favType'];
		if (itemId) {
			accordionData.itemId = itemId;
		}
		accordionData.expanded = expanded;
		return accordionData;
	}

	/**
	 * Function returns the detailed information for respective favorite type provided.
	 *
	 * @param {number} favtype Favorite type number.
	 * @returns {ISidebarFavoritesFavInfo} Information.
	 */
	private getFavTypeInfoById(favtype: number): ISidebarFavoritesFavInfo | undefined {
		return this.sidebarFavoriteService.favtypeInfo[favtype];
	}

	/**
	 * Function is called upon when panel is opened and saves the state.
	 *
	 * @param {ISidebarFavoriteAccordionData} panelData Panel accordion data.
	 */
	public onPanelOpen(panelData: ISidebarFavoriteAccordionData) {
		if (panelData.projectId && typeof panelData.favType === 'number') {
			this.sidebarFavoriteService.favoritesSettings[panelData.projectId].expanded[panelData.favType] = true;
		}
		this.changeExpandState(panelData, true);
		this.saveFavoriteData();
	}

	/**
	 * Function is called upon when panel is closed and saves the state.
	 *
	 * @param {ISidebarFavoriteAccordionData} panelData Panel accordion data.
	 */
	public onPanelClose(panelData: ISidebarFavoriteAccordionData) {
		if (panelData.projectId && typeof panelData.favType === 'number') {
			this.sidebarFavoriteService.favoritesSettings[panelData.projectId].expanded[panelData.favType] = false;
		}
		this.changeExpandState(panelData, false);
		this.saveFavoriteData();
	}

	/**
	 * Functions saves favorites data to database.
	 */
	private saveFavoriteData() {
		this.refreshPending = true;
		this.sidebarFavoriteService.saveFavoritesSetting$().subscribe(() => {
			this.refreshPending = false;
		});
	}

	/**
	 * Function changes the expanded state of panel based on the state provided.
	 *
	 * @param {ISidebarFavoriteAccordionData} panelData Accordion panel data.
	 * @param {boolean} state Panel state.
	 */
	private changeExpandState(panelData: ISidebarFavoriteAccordionData, state: boolean) {
		this.favoriteAccordionData.forEach((data) => {
			if (data.projectId === panelData.projectId) {
				if (data.favType === panelData.favType) {
					data.expanded = state;
				} else {
					data.children?.forEach((childData: ISidebarFavoriteAccordionData) => {
						if (childData.favType === panelData.favType) {
							childData.expanded = state;
						}
					});
				}
			}
		});
	}

	/**
	 * Functions removes the project from favorites list when delete button is clicked.
	 *
	 * @param {number} id Unique project id.
	 */
	public async onProjectDeleteClick(id: number) {
		const headerTexttr = 'cloud.desktop.favorites.delProjectTitle';
		const bodyTextKeytr = 'cloud.desktop.favorites.delProjectConfirm';
		const options: IYesNoDialogOptions = {
			defaultButtonId: 'yes',
			id: 'YesNoModal',
			showCancelButton: false,
			headerText: headerTexttr,
			bodyText: bodyTextKeytr
		};
		const result = await this.messageBoxService.showYesNoDialog(options);
		// TODO: replace with constant
		if (result?.closingButtonId === 'yes') {
			this.sidebarFavoriteService.removeProjectFromFavorites(id);
			this.sidebarFavoriteService.saveFavoritesSetting$().subscribe(() => {
				this.onRefresh();
			});
		}
	}

	/**
	 * This function sets the expanded state value for accordion item to default value(false)
	 * when the value is undefined.
	 *
	 * @param {number} id Project id.
	 * @param {number} favType Favorite type number.
	 */
	private checkFavSettings(id: number, favType: number) {
		if (!this.sidebarFavoriteService.favoritesSettings[id].expanded) {
			this.sidebarFavoriteService.favoritesSettings[id].expanded = {};
		}
		if (!this.sidebarFavoriteService.favoritesSettings[id].expanded[favType]) {
			this.sidebarFavoriteService.favoritesSettings[id].expanded[favType] = false;
		}
	}

	/**
	 * function retains the expanded state for accordion when sortable is inactive.
	 */
	private disableSortable() {
		this.favoriteAccordionData.forEach((data: ISidebarFavoriteAccordionData) => {
			if (data.projectId) {
				data.expanded = this.sidebarFavoriteService.favoritesSettings[data.projectId].expanded[0];
				if (data.hasChild && data.children && data.children.length) {
					data.children.forEach((childData: ISidebarFavoriteAccordionData) => {
						if (childData.favType && data.projectId) {
							const key = childData.favType;
							childData.expanded = this.sidebarFavoriteService.favoritesSettings[data.projectId].expanded[key];
						}
					});
				}
			}
			this.cdRef.detectChanges();
		});
		this.sidebarFavoriteService.saveFavoritesSetting$().subscribe();
	}

	/**
	 *	This function performs the action on the item selected from favorites accordion.
	 *
	 * @param {ISidebarFavoriteAccordionData} event Selected item.
	 */
	public onPanelSelected(event: ISidebarFavoriteAccordionData) {
		//TODO: Operations to be carried out on respective item click.
		console.log(event);
	}

	public ngOnDestroy() {
		this.resultSubscription?.unsubscribe();
	}
}
