/*
 * Copyright(c) RIB Software GmbH
 */
import { sumBy } from 'lodash';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SplitComponent } from '@libs/ui/external';

import { ILayoutSplitter, IPaneDefinition } from '../../model/container-pane.model';
import { IResizeOptions } from '@libs/ui/common';
import { ContainerResizeObserver } from '../../model/layout/container-resize-observer.class';

/**
 * Layout splitter wrapper, self referenced.
 */
@Component({
	selector: 'ui-container-system-layout-splitter',
	templateUrl: './layout-splitter.component.html',
	styleUrls: ['./layout-splitter.component.scss'],
})
export class UiContainerSystemLayoutSplitterComponent {
	private _data!: ILayoutSplitter;
	private _observeSizeOptions: IResizeOptions[] = [];

	/**
	 * Observe size options.
	 */
	public get observeSizeOptions(): IResizeOptions[] {
		return this._observeSizeOptions;
	}

	/**
	 * Get data model.
	 */
	public get data(): ILayoutSplitter {
		return this._data;
	}

	/**
	 * The data model
	 * @param layout Layout splitter info.
	 */
	@Input()
	public set data(layout: ILayoutSplitter) {
		this._data = layout;
		if (this._data.panes) {
			this.checkPaneSize(this._data.panes);
			this._observeSizeOptions = this._data.panes.map(() => {
				return {
					handler: new ContainerResizeObserver()
				};
			});
		}
	}

	/**
	 * Layout changed event
	 */
	@Output()
	public layoutChanged = new EventEmitter<ILayoutSplitter>();

	/**
	 * Active tab changed event
	 */
	@Output()
	public activeTabChanged = new EventEmitter<IPaneDefinition>();

	/**
	 * splitter doesn't work as expect if total percentage is not equal 100.
	 * @param panes
	 * @private
	 */
	private checkPaneSize(panes: IPaneDefinition[]) {
		panes.forEach(e => {
			if (e.collapsed) {
				e.sizeBeforeCollapse = e.size;
				e.size = 0;
			}
		});

		const total = sumBy(panes, e => e.size || 0);

		if (total === 0) {
			return;
		}

		const paneToFit = panes.filter(e => e.size)[0];

		paneToFit.size = paneToFit.size || 0;
		paneToFit.size += (100 - total);
	}

	/**
	 * Pane tracker.
	 * @param index
	 * @param pane
	 */
	public trackByPane(index: number, pane: IPaneDefinition) {
		return pane.name;
	}

	/**
	 * Handle splitter changed.
	 * @param splitter
	 * @param selector
	 */
	public handleLayoutChange(splitter: SplitComponent, selector?: string) {
		const sizes = splitter.getVisibleAreaSizes();

		this.data.panes?.forEach((e, index) => {
			const size = sizes[index] as number;

			if (size === 0) {
				e.collapsed = true;
			} else {
				e.size = size;
			}
		});

		this.layoutChanged.emit(this.data);
	}

	/**
	 * Handle sub layout changed.
	 * @param e
	 */
	public handleSubLayoutChange(e: ILayoutSplitter) {
		this.layoutChanged.emit(e);
	}

	/**
	 * Convert size value
	 * @param size
	 */
	public toSplitterSize(size?: number | null) {
		if (size === undefined) {
			return null;
		}

		return size;
	}

	/**
	 * Get the size observer.
	 * @param i
	 */
	public toResizeMessenger(i: number) {
		return this.observeSizeOptions[i].handler as ContainerResizeObserver;
	}

	/**
	 * Handle active container change
	 * @param pane
	 * @param index
	 */
	public handleActiveTabChange(pane: IPaneDefinition, index: number) {
		pane.activeTab = index;
		this.activeTabChanged.emit(pane);
	}

	/**
	 * Handle sub active tab changed.
	 * @param e
	 */
	public handleSubActiveTabChange(e: IPaneDefinition) {
		this.activeTabChanged.emit(e);
	}

	/**
	 * panel size changed event
	 */
	@Output()
	public panelSizeChanged = new EventEmitter<string>();

	/**
	 * Emits an event to handle resizing of a panel
	 * @method handleFullSizePanel
	 * @param panelName the panel to resize
	 */
	public handleFullSizePanel(panelName: string): void {
		this.panelSizeChanged.emit(panelName);
	}
}