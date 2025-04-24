/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { BasicsSharedPriceConditionValidationService } from '@libs/basics/shared';
import { ProjectMaterialsPriceConditionDataService } from './project-materials-price-condition-data.service';
import { IPrjMaterialEntity, IProjectMaterialComplate } from '@libs/project/interfaces';
import { IMaterialPriceConditionEntity } from '@libs/basics/interfaces';

/**
 * project price condition validation service
 */
@Injectable({
	providedIn: 'root'
})
export class ProjectMaterialsPriceConditionValidationService
	extends BasicsSharedPriceConditionValidationService<IMaterialPriceConditionEntity,IPrjMaterialEntity, IProjectMaterialComplate> {

	protected constructor(dataService: ProjectMaterialsPriceConditionDataService) {
		super(dataService);
	}
}