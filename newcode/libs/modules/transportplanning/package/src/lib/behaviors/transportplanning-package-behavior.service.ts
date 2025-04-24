/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ITransportPackageEntityGenerated } from '../model/models';
import { ISearchPayload } from '@libs/platform/common';
import { TransportplanningPackageDataService } from '../services/transportplanning-package-data.service';

export const TRANSPORTPLANNING_PACKAGE_BEHAVIOR_TOKEN = new InjectionToken<TransportplanningPackageBehavior>('transportplanningPackageBehavior');

@Injectable({
	providedIn: 'root'
})

/*
 * Service to handle behaviors related to Transport Planning Package
 */
export class TransportplanningPackageBehavior implements IEntityContainerBehavior<IGridContainerLink<ITransportPackageEntityGenerated>, ITransportPackageEntityGenerated> {
	private dataService: TransportplanningPackageDataService;
	

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

	public constructor() {
		this.dataService = inject(TransportplanningPackageDataService);
	}

	/**
    *  Method to customize tool bar
    * @param containerLink      
    */
	public onCreate(containerLink: IGridContainerLink<ITransportPackageEntityGenerated>): void {

		containerLink.uiAddOns.toolbar.addItems([
		]);
	}


}