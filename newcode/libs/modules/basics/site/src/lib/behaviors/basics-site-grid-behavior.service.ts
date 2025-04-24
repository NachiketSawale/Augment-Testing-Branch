/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { BasicsSiteGridDataService } from '../services/basics-site-grid-data.service';
import { BasicsSiteGridEntity } from '../model/basics-site-grid-entity.class';
import { ISearchPayload } from '@libs/platform/common';
import { ItemType } from '@libs/ui/common';
export const BASICS_SITE_GRID_BEHAVIOR_TOKEN = new InjectionToken<BasicsSiteGridBehavior>('basicsSiteGridBehavior');

@Injectable({
	providedIn: 'root',
})
export class BasicsSiteGridBehavior implements IEntityContainerBehavior<IGridContainerLink<BasicsSiteGridEntity>, BasicsSiteGridEntity> {
	private dataService: BasicsSiteGridDataService;
	
	private disableButton: boolean = true;

	private searchPayload: ISearchPayload = {
		executionHints: false,
		filter: '',
		includeNonActiveItems: false,

		isReadingDueToRefresh: false,
		pageNumber: 0,
		pageSize: 100,
		pattern: '',
		pinningContext: [],
		projectContextId: null,
		useCurrentClient: true,
	};
	//private selectedAction!: BasicsSiteGridEntity | null;

	public constructor() {
		this.dataService = inject(BasicsSiteGridDataService);
	}

	public onCreate(containerLink: IGridContainerLink<BasicsSiteGridEntity>): void {
		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { text:'Cut' },
				hideItem: false,
				iconClass: ' tlb-icons ico-cut',
				id: 't14',
				fn: () => {
					throw new Error('This method is not implemented');
					//return this.dataService.cutAction(this.selectedAction as BasicsSiteGridEntity );
				},
				disabled: false,
				sort: 10,
				type: ItemType.Item,
				
			},
			{
				caption: { text:'Paste' },
				disabled: true,
				hideItem: false,
				iconClass: 'tlb-icons ico-paste',
				id: 't14',
				fn: () => {
					throw new Error('This method is not implemented');
					//To do
				},
				sort: 15,
				type: ItemType.Item,
			},
			{
			caption: { text: 'Pin Selected Item' },
			hideItem: false,
			iconClass: 'tlb-icons ico-set-prj-context',
			id: 't14',
			fn: () => {
				throw new Error('This method is not implemented');
			},
			sort: 20,
			type: ItemType.Item,
			},
			{
			caption: { key: 'cloud.common.bulkEditor.title' },
			hideItem: false,
			iconClass: 'type-icons ico-construction51',
			id: 't14',
			fn: () => {
				throw new Error('This method is not implemented');
			},
			sort: 25,
			type: ItemType.Item,
			},
		]);
		containerLink.uiAddOns.toolbar.deleteItems('grouping');
	
	}

}
