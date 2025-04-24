/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IEstActivities } from '../../model/interfaces/estimate-main-activities.interface';

export const ESTIMATE_MAIN_ACTIVITY_BEHAVIOR_TOKEN = new InjectionToken<EstimateMainActivityBehavior>('estimateMainActivityBehavior');

@Injectable({
	providedIn: 'root'
})

/**
 * Behaviour Service for customizing tools
 */
export class EstimateMainActivityBehavior implements IEntityContainerBehavior<IGridContainerLink<IEstActivities>, IEstActivities> {
	public onCreate(containerLink: IGridContainerLink<IEstActivities>): void {
		this.customizeToolbar(containerLink);
	}

	private customizeToolbar(containerLink: IGridContainerLink<IEstActivities>) {
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete', 'createChild','grouping']);
	}
}