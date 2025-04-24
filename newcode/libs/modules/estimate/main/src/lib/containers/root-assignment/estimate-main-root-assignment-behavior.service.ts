/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import {IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { IEstRootAssignmentData } from '@libs/estimate/interfaces';
import { EstimateMainRootAssignmentDataService } from './estimate-main-root-assignment-data.service';

/*
 * Define an InjectionToken for the behavior
 */
export const ESTIMATE_MAIN_ROOT_ASSIGNMENT_BEHAVIOR_TOKEN = new InjectionToken<EstimateMainRootAssignmentBehavior>('estimateProjectBehavior');

@Injectable({
	providedIn: 'root',
})

/*
 * Service to handle behaviors related to estimate assemblies
 */

// todo Not fully implemented ( methods implementation is remaining)
export class EstimateMainRootAssignmentBehavior implements IEntityContainerBehavior<IGridContainerLink<IEstRootAssignmentData>, IEstRootAssignmentData> {

	private dataService: EstimateMainRootAssignmentDataService;


	/*
	 * Constructor to inject DataService
	 */

	public constructor() {
		this.dataService = inject(EstimateMainRootAssignmentDataService);
	}

	/*
	 * Method called when a container is created
	 */

	public onCreate(containerLink: IGridContainerLink<IEstRootAssignmentData>): void {
		const dataSub = this.dataService.listChanged$.subscribe((data) => {
			containerLink.gridData = data;
		});

		this.customizeToolbar(containerLink);
		containerLink.registerSubscription(dataSub);
	}

	/*
	 * Method to customize toolbar items
	 */

	private customizeToolbar(containerLink: IGridContainerLink<IEstRootAssignmentData>) {
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete', 'createChild']);
		
	}

}
