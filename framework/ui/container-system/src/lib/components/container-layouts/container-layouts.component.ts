/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { OnDestroy } from '@angular/core';
import { ContainerBase } from '../container-base/container-base';
import { IEditorPanels, ISplitterPaneLayout, ISplitterLayout, ISplitterLayouts } from './interfaces/container-layout.interface';
import { UiContainerSystemMainViewService } from '../../services/main-view.service';
import { ContainerModuleInfoBase } from '../../model/container-module-info-base.class';
import { IContainerLayout } from '../../model/layout/container-layout.interface';
import { ContainerDefinition } from '../../model/container-definition.class';
import { PlatformPermissionService, PlatformTranslateService } from '@libs/platform/common';
import { PlaceholderContainerComponent } from '../placeholder-container/placeholder-container.component';

/**
 * To render dynamic container layouts
 */

@Component({
	selector: 'ui-container-system-container-layouts',
	templateUrl: './container-layouts.component.html',
	styleUrls: ['./container-layouts.component.scss'],
})
export class UiContainerSystemContainerLayoutsComponent extends ContainerBase implements OnInit, OnDestroy {
	private layoutsData!: ISplitterLayouts[];
	private layoutData: ISplitterLayouts[] = [];
	public layout!: ISplitterLayout;
	public layoutId!: string;
	public tabData: IEditorPanels[] = [];
	private containerLayoutId = new Subscription();

	private CachePermissionData = new Map([
		['dde598002bbf4a2d96c82dc927e3e578', 15],
		['c2dd899746024732aa0fc583526f04eb', 0],
		['b5f01723e4c34b8d8f5b90262d7f0288', 15],
		['f01193df20e34b8d917250ad17a433f1', 15],
		['d0919db314094f058b6eca179f017e6d', 15],
		['4fefcbe307f14fb09e7371b5726e8b85', 15],
		['81de3f7a458942018890cd82b2333e5b', 15],
		['e84e703543fd4cb2b8d9bd8e48ecce94', 15],
		['9f5b6cfd39114a25b04b7ea69ef0ddc7', 15],
		['880ec74c43cc4778b94cd26f1b6115e3', 0],
		['63e8434947da4497a2df4032bf8bc192', 1],
		['ddfd93ac951e42f0bb947a847121a79a', 1],
		['43d1291116b641858c78ad23732e4e60', 1],
		['c76ac86dfcb84d2f8ee94627c3cf4a40', 1],
		['8e78bb9d0a7646b595ba01b23055af30', 1],
		['c1abf57656fc418e8e9acc65aa0e9ea4', 1],
		['14d5f58009ff11e5a6c01697f925ec7b', 1],
		['b71b610f564c40ed81dfe5d853bf5fe8', 1],
		['9f4ef6e2ff6d403fbb24f760c0c5fb70', 1],
		['af1dcf780b1b49c48857b990b455ac3c', 1]
	]);
	public constructor(http: HttpClient,
		translate: PlatformTranslateService,
		public mainview: UiContainerSystemMainViewService,
		public route: ActivatedRoute,
		public permissionService: PlatformPermissionService) {
		super(http, translate);

		this.initializeConstructor();

	}

	public ngOnInit(): void {
		this.permissionService.applyMockData(this.CachePermissionData);
	}

	/**
	 * Used to initialize constructor
	 */
	private initializeConstructor() {
		if (this.mainview.layoutInfo.length === 0) {
			this.getSplitterLayoutsData();
		}

		setTimeout(() => {
			this.containerLayoutId = this.mainview.layoutId.subscribe({
				next: (data) => {
					this.layoutId = data;

					this.layout = this.mainview.layoutInfo.filter((item: ISplitterLayout) => {
						return item.layoutId === data;
					})[0];
					this.getTabData();
					setTimeout(() => {
						this.mainview.layoutchange.next('change');
					}, 2000);

				},
				error: () => {
					// To handel error
				},
			});
		}, 1000);

	}

	/**
	 * This method filter out perticular layout data.
	 * Also send containers data in base call using mainview service
	 */
	private getSplitterLayoutsData() {

		this.getTitleIcon('container-layouts-demo.json').subscribe({
			next: (data) => {
				this.layoutsData = data as IContainerLayout[];
				this.getLayout();
			},
			error: () => {
				// To handel error
			},
		});

	}

	/**
	 * This function filter out layout information using layout id
	 */
	private getLayout() {

		this.layoutsData.forEach((data: ISplitterLayouts) => {

			// converting layout data as per requirement
			this.getSplitterData(data.splitterDef, data.layoutId);
		});

		// storing containers data
		this.mainview.containers.next(this.containers);
	}

	/**
	 * This method convert layout data into perticular format required for
	 * rendering dyanmic layouts.
	 */
	private getSplitterData(data: ISplitterLayout[], id: string) {

		const layouts = ['layout20', 'layout21', 'layout22', 'layout16', 'layout17', 'layout18', 'layout19'];

		const splitterData: ISplitterLayout = data[0];


		splitterData.panes.forEach((el: ISplitterPaneLayout, i: number) => {
			if (i === 0) {
				splitterData.selectorName === 'horizontal' ?
					el['selectorName'] = 'verticalLeft' : el['selectorName'] = 'horizontalTop';
			} else if (i === (splitterData.panes.length - 1)) {
				splitterData.selectorName === 'horizontal' ?
					el['selectorName'] = 'verticalRight' : el['selectorName'] = 'horizontalBottom';
			} else {
				el['selectorName'] = 'verticalCenter';
			}
		});

		splitterData.panes.forEach((ele: ISplitterPaneLayout) => {
			data.forEach((data: ISplitterLayout, j: number) => {
				if (j > 0) {
					if (ele.selectorName === data.selectorName) {

						ele['panes'] = data.panes;
						if (layouts.includes(id)) {
							ele['orientation'] = 'horizontal';
						} else {
							ele['orientation'] = 'vertical';
						}
					}
				}
			});
		});

		splitterData.panes.forEach((ele: ISplitterPaneLayout) => {
			if (!('panes' in ele)) {
				ele['panes'] = [];
			}
		});
		splitterData.layoutId = id;
		this.mainview.layoutInfo.push(splitterData);

	}


	/**
	 * This method used to get panel wise container tab
	 */
	private getTabData() {
		this.tabData = [];
		setTimeout(() => {
			this.mainview.getPaneData().forEach((ele: IEditorPanels) => {
				if (ele.panel.length !== 0) {
					this.tabData.push(ele);
				}
			});
		}, 0);

	}

	/**
	 * To convert splitter size into number
	 * @param data {string} splitter size in string
	 * @returns number
	 */
	public converter(data: string) {
		return Number(data);
	}


	/**
	 * To get containers information using it's uuid's.
	 * @param value{string[]} container's uuid's.
	 * @returns containers info array
	 */
	public getContainersInfo(value: string[]) {
		const containersInfo: ContainerDefinition[] = [];

		value.forEach((item: string) => {
			let cntDef = this.containers.find(data => data.uuid === item);
			if (!cntDef) {
				cntDef = new ContainerDefinition({
					uuid: item,
					title: {
						key: 'ui.container-system.missingCntTitle',
						params: {
							cntUuid: item
						}
					},
					containerType: PlaceholderContainerComponent
				});
			}
			containersInfo.push(cntDef);
		});
		return containersInfo;
	}

	/**
	 * This method used to access Active route data.
	 * @returns route snapshot data
	 */
	public get moduleInfo(): ContainerModuleInfoBase {
		return this.route.snapshot.data['moduleInfo'];
	}

	/**
	* This method return containers data.
	* @returns containers data.
	 */
	public get containers(): ContainerDefinition[] {
		return this.moduleInfo.effectiveContainers;
	}

	/**
	 * Unsubscribing layoutId subject
	 */
	public ngOnDestroy() {
		this.containerLayoutId.unsubscribe();
	}
}
