/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {ProcessTemplateEntity} from '../model/process-template-entity.class';
import {ProductionplanningProcessconfigurationProcessTemplateDataService} from '../services/productionplanning-processconfiguration-process-template-data.service';
import {ISearchPayload} from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class ProductionplanningProcessconfigurationProcessTemplateGridBehavior implements IEntityContainerBehavior<IGridContainerLink<ProcessTemplateEntity>, ProcessTemplateEntity> {
	private dataService: ProductionplanningProcessconfigurationProcessTemplateDataService;

	private searchPayload: ISearchPayload = {
		executionHints: false,
		filter: '',
		includeNonActiveItems: false,
		isReadingDueToRefresh: false,
		pageNumber: 0,
		pageSize: 100,
		pattern: 'cctest',
		pinningContext: [],
		projectContextId: null,
		useCurrentClient: true
	};

	public constructor() {
		this.dataService = inject(ProductionplanningProcessconfigurationProcessTemplateDataService);
	}

	public onCreate(containerLink: IGridContainerLink<ProcessTemplateEntity>) {

	}
}