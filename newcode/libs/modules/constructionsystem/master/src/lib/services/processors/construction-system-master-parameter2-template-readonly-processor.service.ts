/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ICosParameter2TemplateEntity } from '../../model/entities/cos-parameter-2-template-entity.interface';
import { ConstructionSystemMasterParameter2TemplateGridDataService } from '../construction-system-master-parameter2-template-grid-data.service';
import { ConstructionSystemMasterParameterReadonlyProcessorBaseService } from './construction-system-master-parameter-readonly-processor-base.service';

/**
 * Construction System Master Parameter readonly processor
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterParameter2TemplateReadonlyProcessorService extends ConstructionSystemMasterParameterReadonlyProcessorBaseService<ICosParameter2TemplateEntity> {
	/**
	 *The constructor
	 */
	public constructor(protected dataService: ConstructionSystemMasterParameter2TemplateGridDataService) {
		super(dataService);
	}
}
