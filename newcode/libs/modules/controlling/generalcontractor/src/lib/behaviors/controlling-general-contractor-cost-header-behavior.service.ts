/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import {IGccCostControlDataEntity} from '../model/entities/gcc-cost-control-data-entity.interface';

export const CONTROLLING_GENERAL_CONTRACTOR_COST_HEADER_BEHAVIOR_TOKEN = new InjectionToken<ControllingGeneralContractorCostHeaderBehavior>('controllingGeneralContractorCostHeaderBehavior');

@Injectable({
	providedIn: 'root'
})
export class ControllingGeneralContractorCostHeaderBehavior implements IEntityContainerBehavior<IGridContainerLink<IGccCostControlDataEntity>, IGccCostControlDataEntity> {

	public onCreate(containerLink: IGridContainerLink<IGccCostControlDataEntity>): void {
		this.customizeToolbar(containerLink);
	}

	private customizeToolbar(containerLink: IGridContainerLink<IGccCostControlDataEntity>) {
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
	}
}