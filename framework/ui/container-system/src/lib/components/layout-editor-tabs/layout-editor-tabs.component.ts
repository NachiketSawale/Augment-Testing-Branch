/*
 * Copyright(c) RIB Software GmbH
 */
import {find} from 'lodash';
import {Component, Input, OnInit} from '@angular/core';
import {Translatable} from '@libs/platform/common';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import {ContainerDefinition} from '../../model/container-definition.class';
import {
	UiContainerSystemLayoutEditorContext,
	UiContainerSystemLayoutEditorTabContainer
} from '../../model/layout-editor-context';
import {ILayoutTabContainer, IPaneDefinition} from '../../model/container-pane.model';


/**
 * The container tab editor.
 */
@Component({
	selector: 'ui-container-system-layout-editor-tabs',
	templateUrl: './layout-editor-tabs.component.html',
	styleUrls: ['./layout-editor-tabs.component.scss'],
})
export class UiContainerSystemLayoutEditorTabsComponent implements OnInit {

	/**
	 * Layout editor context.
	 */
	@Input()
	public context!: UiContainerSystemLayoutEditorContext;

	/**
	 * Current pane
	 */
	@Input()
	public pane!: IPaneDefinition;

	/**
	 * Active panes
	 */
	public get activePanes(): string[] {
		return this.context.activePanes.map(p => p.name);
	}

	/**
	 * Tab container title
	 */
	public get title() {
		let value: Translatable = 'platform.layoutsystem.tabbedContainer';

		if (this.pane.tabContainers) {
			const validTabContainers = this.pane.tabContainers.filter(e => e.uuid);

			if (validTabContainers.length === 1) {
				const container = find(this.containers, e => e.uuid === validTabContainers[0].uuid);

				if (container) {
					value = container.title;
				}
			}
		}

		return value;
	}

	/**
	 * Available containers
	 */
	public get containers(): ContainerDefinition[] {
		if (!this.context) {
			return [];
		}

		return this.context.containers;
	}

	/**
	 * Containers filter, used container can not be selected again.
	 */
	public get containerFilter(): (e: ContainerDefinition) => boolean {
		if (this.context) {
			return e => this.context.usedContainers.map(e => e.uuid).indexOf(e.uuid) === -1;
		}

		return e => true;
	}

	/**
	 *
	 */
	public ngOnInit() {
		if (this.context.tabContainers.some(e => e.paneNo === this.pane.no)) {
			this.pane.tabContainers = this.context.tabContainers.filter(e => e.paneNo === this.pane.no).sort((a, b) => a.order - b.order);
		} else {
			this.pane.tabContainers = [];

			const group = find(this.context.layout.groups, e => e.pane === this.pane.name);

			if (group) {
				group.content.forEach(e => {
					const container = find(this.containers, c => c.id === e || c.uuid.toLowerCase() === e.toLowerCase());

					if (container) {
						const c = this.context.getTabContainer(container.uuid, this.pane.no);
						this.pane.tabContainers!.push(c);
					}
				});
			}

			const placeholder = this.context.getTabContainerPlaceholder(this.pane.no);
			this.pane.tabContainers!.push(placeholder);
		}

		this.sort(this.pane.tabContainers);
	}

	/**
	 * Change tab container.
	 * @param item
	 */
	public changeTabContainer(item: ILayoutTabContainer) {
		if (item.uuid) {
			if (item.placeHolder) {
				this.context.removeTabContainerByUuid(item.uuid);
				item.placeHolder = false;
				const placeholder = this.context.getTabContainerPlaceholder(this.pane.no);
				this.pane.tabContainers!.push(placeholder);
			}
		} else {
			item.paneNo = undefined;
			this.context.removeTabContainer(item as UiContainerSystemLayoutEditorTabContainer);
			this.pane.tabContainers = this.pane.tabContainers!.filter(e => e !== item);
		}

		this.sort(this.pane.tabContainers!);
	}

	/**
	 * Drop tab container.
	 * @param event
	 */
	public drop(event: CdkDragDrop<ILayoutTabContainer[]>) {
		if (event.previousContainer === event.container) {
			if (event.currentIndex === this.pane.tabContainers!.length - 1) {
				event.currentIndex--;
			}

			moveItemInArray(this.pane.tabContainers!, event.previousIndex, event.currentIndex);
			this.sort(this.pane.tabContainers!);
		} else {
			const fromPane = find(this.context.activePanes, p => p.name === event.previousContainer.id);
			const toPane = find(this.context.activePanes, p => p.name === event.container.id);
			const fromList = fromPane!.tabContainers!;
			const toList = toPane!.tabContainers!;

			if (event.currentIndex === this.pane.tabContainers!.length) {
				event.currentIndex--;
			}

			transferArrayItem(
				fromList,
				toList,
				event.previousIndex,
				event.currentIndex,
			);

			toList[event.currentIndex].paneNo = toPane!.no;
			this.sort(fromList);
			this.sort(toList);
		}
	}

	private sort(tabContainers: ILayoutTabContainer[]) {
		tabContainers.forEach((e, index) => {
			e.order = index;
		});
	}
}