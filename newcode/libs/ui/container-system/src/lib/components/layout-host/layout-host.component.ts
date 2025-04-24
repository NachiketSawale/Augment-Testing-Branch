/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';

import { cloneDeep } from 'lodash';

import { ModuleLayoutService } from '../../services/module-layout.service';

import { UiContainerSystemLayoutSplitterComponent } from '../layout-splitter/layout-splitter.component';

import { ContainerDefinition } from '../../model/container-definition.class';
import {IContainerLayout} from '../../model/layout/container-layout.interface';
import {paneLayouts, IPaneLayout, IPaneDefinition, ILayoutSplitter} from '../../model/container-pane.model';
import { PlaceholderContainerComponent } from '../placeholder-container/placeholder-container.component';

/**
 * Host component that shows a layout with containers, the content of one module tab.
 */
@Component({
	selector: 'ui-container-system-layout-host',
	templateUrl: './layout-host.component.html',
	styleUrls: ['./layout-host.component.scss'],
})
export class UiContainerSystemLayoutHostComponent implements OnInit {
	/**
	 * Container definitions
	 */
	@Input()
	public containers: ContainerDefinition[] = [];

	private _containerLayout: IContainerLayout = {
		layoutId: 'layout6',
		groups: [{
			pane: 'pane-lt',
			content: ['189e0730c378fa76dfe872089a46730d', '189e0730c378fa76dfe872089a46730d', '189e0730c378fa76dfe872089a46730d'],
			activeTab: 1
		}],
		splitterDef: [
			{
				selectorName: 'horizontal',
				panes: [{collapsed: false, size: '65%'}, {collapsed: false, size: '34.42028985507247%'}]
			},
			{
				selectorName: 'verticalLeft',
				panes: [{collapsed: false, size: '58.39874411302983%'}, {collapsed: false, size: '40.34536891679749%'}]
			},
			{
				selectorName: 'verticalRight',
				panes: [{collapsed: false, size: '36.10675039246467%'}, {collapsed: false, size: '62.63736263736263%'}]
			}
		]
	};

	public get containerLayout() {
		return this._containerLayout;
	}

	/**
	 * Current layout config
	 */
	@Input()
	public set containerLayout(value: IContainerLayout) {
		this._containerLayout = value;
		this.refreshPaneLayout();
	}

	/**
	 * Layout changed event
	 */
	@Output()
	public layoutChanged = new EventEmitter<IContainerLayout>();

	/**
	 * Current pane layout
	 */
	public paneLayout!: IPaneLayout;

	/**
	 * Used to inject layout service.
	 */
	public layoutService = inject(ModuleLayoutService);

	/**
	 * Component initializing
	 */
	public ngOnInit() {
		if (!this.paneLayout) {
			this.refreshPaneLayout();
		}
	}

	/**
	 * Refresh layout, could be called outside to refresh layout manually when some properties changed in container layout object.
	 */
	public refreshPaneLayout() {
		const layout = paneLayouts[this.containerLayout.layoutId];
		this.paneLayout = cloneDeep(layout);
		this.fillPaneDetail(this.paneLayout.panes, this.paneLayout.selectorName);
	}

	private fillPaneDetail(panes: IPaneDefinition[], selectorName?: string) {
		panes.forEach((p, pi) => {
			this.resolvePaneContainers(p, this.paneLayout.layout, p.name);
			this.resolvePaneSize(p, this.paneLayout.layout, p.name, pi, selectorName);

			if (p.panes) {
				this.fillPaneDetail(p.panes, p.selectorName);
			}
		});
	}

	/**
	 * Resolve pane containers.
	 * @param pane
	 * @param layoutId
	 * @param paneId
	 */
	private resolvePaneContainers(pane: IPaneDefinition, layoutId: string, paneId: string) {
		if (this.containerLayout.layoutId !== layoutId) {
			return;
		}

		const filterGroups = this.containerLayout.groups.filter(e => e.pane === paneId);

		if (!filterGroups.length) {
			return;
		}
		if (filterGroups.length > 1) {
			throw new Error(`${layoutId}:${paneId}: Panel containers are duplicated!`);
		}

		const group = filterGroups[0];

		pane.activeTab = group.activeTab;
		pane.containers = group.content.map(g => {
			const containers = this.containers.filter(c => c.id === g || c.uuid.toLowerCase() === g.toLowerCase());

			if (!containers.length) {
				return new ContainerDefinition({
					uuid: g.toLowerCase(),
					containerType: PlaceholderContainerComponent,
					title: {
						key: 'ui.container-system.missingCntTitle',
						params: {
							cntUuid: g.toLowerCase()
						}
					}
				});
			}
			if (containers.length > 1) {
				throw new Error(`Container ${g} is defined repeatedly!`);
			}

			return containers[0];
		});
	}

	/**
	 * Resolve pane size
	 * @param pane
	 * @param layoutId
	 * @param paneId
	 * @param paneIndex
	 * @param selector
	 */
	private resolvePaneSize(pane: IPaneDefinition, layoutId: string, paneId: string, paneIndex: number, selector?: string) {
		if (this.containerLayout.layoutId !== layoutId) {
			return;
		}

		const splitters = this.containerLayout.splitterDef.filter(e => e.selectorName === selector);

		if (!splitters.length) {
			return;
		}

		const splitter = splitters[0];

		if (splitter.panes.length <= paneIndex) {
			return;
		}

		const paneDef = splitter.panes[paneIndex];
		const sizeDef = paneDef.size;

		pane.collapsed = paneDef.collapsed;
		pane.size = Number(sizeDef.substring(0, sizeDef.length - 1));
	}

	/**
	 * Handle sub layout changed.
	 * @param e
	 */
	public handleLayoutChange(e: ILayoutSplitter) {
		const layout = this.updateSplitterDef(e);
		this.layoutChanged.emit(layout);
	}

	private updateSplitterDef(splitter: ILayoutSplitter): IContainerLayout {
		const index = this.containerLayout.splitterDef.findIndex(s => s.selectorName === splitter.selectorName);

		const item = {
			selectorName: splitter.selectorName!,
			panes: splitter.panes!.map(p => {
				return {
					collapsed: p.collapsed || false,
					size: `${p.size}%`
				};
			})
		};

		if (index !== -1) {
			this.containerLayout.splitterDef.splice(index, 1, item);
		} else {
			this.containerLayout.splitterDef.push(item);
		}

		return this.containerLayout;
	}

	/**
	 * Handle active tab changed.
	 * @param e
	 */
	public handleActiveTabChange(e: IPaneDefinition) {
		this.layoutService.paneActiveTab = e;
		const layout = this.updateActiveTab(e);
		this.layoutChanged.emit(layout);
	}

	private updateActiveTab(pane: IPaneDefinition) {
		const index = this.containerLayout.groups.findIndex(g => g.pane === pane.name);

		const item = {
			pane: pane.name,
			activeTab: pane.activeTab,
			content: pane.containers!.map(e => e.uuid)
		};

		if (index !== -1) {
			this.containerLayout.groups.splice(index, 1, item);
		} else {
			this.containerLayout.groups.push(item);
		}

		return this.containerLayout;
	}

	/**
	 * Initializes a variable to store the identifier of the previously active
	 * pane name.
	 */
	public previousActivePane: string = '';

	/**
	 * An object to hold layout data for panes, typed as IPaneLayout.
	 */

	public paneLayoutData = {} as IPaneLayout;

	/**
	 * Reference variable for component
	 */
	@ViewChild('layoutSplitter') public layoutSplitter!: UiContainerSystemLayoutSplitterComponent;

	/**
	 * Used to maximize and minimize specified container pane.
	 * @method handleContainerSize
	 * @param {string} panelName The panel name
	 */
	public handleContainerSize(panelName: string): void {
		if (this.previousActivePane === panelName) {
			this.previousActivePane = '';
			this.paneLayout = this.paneLayoutData;
		} else {
			this.previousActivePane = panelName;
			this.paneLayoutData = cloneDeep(this.paneLayout);
			this.maximizeContainer(panelName);
		}
		const activeTab: IPaneDefinition = this.layoutService.paneActiveTab;
		if (activeTab !== undefined && Object.keys(activeTab).length !== 0) {
			this.updateActiveTabData(activeTab);
		}

		this.layoutSplitter.data = this.paneLayout;
	}

	/**
	 * Used to get pane data for specified panel-name.
	 * @method maximizeContainer
	 * @param {string} panelName panel name
	 */
	public maximizeContainer(panelName: string): void {
		const paneArray: IPaneDefinition[] = [];
		this.paneLayout.panes.forEach((pane) => {
			if (pane.name === panelName) {
				paneArray.push(pane);
			} else {
				this.checkChildPane(pane, paneArray, panelName);
			}
		});
		this.updateContainerSize(paneArray);
	}

	/**
	 * Used to checked child pane for specified panel name to
	 * maximized pane-layout.
	 * @method checkChildPane
	 * @param {IPaneDefinition} pane pane definition
	 * @param {IPaneDefinition[]} paneArray array of pane definition
	 * @param {string} panelName  panel name
	 */
	public checkChildPane(pane: IPaneDefinition, paneArray: IPaneDefinition[], panelName: string): void {
		pane.panes?.forEach((paneL) => {
			if (paneL.name === panelName) {
				paneArray?.push(paneL);
			} else {
				this.checkChildPane(paneL, paneArray, panelName);
			}
		});
	}

	/**
	 *  Maximizes the specified panel within the pane layout
	 * @method updateContainerSize
	 * @param {IPaneDefinition[]} paneArray array of pane definition.
	 */
	public updateContainerSize(paneArray: IPaneDefinition[]): void {
		if (paneArray.length !== 0) {
			this.paneLayout.panes = paneArray;
		}
	}

	/**
	 *  Used to update active tab data if change after maximize container
	 *
	 * @method updateActiveTabData
	 */
	public updateActiveTabData(activeTab: IPaneDefinition) {

		this.paneLayout.panes.forEach((pane) => {
			if (pane.name === activeTab.name) {
				pane.activeTab = activeTab.activeTab;
			} else {
				this.updateChildActiveTab(pane, activeTab);
			}
		});
		this.layoutService.paneActiveTab = {} as IPaneDefinition;
	}


	/**
	 *  Used to update active tab data of child panes
	 *  if change after maximize container
	 *
	 * @method updateChildActiveTab
	 * @param {IPaneDefinition} paneList pane definition
	 * @param {IPaneDefinition} activeTab pane definition of active tab
	 */
	public updateChildActiveTab(paneList: IPaneDefinition, activeTab: IPaneDefinition) {
		paneList.panes?.forEach((pane) => {
			if (pane.name === activeTab.name) {
				pane.activeTab = activeTab.activeTab;
			} else {
				this.updateChildActiveTab(pane, activeTab);
			}
		});
	}
}