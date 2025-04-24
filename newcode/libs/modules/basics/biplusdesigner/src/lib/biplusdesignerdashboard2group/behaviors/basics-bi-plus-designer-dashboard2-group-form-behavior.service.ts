/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { ItemType } from '@libs/ui/common';
import { IEntityContainerBehavior, IFormContainerLink } from '@libs/ui/business-base';
import { IDashboard2GroupEntity } from '../model/entities/dashboard-2group-entity.interface';
import { BasicsBiPlusDesignerDashboard2GroupDataService } from '../services/basics-bi-plus-designer-dashboard2-group-data.service';

/**
 * Basicsbiplusdesigner Dashboard to Group Form Behavior Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsBiPlusDesignerDashboard2GroupFormBehavior implements IEntityContainerBehavior<IFormContainerLink<IDashboard2GroupEntity>, IDashboard2GroupEntity> {
	private dataService: BasicsBiPlusDesignerDashboard2GroupDataService;

	public constructor() {
		this.dataService = inject(BasicsBiPlusDesignerDashboard2GroupDataService);
	}
	
	/**
	 * Add custom toolbar items for respective container.
	 * @param formContainerLink {IFormContainerLink}
	 */
	public onCreate(formContainerLink: IFormContainerLink<IDashboard2GroupEntity>): void {
        formContainerLink.uiAddOns.toolbar.addItems([
			{
				caption: 'First',
				hideItem: false,
				iconClass: ' tlb-icons ico-rec-first',
				id: 'first',
				fn: () => {
					this.dataService.selectFirst().then();
				},
				sort: 101,
				type: ItemType.Item,
			},
			{
				caption: 'Previous',
				hideItem: false,
				iconClass: ' tlb-icons ico-rec-previous',
				id: 'previous',
				fn: () => {
					this.dataService.selectPrevious().then();
				},
				sort: 102,
				type: ItemType.Item,
			},
			{
				caption: 'Next',
				hideItem: false,
				iconClass: ' tlb-icons ico-rec-next',
				id: 'next',
				fn: () => {
					this.dataService.selectNext().then();
				},
				sort: 103,
				type: ItemType.Item,
			},
			{
				caption: 'Last',
				hideItem: false,
				iconClass: ' tlb-icons ico-rec-last',
				id: 'last',
				fn: () => {
					this.dataService.selectLast().then();
				},
				sort: 104,
				type: ItemType.Item,
			}
		]);
    }
}