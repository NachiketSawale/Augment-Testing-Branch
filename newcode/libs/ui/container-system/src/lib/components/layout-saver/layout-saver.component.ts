/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, InjectionToken, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { AccessScope, IAccessScopeInfo, ITranslatable, PlatformConfigurationService, PlatformDateService, PlatformPermissionService, PlatformTranslateService, Translatable } from '@libs/platform/common';
import { UiCommonDialogService } from '@libs/ui/common';
import { IModuleTabView } from '../../model/tab/module-tab-view.interface';
import { IModuleTab } from '../../model/tab/module-tab.interface';
import { IContainerLayout } from '../../model/layout/container-layout.interface';
import { cloneDeep, get } from 'lodash';
import { HttpClient } from '@angular/common/http';
import { IContainerLayoutUpdater, IContainerLayoutVisitor } from '../../model/layout/layout-manager.interface';
import { ILayoutApi } from '../../model/layout/layout-api.interface';
import { ModuleLayoutService } from '../../services/module-layout.service';

// TODO: Maybe it will export from @libs in the future.
enum Permissions {
	/**
	 * Read permission (read access right)
	 */
	Read = 0x01,
	/**
	 * Write permission (write access right)
	 */
	Write = 0x02,
	/**
	 * Create permission (create access right)
	 */
	Create = 0x04,
	/**
	 * Delete permission (delete access right)
	 */
	Delete = 0x08,
	/**
	 * Execute permission (execute access right)
	 */
	Execute = 0x10,
}

export interface ISelections {
	/**
	 * Contains data of selected view.
	 */
	selectedView: IModuleTabView | null;

	/**
	 * Used for input view
	 */
	inputView: IModuleTabView | null;

	/**
	 * Used for selected view type config.
	 */
	selectedType?: IAccessScopeInfo;

	/**
	 * Contains filter definition for view.
	 */
	selectedFilter: {
		id: number | string,
		displayName: string | Translatable,
		disabled?: boolean
	} | null;

	/**
	 * Used to check if data laod at module start.
	 */
	loadDataModuleStart: boolean;

	/**
	 * Used to check if data laod at tab change.
	 */
	loadDataTabChanged: boolean;

	/**
	 * contains filter definition for view
	 */
	filterDefs: {
		valueMember: 'id',
		displayMember: 'displayName',
		group: {
			groupById: 'accessLevel'
		},
		items: IGeneratedItems[]
	};
}

// TODO: replace it with the global FilterDefinition
interface IAvailableFilterDef {
	/**
	 * contains access level id.
	 */
	accessLevelId: string;

	/**
	 * contains access level
	 */
	accessLevel: string;

	/**
	 * contains filter definitions.
	 */
	filterDef: unknown[];

	/**
	 * contains current definition.
	 */
	currentDefinition: unknown[];

	/**
	 * contains id for available filter.
	 */
	id: string | number;

	/**
	 * Used for filter name.
	 */
	filterName: string;

	/**
	 * Used for display name from available filters.
	 */
	displayName: string;
}

interface IGeneratedItems {
	/**
	 * contain id based on access level
	 */
	id: number | string;

	/**
	 * contain display name
	 */
	displayName: string | Translatable;

	/**
	 * contains type for view type.
	 */
	type?: string;

	/**
	 * contain id
	 */
	childId?: number | string;

	/**
	 * used for class name for view type
	 */
	cssClassButton?: string;

	/**
	 * check for is disabled.
	 */
	disabled?: boolean;

	/**
	 * contains access level id.
	 */
	accessLevelId?: string;

	/**
	 * contains data for access level
	 */
	accessLevel?: string;

	/**
	 * used for filter definitions for view type
	 */
	filterDef?: unknown[];

	/**
	 * Used for curren definition
	 */
	currentDefinition?: unknown[];

	/**
	 * contain filter name
	 */
	filterName?: string;
}

interface IModuleTabViewEx extends IModuleTabView {
	dialogName?: string;
}

const LAYOUT_SAVER_DATA_TOKEN = new InjectionToken('dlg-layout-saver-data');

export function getLayoutSaverDialogDataToken(): InjectionToken<IModuleTab> {
	return LAYOUT_SAVER_DATA_TOKEN;
}

const LAYOUT_SAVER_HELPER_TOKEN = new InjectionToken('dlg-layout-saver-helper');

export function getLayoutSaverDialogHelperToken(): InjectionToken<IContainerLayoutVisitor & IContainerLayoutUpdater> {
	return LAYOUT_SAVER_HELPER_TOKEN;
}

/**
 * This component responsible for save view functionality.
 *It is used to save new views and also used to rename and delete views.
 */
@Component({
	selector: 'ui-container-system-layout-saver',
	templateUrl: './layout-saver.component.html',
	styleUrls: ['./layout-saver.component.scss'],
})
export class UiContainerSystemLayoutSaverComponent implements OnInit {

	/**
	 * inject the UiCommonModalDialogService
	 */
	public readonly modalDialogService = inject(UiCommonDialogService);

	public tab = inject(getLayoutSaverDialogDataToken());

	public showSaveFilterInput = false;

	/**
	 * inject the PlatformTranslateService
	 */
	public readonly translate = inject(PlatformTranslateService);

	/**
	 * inject the PlatformPermissionService
	 */

	private readonly permissionService = inject(PlatformPermissionService);

	private readonly dateService = inject(PlatformDateService);

	private readonly layoutApi: ILayoutApi = inject(ModuleLayoutService);

	private http = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);

	//TODO: remove it when loadedUsers are ready.
	private static loadedUsers: { id: number }[] = [];
	private loadedUsers = UiContainerSystemLayoutSaverComponent.loadedUsers;

	/**
	 * Represent the input box disable or not
	 */
	public disableInput: boolean = false;

	/**
	 * Represent the Contains config locations objects for view types.
	 */
	public viewTypes!: Map<AccessScope, IAccessScopeInfo>;

	/**
	 * cast the viewTypes to array.
	 */
	public get viewTypeList() {
		return Array.from(this.viewTypes.entries());
	}

	public get viewName(): string {
		if (this._viewName) {
			return this._viewName;
		}
		return this.selections.inputView?.Description ?? '';
	}

	public set viewName(value: string) {
		this._viewName = value;
		this.selections.selectedView = null;
	}

	/**
	 * Represent the display view for container tab.
	 */
	public displayedViews: IModuleTabViewEx[] = [];

	/**
	 * Represents properties if search form filters data not available for
	 * save filter input.
	 */
	public noneFilter = {
		id: 0,
		displayName: 'None',
		disabled: false,
	};


	/**
	 * Used for view properties
	 */
	public selections: ISelections = {
		selectedView: null,
		inputView: null,
		selectedFilter: null,
		loadDataModuleStart: false,
		loadDataTabChanged: false,
		filterDefs: {
			valueMember: 'id',
			displayMember: 'displayName',
			group: {
				groupById: 'accessLevel'
			},
			items: []
		}
	};

	/**
	 * Used for save view labels.
	 */
	public labels = {
		savelocation: 'cloud.common.layout.savelocation',
		viewname: 'cloud.common.layout.viewname',
		assignSidebarFilter: 'cloud.common.layout.assignSidebarFilter',
		savename: 'cloud.common.layout.savename',
		loadModuleStart: 'cloud.common.layout.loadModuleStart',
		loadTabChanged: 'cloud.common.layout.loadTabChanged',
	};

	/**
	 * Represent the View Name
	 */
	private _viewName: string | null = null;

	/**
	 * Contains properties for search form filters based
	 * on view types for save filter input
	 */
	public filters!: IAvailableFilterDef[];

	public ngOnInit(): void {
		// TODO: get the data from createItems
		// basicsCommonConfigLocationListService.createItems({user: true, role: true, system: true, portal: true});
		this.viewTypes = new Map<AccessScope, IAccessScopeInfo>([
			[AccessScope.User, {
				scope: AccessScope.User,
				id: 'u',
				longId: 'user',
				value: '0',
				title: {
					key: 'basics.common.configLocation.user'
				},
				get name(): Translatable {
					return this.title;
				},
				priority: 1000
			}],
			[AccessScope.Role, {
				scope: AccessScope.Role,
				id: 'r',
				longId: 'role',
				value: '2',
				title: {
					key: 'basics.common.configLocation.role'
				},
				get name(): Translatable {
					return this.title;
				},
				priority: 100
			}],
			[AccessScope.Global, {
				scope: AccessScope.Global,
				id: 'g',
				longId: 'system',
				value: '1',
				title: {
					key: 'basics.common.configLocation.system'
				},
				get name(): Translatable {
					return this.title;
				},
				priority: 10
			}],
			[AccessScope.Portal, {
				scope: AccessScope.Portal,
				id: 'p',
				longId: 'portal',
				value: '3',
				title: {
					key: 'basics.common.configLocation.portal'
				},
				get name(): Translatable {
					return this.title;
				},
				priority: 50
			}]
		]);

		this.selections.selectedType = this.viewTypes.get(AccessScope.User);
		this.disableInput = !this.checkPermissions(Permissions.Write);
		//TODO: cloudDesktopSidebarService
		//if (cloudDesktopSidebarService.filterRequest.enhancedSearchEnabled && cloudDesktopSidebarService.filterRequest.enhancedSearchVersion === '2.0') {
		this.retrieveFilterDefBasedOnSelectedType(this.selections.selectedType).then(() => {
			this.showSaveFilterInput = true;
		});
		//	} else {
		//		this.showSaveFilterInput = false;
		//	}
		this.refreshViews(true);
	}

	public onFilterChanged() {
		if (this.selections.selectedFilter !== this.noneFilter) {
			this.selections.loadDataTabChanged = true;
			this.selections.loadDataModuleStart = true;
		}
	}

	/**
	 * rename the view
	 * @param newName
	 */
	public renameView(newName: string) {
		if (!this.selections.selectedView?.Id) {
			return;
		}
		this.layoutApi.renameView(this.selections.selectedView?.Id, newName).subscribe(
			() => {
				const toChangeView = this.displayedViews.find((v) => v.Id === this.selections.selectedView?.Id);
				if (toChangeView) {
					toChangeView.Description = newName;
				}
				this.refreshViews();
			}
		);
	}


	/**
	 * Used to filter availables view based on view types and
	 * display views based on selected view types.
	 */
	private refreshViews(setSelectedType = false): void {

		const currentView = this.tab.activeView;
		if (currentView && setSelectedType) {
			const initialView = this.tab.Views.find(x => x.Id === currentView.ModuleTabViewOriginFk);
			if (initialView) {
				if (initialView.IsPortal) {
					this.selections.selectedType = this.viewTypes.get(AccessScope.Portal);
				} else if (initialView.Issystem) {
					this.selections.selectedType = this.viewTypes.get(AccessScope.Global);
				} else if (initialView.FrmAccessroleFk) {
					this.selections.selectedType = this.viewTypes.get(AccessScope.Role);
				} else {
					this.selections.selectedType = this.viewTypes.get(AccessScope.User);
				}
			}
		}
		const selectedType = this.selections.selectedType?.scope;
		this.selections.selectedView = null;
		this.displayedViews = [];

		if (selectedType === AccessScope.Global) {
			this.displayedViews = this.tab.Views.filter(x => x.Issystem);
		}
		if (selectedType === AccessScope.Role) {
			this.displayedViews = this.tab.Views.filter(x => x.FrmAccessroleFk !== null);
		}
		if (selectedType === AccessScope.User) {
			this.displayedViews = this.tab.Views.filter(x => x.FrmUserFk !== null && !x.FrmAccessroleFk);
		}
		if (selectedType === AccessScope.Portal) {
			this.displayedViews = this.tab.Views.filter(x => x.IsPortal);
		}
		this.displayedViews.forEach((view) => {
			// TODO: let userName = platformUserInfoService.logonName(view.UpdatedBy || view.InsertedBy);
			let userName: string | undefined = get(this.loadedUsers[view.UpdatedBy || view.InsertedBy || 0], 'logonName');
			let extStr;
			const dateTime = this.dateService.formatLocal(view.UpdatedAt ?? view.InsertedAt ?? new Date(), 'dd/MM/yyyy | hh:mm:ss');
			if (userName) {
				extStr = userName + ' | ' + dateTime;
				view.dialogName = view.Description + ' (' + extStr + ')' + (view.Isdefault && (' (' + this.translate.instant('ui.common.dialog.defaultButton').text + ')') || '');
			} else {
				console.log('user info not found:' + view.UpdatedBy + ' | ' + view.InsertedBy);
				view.dialogName = view.Description + ' ( loading ...)';

				this.loadUsers([view.UpdatedBy || view.InsertedBy])
					.subscribe(() => {
						userName = get(this.loadedUsers[view.UpdatedBy || view.InsertedBy || 0], 'logonName', (view.UpdatedBy || view.InsertedBy || 0).toString() + ' | ' + this.translate.instant('platform.userInfoNotAvailable'));
						extStr = userName + ' | ' + dateTime;
						view.dialogName = view.Description + ' (' + extStr + ')' + (view.Isdefault && (' (' + this.translate.instant('ui.common.dialog.defaultButton').text + ')') || '');
					});
			}
		});

		if (currentView) {
			const selectedView = this.displayedViews.find((n) => {
				return n.Id === currentView.ModuleTabViewOriginFk;
			});

			this.selections.selectedView = selectedView ?? null;
			this.selectedViewChanged();
		}
	}


	// TODO: replace it with platformUserInfoService.loadUsers(userIds)
	private loadUsers(userIds: Array<number | undefined>) {
		return this.http.post<{ id: number }[]>(this.configService.webApiBaseUrl + 'services/platform/loaduserinfobyids', userIds)
			.pipe(map((result) => {
				result.forEach((item) => {
					this.loadedUsers[item.id] = item;
				});
			}));
	}

	// TODO: replace it with cloudDesktopBulkSearchDataService.fetchFilters(currentModuleName)
	private fetchFilters() {
		const filtersData = [
			{
				accessLevelId: 'n',
				accessLevel: 'New',
				filterDef: [
					{
						Children: [
							{
								Children: [],
								Context: {},
								Operands: [],
								Id: -1,
								Description: 'Rule 0',
								ConditionFk: -1,
								ConditionFktop: -1,
								ConditiontypeFk: 2,
								EntityIdentifier: null,
								OperatorFk: 33554445,
								ClobsFk: null,
								InsertedAt: '2023-03-21T08:48:21.2419162Z',
								InsertedBy: 0,
								UpdatedAt: null,
								UpdatedBy: null,
								Version: 0,
								BulkConfigurationEntities: null,
								_ruleEditorInstance: {},
							},
						],
						Context: {},
						Operands: [],
						Id: -1,
						Description: 'Group ',
						ConditionFk: null,
						ConditionFktop: null,
						ConditiontypeFk: 1,
						EntityIdentifier: null,
						OperatorFk: 16777217,
						ClobsFk: null,
						InsertedAt: '2023-03-21T08:48:20.7513265Z',
						InsertedBy: 0,
						UpdatedAt: null,
						UpdatedBy: null,
						Version: 0,
						BulkConfigurationEntities: null,
						_ruleEditorInstance: {},
					},
				],
				currentDefinition: [
					{
						Children: [
							{
								Children: [],
								Context: {},
								Operands: [],
								Id: -1,
								Description: 'Rule 0',
								ConditionFk: -1,
								ConditionFktop: -1,
								ConditiontypeFk: 2,
								EntityIdentifier: null,
								OperatorFk: 33554445,
								ClobsFk: null,
								InsertedAt: '2023-03-21T08:48:21.2419162Z',
								InsertedBy: 0,
								UpdatedAt: null,
								UpdatedBy: null,
								Version: 0,
								BulkConfigurationEntities: null,
								_ruleEditorInstance: {},
							},
						],
						Context: {},
						Operands: [],
						Id: -1,
						Description: 'Group ',
						ConditionFk: null,
						ConditionFktop: null,
						ConditiontypeFk: 1,
						EntityIdentifier: null,
						OperatorFk: 16777217,
						ClobsFk: null,
						InsertedAt: '2023-03-21T08:48:20.7513265Z',
						InsertedBy: 0,
						UpdatedAt: null,
						UpdatedBy: null,
						Version: 0,
						BulkConfigurationEntities: null,
						_ruleEditorInstance: {},
					},
				],
				id: 'New Filter',
				filterName: 'New Filter',
				displayName: 'New Filter',
			},
		];
		return Promise.resolve(filtersData);
	}

	/**
	 *Used to check read write permissions for selected view type.

	 * @param {Permissions} permission view permision
	 * @returns {boolean} check ispremission or not
	 */
	public checkPermissions(permission: Permissions): boolean {
		let isPermission = false;
		if (this.selections.selectedType?.scope === AccessScope.User) {
			isPermission = this.permissionService.has('00f979839fb94839a2998b4ca9dd12e5', permission);
		} else if (this.selections.selectedType?.scope === AccessScope.Global) {
			isPermission = this.permissionService.has('1b77aedb2fae468cb9fd539af120b87a', permission);
		} else if (this.selections.selectedType?.scope === AccessScope.Role) {
			isPermission = this.permissionService.has('842f845cb6934b109a40983366f981ef', permission);
		} else if (this.selections.selectedType?.scope === AccessScope.Portal) {
			isPermission = this.permissionService.has('c9e2ece5629b4037b4f8695c92e59c1b', permission);
		}
		return isPermission;
	}

	/**
	 * This function will trigger on changing view type.
	 */
	public selectedTypeChanged(): void {
		this.selections.selectedView = null;
		this.selections.selectedFilter = null;
		this.disableInput = !this.checkPermissions(Permissions.Write);
		this.refreshViews();
		if (this.selections.selectedType) {
			this.retrieveFilterDefBasedOnSelectedType(this.selections.selectedType).then();
		}
	}

	/**
	 *This function used to disable delete button.

	 * @returns {boolean} check disable Delete Option
	 */
	public disableDelete(): boolean {
		let result: boolean;
		if (this.selections.selectedView !== null) {
			result = !this.checkPermissions(Permissions.Delete);
		} else {
			result = true;
		}
		return result && this.selections.selectedView?.Description !== this.viewName;
	}

	/**
	 * ToDo: This function is required for Assign sidebar filter input field.
	 *  Once the dependent service implementation is done,that field will be added.
	 *
	 * @param {IAccessScopeInfo} selectedType Used to retrieve filters data
	 * based on selected view type.
	 */
	public retrieveFilterDefBasedOnSelectedType(selectedType?: IAccessScopeInfo) {
		if (selectedType) {
			//todo: this will replace once service is implemented.
			//currentModuleName = cloudDesktopSidebarService.filterRequest.moduleName;
			///if (this.currentModuleName) {
			//todo: this will replace once service is implemented.
			// cloudDesktopBulkSearchDataService.fetchFilters(currentModuleName).then(function (filters) {
			// });
			this.fetchFilters().then((filtersData) => {
				this.filters = filtersData;
				if (this.filters) {
					const availableFilterDefs = this.filters.filter((e) => {
						if ((selectedType.name as ITranslatable).text === 'System' || (selectedType.name as ITranslatable).text === 'Portal') {
							return e.accessLevel === 'System';
						} else if ((selectedType.name as ITranslatable).text === 'Role') {
							return e.accessLevel === 'System' || e.accessLevel === 'Role';
						} else {
							return true;
						}
					});

					this.selections.filterDefs.items = this.setItemsFormatInSelectbox(availableFilterDefs);
					this.selections.selectedFilter = this.noneFilter;
				}
				return Promise.resolve();
			});
		} else {
			this.selections.filterDefs.items = this.setItemsFormatInSelectbox([]);
		}
		return Promise.resolve();
	}

	/**
	 * Used to set items format in view type dropdown.
	 *
	 * @param {IAvailableFilterDef[]} items container filter def
	 * @returns {IGeneratedItems[]} container view items
	 */
	public setItemsFormatInSelectbox(items: IAvailableFilterDef[]): Array<IGeneratedItems> {
		let generatedItems: IGeneratedItems[] = [];
		const accessLevels = [
			{
				id: 'System',
				caption: this.translate.instant('basics.common.configLocation.system').text,
				//ToDo: This will change once service is implemented.
				//cssClass: 'title control-icons ' + (cloudDesktopBulkSearchDataService.hasSysFtrWrAccess ? 'ico-search-system' : 'ico-search-system-prot')
			},
			{
				id: 'User',
				caption: this.translate.instant('basics.common.configLocation.user').text,
				//ToDo: This will change once service is implemented.
				//cssClass: 'title control-icons ' + (cloudDesktopBulkSearchDataService.hasUserFtrWrAccess ? 'ico-search-user' : 'ico-search-user-prot')
			},
			{
				id: 'Role',
				caption: this.translate.instant('basics.common.configLocation.role').text,
				//ToDo: This will change once service is implemented.
				//cssClass: 'title control-icons ' + (cloudDesktopBulkSearchDataService.hasRoleFtrWrAccess ? 'ico-search-role' : 'ico-search-role-prot')
			},
		];

		accessLevels.forEach((level) => {
			const itemsFromList = items.filter((data) => data.accessLevel === level.id);
			if (itemsFromList.length > 0) {
				generatedItems.push({
					id: 666,
					displayName: level.caption,
					type: 'title',
					childId: level.id,
					//cssClassButton: level.cssClass,
					disabled: true,
				});
				// fill items for access level
				generatedItems = generatedItems.concat(itemsFromList);
			}
		});
		generatedItems.unshift(this.noneFilter);

		return generatedItems;
	}

	/**
	 * This function will trigger on changing selected view.
	 * It will get data of selected view.
	 */
	public selectedViewChanged(): void {
		this.selections.inputView = cloneDeep(this.selections.selectedView);
		this._viewName = this.selections.inputView?.Description ?? '';
		this.selections.selectedFilter = this.noneFilter;
		if (this.selections.inputView) {
			// TODO: selections.inputView.Config.filterId
			if ((this.selections.inputView.Config as IContainerLayout).layoutId) {
				const selectedFilter = this.selections.filterDefs.items.find((item) => {
					return item.id === (this.selections.inputView?.Config as IContainerLayout).layoutId;
				});
				if (selectedFilter) {
					this.selections.selectedFilter = selectedFilter;
				}
			}
			//this.selections.loadDataTabChanged = this.selections.inputView.Config.loadDataTabChanged ? this.selections.inputView.Config.loadDataTabChanged : false;
			//this.selections.loadDataModuleStart = this.selections.inputView.Config.loadDataModuleStart ? this.selections.inputView.Config.loadDataModuleStart : false;
		} else {
			this.selections.loadDataTabChanged = false;
			this.selections.loadDataModuleStart = false;
		}
	}

	/**
	 * Get data of selected view for delete and
	 * updated view name when view once selected
	 * view deleted.
	 *
	 */
	public delete(): void {
		this.deleteView(this.selections.selectedView);
		this.tab.Views = this.tab.Views.filter((x) => {
			return !(x.Id === this.selections.selectedView?.Id);
		});
		this.refreshViews();
		this.selections.inputView = null;
		this._viewName = null;
	}

	/**
	 * Used to get selected view from available views data
	 * and will delete that view and updated available views data.
	 *
	 * @param {IModuleTabView | null} viewObj container view object
	 */
	public deleteView(viewObj: IModuleTabView | null): void {
		if (viewObj !== null) {
			const index: number = this.tab.Views.indexOf(viewObj);
			this.tab.Views?.splice(index, 1);
			if (viewObj === this.tab.activeView) {
				this.tab.activeView = this.tab.Views[1];
			}
			this.layoutApi.deleteView(viewObj.Id).subscribe(() => {
				viewObj = null;
			});
		}
	}

	/**
	 * Used to check if updated view name similar to available view names
	 * for rename view functionality.
	 *
	 * @param {string} viewName view name
	 */
	public existView(viewName: string): boolean {
		const existingView = this.displayedViews.find((view) => {
			return view.Description === viewName;
		});
		return typeof existingView !== 'undefined';
	}


	/**
	 * Used to enable and disable rename button.
	 *
	 * @returns {boolean} check disable rename or not
	 */
	public disableRename(): boolean {
		let isDisable: boolean;
		if (this.selections.selectedView !== null) {
			isDisable = !this.checkPermissions(Permissions.Write);
		} else {
			isDisable = true;
		}
		return isDisable;
	}

	/**
	 * Used to enable and disable default button.
	 */
	public disableDefault(): boolean {
		const isDisable: boolean =
			typeof this.selections.selectedView !== 'undefined' &&
			this.selections.selectedView !== null &&
			!this.selections.selectedView.Isdefault &&
			this.selections.selectedType?.scope !== AccessScope.User &&
			this.checkPermissions(Permissions.Write);
		return !isDisable;
	}

	/**
	 * Used to enable and disable okay button.
	 */
	public disableOkay(): boolean {
		let isDisable: boolean = false;
		if (this.selections.selectedType !== null) {
			isDisable = !this.checkPermissions(Permissions.Write);
		}
		if (this.selections.inputView === null) {
			isDisable = true;
		}

		return isDisable;
	}

	/**
	 * Used to update views data after set view as default.
	 *
	 * @param {IModuleTabView} defaultView container view object
	 */
	public updateViewsAfterSetDefault(defaultView: IModuleTabView): void {
		this.tab.Views?.forEach((view) => {
			if (view.Isdefault && view.FrmAccessroleFk === defaultView.FrmAccessroleFk && view.FrmUserFk === defaultView.FrmUserFk && view.Issystem === defaultView.Issystem && view.IsPortal === defaultView.IsPortal) {
				view.Isdefault = false;
			}
			defaultView.Isdefault = true;
		});
	}

	/**
	 * Used to passed selected view data to default view api and
	 * make selected view as default view.
	 */
	public default(): void {
		if (this.selections.selectedView) {
			this.layoutApi.setViewAsDefault(this.selections.selectedView.Id)
				.subscribe((data) => {
					if ((this.selections.selectedView)) {
						this.updateViewsAfterSetDefault(this.selections.selectedView);
						this.refreshViews();
					}
				});
		}
		this._viewName = null;
	}

	/**
	 * Used for saving new view.
	 * Check if new view description is similar to available view description.
	 * Based on that functions will execute.
	 */
	public getView(): [IModuleTabView | null, AccessScope | undefined] {
		const found = this.displayedViews.find((item) => item.Description === this.viewName);

		if (found || this.selections.selectedView || this.selections.inputView?.Description !== 'Latest View') {

			const view = this.selections.selectedView ?? this.selections.inputView;

			if (view) {
				view.Description = this.viewName;
				if (!found) {
					view.Id = -1;
				}
			}
			return [view, this.selections.selectedType?.scope];
		}
		return [null, undefined];
	}

}
