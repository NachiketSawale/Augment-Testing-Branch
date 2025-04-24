/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { ISearchPayload } from '@libs/platform/common';
import { IEstimateAssembliesRuleEntity } from '../../model/entities/estimate-assemblies-rule-entity.interface';
import { EstimateAssembliesRuleDataService } from './estimate-assemblies-rule-data.service';
export const ESTIMATE_ASSEMBLIES_RULE_BEHAVIOR_TOKEN = new InjectionToken<EstimateAssembliesRuleBehavior>('estimateAssembliesRuleBehavior');

@Injectable({
	providedIn: 'root'
})
export class EstimateAssembliesRuleBehavior implements IEntityContainerBehavior<IGridContainerLink<IEstimateAssembliesRuleEntity>, IEstimateAssembliesRuleEntity> {

	private dataService: EstimateAssembliesRuleDataService;
	
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
		useCurrentClient: true
	};

	public constructor() {
		this.dataService = inject(EstimateAssembliesRuleDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IEstimateAssembliesRuleEntity>): void {
		const dataSub = this.dataService.listChanged$.subscribe(data => {
			containerLink.gridData = data;
		});
		containerLink.registerSubscription(dataSub);
		this.customizeToolbar(containerLink);
		this.dataService.refreshAll();
		this.dataService.setIsForEstimate(true);
	}

	private customizeToolbar(containerLink: IGridContainerLink<IEstimateAssembliesRuleEntity>) {
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete', 'createChild']);
	}

}