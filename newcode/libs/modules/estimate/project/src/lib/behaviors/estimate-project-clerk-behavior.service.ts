/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IEntityContainerBehavior, IFormContainerLink} from '@libs/ui/business-base';

import { EstimateProjectClerkDataService } from '../services/estimate-project-clerk-data.service';
import { ItemType } from '@libs/ui/common';
import { IEstimateProjectHeader2ClerkEntity } from '../model/entities/estimate-project-header-2clerk-entity.interface';
export const ESTIMATE_PROJECT_CLERK_BEHAVIOR_TOKEN = new InjectionToken<EstimateProjectClerkBehavior>('estimateProjectClerkBehavior');

@Injectable({
	providedIn: 'root',
})

/**
 * @brief Service to handle the behavior of the Estimate Project Clerk.
 */
export class EstimateProjectClerkBehavior implements IEntityContainerBehavior<IFormContainerLink<IEstimateProjectHeader2ClerkEntity>, IEstimateProjectHeader2ClerkEntity> {
	private dataService: EstimateProjectClerkDataService;
	
	public constructor() {
		this.dataService = inject(EstimateProjectClerkDataService);
	}

	/**
	 * @brief Method to handle the creation of the container link.
	 * @param containerLink The container link to be created.
	 */
	public onCreate(containerLink: IFormContainerLink<IEstimateProjectHeader2ClerkEntity>): void {
		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: 'First',
				hideItem: false,
				iconClass: ' tlb-icons ico-rec-first',
				id: 'first',
				fn: () => {
					this.dataService.selectFirst().then();
				},
				sort: 101,
				type: ItemType.Item
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
				type: ItemType.Item
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
				type: ItemType.Item
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
				type: ItemType.Item
			},
		]);
	}

}
