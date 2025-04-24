/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ContainerDefinition, ContainerModuleInfoBase } from '../../';
import { IModuleTab } from '../model/tab/module-tab.interface';
import { from, Observable, tap } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { ILayoutExportItem } from '../model/layout-export-item.interface';
import { IModuleTabView, IModuleTabViewLayoutConfig } from '../model/tab/module-tab-view.interface';
import { IModuleTabViewConfig } from '../model/tab/module-tab-view-config.interface';
import { ILayoutApi } from '../model/layout/layout-api.interface';
import { IPaneDefinition } from '../model/container-pane.model';

@Injectable({
	providedIn: 'root',
})
export class ModuleLayoutService implements ILayoutApi {
	private httpClient = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);

	private _moduleName: string = '';
	private _tabs: IModuleTab[] = [];
	private _containerDefinitions?: ContainerDefinition[];

	/**
	 * Used to stored updated active tab data on container-resized.
	 */
	public paneActiveTab!: IPaneDefinition;

	/**
	 * Used to checked if container is maximize or minimize
	 */
	public isContainerFullSize : boolean = false;

	/**
	 * Used to inject translate service
	 */
	private readonly translate = inject(PlatformTranslateService);

	/**
	 * Toggle value based on click event
	 * @method updateContainerSize
	 */
	public updateContainerSize(): void {
		this.isContainerFullSize  = !this.isContainerFullSize ;
	}

	/**
	 * sets button title to maximize and minimize based on isContainerFullSize  flag
	 * @method getCurrentTooltip
	 * @returns {string} Returns title as maximize or minimize
	 */
	public getCurrentTooltip(): string {
		return this.isContainerFullSize  ? this.translate.instant('cloud.common.minimize').text : this.translate.instant('cloud.common.maximize').text;
	}

	/**
	 * sets class based on isFullscreen flag
	 * @method getResizeClass
	 * @returns {string} Returns class name for maximize or minimize
	 */
	public getResizeClass(): string {
		return this.isContainerFullSize  ? 'tlb-icons ico-minimized2 highlight' : 'tlb-icons ico-maximized2';
	}


	/**
	 * All declared containers of the current module.
	 */
	public get containerDefinitions(): ContainerDefinition[] {
		return this._containerDefinitions ?? [];
	}

	private loadDataForModule(moduleName: string): void {

	}

	/**
	 * declare the variable as per the document
	 */
	private containerDefinition!: ContainerDefinition[];

	/**
	 * @method
	 * @description As per the document here we define the method.
	 */
	// TODO: because import/export and save layouts are developing at the same time, warp it to an interface later.
	public importLayouts(tabId: number, fileReaderData: string | ArrayBuffer): Observable<void> {

		const payload = {
			ActiveModule: this._moduleName ?? '',
			Activetab: tabId,
			Layouts: fileReaderData,
			overwrite: true,
		};
		return this.httpClient.post<void>(`${this.configService.webApiBaseUrl}basics/layout/importlayouts`, payload);
	}

	public exportLayouts(items: ILayoutExportItem[], tabId: number) {
		const LayoutIds: number[] = [];
		items.forEach(x => {
			if (x.export) {
				LayoutIds.push(x.Id);
			}
		});

		const viewObj = {
			LayoutIds: LayoutIds,
			Modulename: this._moduleName,
			TabId: tabId
		};
		return this.httpClient.post(`${this.configService.webApiBaseUrl}basics/layout/exportlayout`, viewObj, {observe: 'response', responseType: 'json'});
	}

	public renameView(viewId: number, newName: string) {
		return this.httpClient.post<void>(this.configService.webApiBaseUrl + `basics/layout/renameview?id=${viewId}&newName=${newName}`, '');
	}

	public deleteView(viewId: number): Observable<void> {
		return this.httpClient.post<void>(this.configService.webApiBaseUrl + 'basics/layout/deleteview?viewId=' + viewId, '');
	}

	public setViewAsDefault(viewId: number): Observable<boolean> {
		return this.httpClient.post<boolean>(this.configService.webApiBaseUrl + 'basics/layout/setdefault?id=' + viewId, '');
	}

	private setLayoutConfig() {
	}

	/**
	 * Finds a container definition by its UUID.
	 * @param uuid The container UUID to find.
	 */
	public getContainerByUuid(uuid: string): ContainerDefinition | null {
		if (this._containerDefinitions) {
			return this._containerDefinitions.find(cntDef => cntDef.uuid === uuid) ?? null;
		}

		return null;
	}

	private saveModuleConfig() {
	}

	private setModuleConfig(uuid: string, config: string, grouping: string, gridInfo: string, options: string) {
	}

	private setModuleCustomConfig(uuid: string, value: number, options: string) {
	}

	private resetModuleConfig(uuid: string) {
	}

	private getModuleConfig(uuid: string) {
	}

	private hasModuleConfig(uuid: string, type: 'u' | 'r' | 's' | 'p') {
	}

	private serializeViewConfig(viewConfig: string | IModuleTabViewLayoutConfig): string {
		if (!_.isString(viewConfig)) {
			return JSON.stringify(viewConfig);
		}
		return viewConfig as string;
	}

	/**
	 * Load current module's tabs.
	 */
	public getTabs(moduleName: string): Observable<IModuleTab[]> {
		const lowerCaseName = moduleName.toLowerCase();
		if (lowerCaseName === this._moduleName) {
			return from([this._tabs]);
		}
		const params = {
			moduleName: lowerCaseName,
			formatVersion: 2
		};
		return this.httpClient.get<IModuleTab[]>(`${this.configService.webApiBaseUrl}basics/layout/gettabs`, {
			params: params
		}).pipe(
			tap(tabs => {
				this._moduleName = lowerCaseName;
				this._tabs = tabs;
			})
		);
	}

	/**
	 * Save the view.
	 * @param view The view to be saved.
	 * @param asRole Indicates whether save the view as role view.
	 */
	public saveView(view: IModuleTabView, asRole: boolean): Observable<IModuleTabView> {
		const transView = _.cloneDeep(view);

		transView.Config = this.serializeViewConfig(transView.Config);
		transView.ModuleTabViewConfigEntities = [];

		return this.httpClient.post<IModuleTabView>(this.configService.webApiBaseUrl + 'basics/layout/saveview', transView, {
			params: {
				asRole: asRole
			}
		});
	}

	/**
	 * Save view configs.
	 * @param configs The configs to be saved.
	 */
	public saveConfig(configs: IModuleTabViewConfig[]): Observable<void> {
		return new Observable<void>(subscriber => {
			this.httpClient.post(this.configService.webApiBaseUrl + 'basics/layout/saveconfigs', configs).subscribe(() => {
				subscriber.next();
				subscriber.complete();
			});
		});
	}

	/**
	 * Prepared required data for active route.
	 * @param route The activated route snapshot.
	 * @param state The router state snapshot.
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IModuleTab[]> {
		const moduleInfo = (route.data['moduleInfo'] as ContainerModuleInfoBase);
		return this.getTabs(moduleInfo.internalModuleName);
	}
}
