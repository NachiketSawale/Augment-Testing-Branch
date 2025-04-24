/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { BasicsCountryStateDataService } from '../services/basics-country-state-data.service';
import { BasicsCountryStateEntity } from '../model/basics-country-state-entity.class';
export const BASICS_COUNTRY_STATE_BEHAVIOR_TOKEN = new InjectionToken<BasicsCountryStateBehavior>('basicsCountryStateBehavior');

@Injectable({
	providedIn: 'root',
})
export class BasicsCountryStateBehavior implements IEntityContainerBehavior<IGridContainerLink<BasicsCountryStateEntity>, BasicsCountryStateEntity> {
	private dataService: BasicsCountryStateDataService;
	
	public constructor() {
		this.dataService = inject(BasicsCountryStateDataService);
	}

	public onCreate(containerLink: IGridContainerLink<BasicsCountryStateEntity>): void {
		const dataSub = this.dataService.listChanged$.subscribe((data) => {
			containerLink.gridData = data;
		});
		containerLink.registerSubscription(dataSub);
	}

}
