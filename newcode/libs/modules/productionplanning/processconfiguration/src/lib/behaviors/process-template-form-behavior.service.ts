/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {IEntityContainerBehavior, IEntityContainerLink} from '@libs/ui/business-base';
import {ProcessTemplateEntity} from '../model/process-template-entity.class';
import {ProductionplanningProcessconfigurationProcessTemplateDataService} from '../services/productionplanning-processconfiguration-process-template-data.service';

@Injectable({
	providedIn: 'root'
})
export class ProductionplanningProcessconfigurationProcessTemplateFormBehavior implements IEntityContainerBehavior<IEntityContainerLink<ProcessTemplateEntity>, ProcessTemplateEntity> {
	private dataService: ProductionplanningProcessconfigurationProcessTemplateDataService;
	public constructor() {
		this.dataService = inject(ProductionplanningProcessconfigurationProcessTemplateDataService);
	}

	public onCreate() {
	}
}