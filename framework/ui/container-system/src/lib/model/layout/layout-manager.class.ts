/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ILayoutManager, ILayoutManagerContext } from './layout-manager.interface';
import { IModuleTab } from '../tab/module-tab.interface';
import { IModuleTabView, IModuleTabViewAdditionalConfig, IModuleTabViewLayoutConfig } from '../tab/module-tab-view.interface';
import { AccessScope } from '@libs/platform/common';
import { firstValueFrom, map, Observable, Subject } from 'rxjs';
import { ITabChangedArgs } from '../tab/tab-changed-args';
import * as _ from 'lodash';
import { ContainerDefinition } from '../container-definition.class';
import { IContainerLayout } from './container-layout.interface';
import { IModuleTabViewConfig } from '../tab/module-tab-view-config.interface';
import { ISplitterLayout } from './splitter-layout.interface';
import { paneLayouts } from '../container-pane.model';
import { ILayoutExportItem } from '../layout-export-item.interface';
import { HttpHeaders } from '@angular/common/http';

/**
 * Represents the manager of layout.
 */
export class LayoutManager implements ILayoutManager {
	private _activeTab: number = -1;
	private _tabChanged: Subject<ITabChangedArgs> = new Subject<ITabChangedArgs>;
	private _viewChanged: Subject<IModuleTabView> = new Subject<IModuleTabView>;

	private get moduleInfo() {
		return this.initializeContext.moduleInfo;
	}

	private get tabs() {
		return this.initializeContext.tabs;
	}

	private get layoutApi() {
		return this.initializeContext.layoutApi;
	}

	/**
	 * Tab change event.
	 */
	public get tabChanged() {
		return this._tabChanged as Observable<ITabChangedArgs>;
	}

	/**
	 * View change event.
	 */
	public get viewChanged() {
		return this._viewChanged as Observable<IModuleTabView>;
	}

	/**
	 * Default constructor.
	 * @param initializeContext Represents the manager initialize context..
	 */
	public constructor(
		private initializeContext: ILayoutManagerContext
	) {
		this.initializeContext.tabs = this.transformTabs(this.initializeContext.tabs);
	}

	private isNewView(view: IModuleTabView) {
		return view.Id === -1;
	}

	private transformTabs(tabs: IModuleTab[]): IModuleTab[] {
		tabs.forEach(tab => {
			tab.activeView = this.createActiveView(tab);
			tab.Views.forEach(view => {
				if (_.isString(view.Config)) {
					view.Config = this.deserializeViewConfig(view.Config);
				}
			});
		});
		tabs = _.sortBy(this.tabs, 'Sorting');
		return tabs;
	}

	private createActiveView(tab: IModuleTab) {
		const activeView = tab.Views.find(view => view.Description === null);
		if (activeView) {
			return activeView;
		}

		const newView = this.createDefaultTabView(tab, this.moduleInfo.effectiveContainers.length ? [this.moduleInfo.effectiveContainers[0].uuid] : []);
		const baseView = tab.Views.find(view => {
			return view.Isdefault && view.FrmAccessroleFk === this.initializeContext.permissionRoleId;
		}) ?? tab.Views.find(view => {
			return view.Isdefault && view.Issystem === !this.initializeContext.isPortal && view.IsPortal === this.initializeContext.isPortal;
		});

		if (baseView) {
			newView.Config = _.cloneDeep(baseView.Config);
			newView.ModuleTabViewOriginFk = baseView.Id;

			if (baseView.ModuleTabViewConfigEntities) {
				newView.ModuleTabViewConfigEntities = _.cloneDeep(baseView.ModuleTabViewConfigEntities);
				newView.ModuleTabViewConfigEntities.forEach(config => {
					config.BasModuletabviewFk = newView.Id;
				});
			}
			tab.Views.push(newView);
		}
		return newView;
	}

	/**
	 * Create a default tab view.
	 * @param tab current tab.
	 * @param uuids the set of container uuid display in the layout by default.
	 */
	private createDefaultTabView(tab: IModuleTab, uuids: string[]): IModuleTabView {
		return {
			Id: -1,
			Description: null,
			FormatVersion: 2,
			BasModuletabFk: tab.Id,
			Config: {
				groups: [
					{
						content: uuids,
						pane: paneLayouts['layout0'].panes[0].name
					}
				],
				splitterDef: [],
				layoutId: paneLayouts['layout0'].layout
			},
			ModuleTabViewConfigEntities: [],
			Issystem: false,
			Isdefault: false,
			IsPortal: false,
			Isactivetab: false,
		};
	}

	private deserializeViewConfig(viewConfig: string): IContainerLayout {
		const containerLayout = JSON.parse(viewConfig) as IContainerLayout;
		const splitterDef = containerLayout.splitterDef.map(splitter => {
			const sum = _.sumBy(splitter.panes, function (pane) {
				return !pane.collapsed ? parseFloat(pane.size) : 0;
			});
			const defaultSize = (100.0 / splitter.panes.length).toString() + '%';
			const panes = splitter.panes.map(pane => {
				return {
					collapsed: pane.collapsed,
					size: sum > 100.1 ? defaultSize : pane.size
				};
			});
			return {
				selectorName: splitter.selectorName,
				panes: panes,
			} as ISplitterLayout;
		});

		return {
			groups: containerLayout.groups,
			splitterDef: splitterDef,
			layoutId: containerLayout.layoutId
		};
	}

	private applyViewTemplate(viewObj: IModuleTabView) {
		const latest = this.getActiveView();
		if (!latest) {
			return;
		}

		latest.Config = _.cloneDeep(viewObj.Config);
		latest.ModuleTabViewOriginFk = viewObj.Id;

		const layout = latest.Config as IModuleTabViewLayoutConfig;

		// merge config into latest and reset config when configuration not available in template
		layout.groups.forEach(group => {
			group.content.forEach(uuid => {
				const container = this.moduleInfo.effectiveContainers.find(c => c.uuid.toLowerCase() === uuid.toLowerCase());
				if (container) {
					this.setConfigProps(container, viewObj, latest);
				}
			});
		});

		// set version to 0 TODO: why set the version to 0?
		latest.ModuleTabViewConfigEntities.forEach(config => {
			_.set(config, 'Version', 0);
		});

		const activeTab = this.getActiveTab();
		if (activeTab) {
			activeTab.activeView = latest;
			const oldView = activeTab.Views.find(view => view.Id === latest.Id);
			if (oldView) {
				oldView.ModuleTabViewOriginFk = viewObj.Id;
			}
		}
	}

	private setConfigProps(container: ContainerDefinition, viewObj: IModuleTabView, latest: IModuleTabView) {
		const nConfig = _.filter(viewObj.ModuleTabViewConfigEntities, function (x) {
			return x.Guid.toLowerCase() === container.uuid.toLowerCase();
		});
		const newConfig = nConfig && nConfig.length > 0 ? nConfig[0] : null;
		const oConfig = _.filter(latest.ModuleTabViewConfigEntities, function (x) {
			return x.Guid.toLowerCase() === container.uuid.toLowerCase();
		});
		const config = oConfig && oConfig.length > 0 ? oConfig[0] : null;

		if (config && newConfig) {
			config.Gridconfig = newConfig.Gridconfig;
			config.Propertyconfig = newConfig.Propertyconfig;
			config.Viewdata = newConfig.Viewdata;
		} else if (config) {
			config.Gridconfig = undefined;
			config.Propertyconfig = undefined;
			config.Viewdata = undefined;
		} else if (newConfig) {
			latest.ModuleTabViewConfigEntities.push({
				BasModuletabviewFk: latest.Id,
				Gridconfig: newConfig.Gridconfig,
				Guid: container.uuid,
				Propertyconfig: newConfig.Propertyconfig,
				Viewdata: newConfig.Viewdata
			});
		} else {
			latest.ModuleTabViewConfigEntities.push({
				BasModuletabviewFk: latest.Id,
				Guid: container.uuid,
			});
		}
	}

	private saveConfigsForView(view: IModuleTabView, isLatest: boolean) {
		try {
			if (!view.ModuleTabViewConfigEntities || !view.ModuleTabViewConfigEntities.length) {
				return;
			}

			const configs: IModuleTabViewConfig[] = [];
			view.ModuleTabViewConfigEntities.forEach((config: IModuleTabViewConfig) => {
				const guid = config.Guid;

				if (!_.isNil(guid) && !_.isEmpty(guid) && guid.length === 32) {
					const found = _.filter(configs, function (x) {
						return x.Guid.toLowerCase() === guid.toLowerCase();
					});
					if (!found || (found && found.length === 0)) {
						const container = _.cloneDeep(config);

						container.Propertyconfig = _.isObject(container.Propertyconfig) ? JSON.stringify(container.Propertyconfig) : container.Propertyconfig;
						container.Gridconfig = _.isObject(container.Gridconfig) ? JSON.stringify(container.Gridconfig) : container.Gridconfig;
						// Uncomment when DTO is extended to include StatusBar
						// container.StatusBar = angular.isObject(container.StatusBar) ? JSON.stringify(container.StatusBar) : container.StatusBar;
						container.Viewdata = _.isObject(container.Viewdata) ? JSON.stringify(container.Viewdata) : container.Viewdata;
						if (!isLatest) {
							_.set(container, 'InsertedBy', 0);
							_.set(container, 'Version', 0);
						}
						container.BasModuletabviewFk = view.Id;
						configs.push(container);
					}
				}
			});

			if (configs.length) {
				this.layoutApi.saveConfig(configs).subscribe(() => {
					const activeView = this.getActiveView();
					activeView.ModuleTabViewConfigEntities.forEach(config => {
						if (!config.Version) {
							_.set(config, 'Version', 1);
						} else {
							_.set(config, 'Version', config.Version + 1);
						}
					});
				});
			}
		} catch (ex) {
			console.error(ex);
		}
	}

	private updateViewsAfterSetDefault(viewObj: IModuleTabView) {
		const activeTab = this.getActiveTab();
		if (activeTab) {
			activeTab.Views.forEach(view => {
				if (view.Isdefault && view.FrmAccessroleFk === viewObj.FrmAccessroleFk && view.FrmUserFk === viewObj.FrmUserFk && view.Issystem === viewObj.Issystem && view.IsPortal === viewObj.IsPortal) {
					view.Isdefault = false;
				}
				viewObj.Isdefault = true;
			});
		}
	}

	/**
	 * Retrieves all tabs.
	 */
	public getTabs() {
		return [...this.tabs];
	}

	/**
	 * Retrieves current active tab.
	 */
	public getActiveTab(): IModuleTab {
		return this.tabs.find(tab => tab.Id === this._activeTab) as IModuleTab;
	}

	/**
	 * Retrieves current active view.
	 */
	public getActiveView(): IModuleTabView {
		return this.getActiveTab().activeView as IModuleTabView;
	}

	/**
	 * Retrieves the view with specified id.
	 * @param id The view id.
	 */
	public getViewById(id: number): IModuleTabView {
		const tab = this.getActiveTab();
		return tab.Views.find(view => view.Id === id) as IModuleTabView;
	}

	/**
	 * Save current activated view or a specified view.
	 * @param viewInfo Current activated view or a specified view.
	 * @param accessScope The access scope of the view.
	 * @param additionalConfig Additional configuration.
	 */
	public saveView(viewInfo: IModuleTabView, accessScope?: AccessScope, additionalConfig?: IModuleTabViewAdditionalConfig): Promise<IModuleTabView> {
		const activeView = this.getActiveView();
		const activeTab = this.getActiveTab();

		let view!: IModuleTabView;
		let saveConfigs = false;

		if (this.isNewView(viewInfo)) {
			// New view
			view = _.cloneDeep(activeView);
			view.Id = viewInfo.Id;
			view.BasModuletabFk = activeTab.Id;
			view.Description = viewInfo.Description;
			view.Isdefault = viewInfo.Isdefault;
			view.css = undefined;
			view.hidden = undefined;
			activeTab.Views.push(view);
		} else {
			// Update view
			view = activeTab.Views.find(item => item.Id === viewInfo.Id) as IModuleTabView;
			if (activeView.ModuleTabViewConfigEntities) {
				view.ModuleTabViewConfigEntities = _.cloneDeep(activeView.ModuleTabViewConfigEntities);
				view.ModuleTabViewConfigEntities.forEach(config => {
					config.BasModuletabviewFk = view.Id;
				});
			} else {
				view.ModuleTabViewConfigEntities = [];
			}
			view.Config = _.cloneDeep(activeView.Config);
		}
		saveConfigs = true;

		let asRole = view.Issystem = view.IsPortal = false;

		if (additionalConfig && view.Config && !_.isString(view.Config)) {
			view.Config.filterId = additionalConfig.filterId;
			view.Config.loadDataModuleStart = additionalConfig.loadDataModuleStart;
			view.Config.loadDataTabChanged = additionalConfig.loadDataTabChanged;
			saveConfigs = true;
		}

		if (accessScope) {
			switch (accessScope) {
				case AccessScope.User:
					break;
				case AccessScope.Global:
					view.Issystem = true;
					break;
				case AccessScope.Role:
					asRole = true;
					break;
				case AccessScope.Portal:
					view.IsPortal = true;
					break;
			}
		}

		const result = this.layoutApi.saveView(view, asRole).pipe(
			map(result => {
				if (this.isNewView(view)) {
					view.ModuleTabViewConfigEntities.forEach(config => {
						config.BasModuletabviewFk = result.Id;
					});
					view.Id = result.Id;
					view.FrmUserFk = result.FrmUserFk;
					view.FrmAccessroleFk = result.FrmAccessroleFk;
				}
				_.extend(view, {
					Version: result.Version,
					InsertedBy: result.InsertedBy,
					InsertedAt: result.InsertedAt,
					UpdatedBy: result.UpdatedBy,
					UpdatedAt: result.UpdatedAt
				});

				if (saveConfigs) {
					this.applyViewTemplate(view);
					this.saveConfigsForView(view, !viewInfo);
					if (view.Isdefault) {
						this.updateViewsAfterSetDefault(view);
					}
				}
				return view;
			})
		);

		return firstValueFrom(result);
	}

	/**
	 * Change the current view with a specified view.
	 * @param view The view to be applied.
	 */
	public changeView(view: IModuleTabView): Promise<IModuleTabView> {
		this.applyViewTemplate(view);

		const activeView = this.getActiveView();
		const result = firstValueFrom(this.layoutApi.saveView(activeView, false));

		return result.then(view => {
			this._viewChanged.next(view);
			return view;
		});
	}

	/**
	 * Apply the layout to current view.
	 * @param layout The layout to be applied.
	 */
	public updateLayout(layout: IContainerLayout): Promise<IModuleTabView> {
		const activeView = this.getActiveView();
		activeView.Config = Object.assign(activeView.Config as IModuleTabViewLayoutConfig, layout);
		return firstValueFrom(this.layoutApi.saveView(activeView, false));
	}

	/**
	 * Apply the layout to current view.
	 * @param layout The layout to be applied.
	 */
	public applyLayout(layout: IContainerLayout): Promise<IModuleTabView> {
		const activeView = this.getActiveView();

		activeView.Config = {
			...activeView.Config as IModuleTabViewLayoutConfig,
			...layout
		};

		const result = firstValueFrom(this.layoutApi.saveView(activeView, false));

		return result.then(view => {
			this._viewChanged.next(view);
			return view;
		});
	}

	/**
	 * Sets the current active tab.
	 * @param tabId The id of tab.
	 */
	public setActiveTab(tabId: number): Promise<IModuleTabView> {
		const tabChangedArgs: ITabChangedArgs = {
			fromTab: this._activeTab != -1 ? this._activeTab : undefined,
			toTab: tabId
		};

		this._tabChanged.next(tabChangedArgs);
		this._activeTab = tabId;

		const activeView = this.getActiveView();

		return activeView.Version ? Promise.resolve(activeView) : firstValueFrom(this.layoutApi.saveView(activeView, false));
	}

	public exportLayouts(items: ILayoutExportItem[], tabId: number): void {
		this.layoutApi.exportLayouts(items,tabId)
			.subscribe((response) => {
			const config = response.body;
			const header: HttpHeaders = response.headers;
			const moduleName = this.moduleInfo.internalModuleName ?? '';

			return this.buildFiles(config, moduleName, header);
			}
			);
		}

	private buildFiles(config: object|null, moduleName: string, headers: HttpHeaders): void {

			const configStr = JSON.stringify(config).replace('/ /g', '');

			const octetStreamMime = 'application/octet-stream';

			const defaultFileName = `ExportedLayout_${moduleName}_MultipleViews.lsv`;

			// Get the filename from the x-filename header or default
			const filename = headers.get('X-Filename') || defaultFileName;

			// Determine the content type from the header or default to "application/octet-stream"
			const contentType = headers.get('Content-Type') || octetStreamMime;

			// Get the blob url creator
			const urlCreator = window.URL || window.webkitURL;

			if (urlCreator) {
				// Try to use a download link
				const link = document.createElement('a');

				// Try to simulate a click
				try {
					// Prepare a blob URL
					const blob = new Blob([configStr], {type: contentType});

					// noinspection JSUnresolvedFunction
					const url = urlCreator.createObjectURL(blob);

					link.setAttribute('href', url);

					// Set the download attribute (Supported in Chrome 14+ / Firefox 20+)
					link.setAttribute('download', filename);

					// Simulate clicking the download link
					const event: MouseEvent = document.createEvent('MouseEvents');

					event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
					link.dispatchEvent(event);
				} catch (ex) {
					throw new Error('Download link method with simulated click failed with the exception:' + ex);
				}
			}
		}


	public importLayouts(tabId: number, fileReaderData: string | ArrayBuffer): Promise<void> {
		return firstValueFrom(this.layoutApi.importLayouts(tabId,fileReaderData));
	}

}