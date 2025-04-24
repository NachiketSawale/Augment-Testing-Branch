/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable, InjectionToken } from '@angular/core';
import { BasicsSharedPriceConditionParamDataService, PriceConditionHeaderEnum } from '@libs/basics/shared';
import { IProjectComplete, IProjectEntity } from '@libs/project/interfaces';
import { ProjectMainDataService } from '@libs/project/shared';

export const PROJECT_PRICE_CONDITION_PARAM_DATA_TOKEN = new InjectionToken<ProjectMaterialsPriceConditionParamDataService>('ProjectMaterialsPriceConditionParamDataService');

@Injectable({
	providedIn: 'root',
})
export class ProjectMaterialsPriceConditionParamDataService extends BasicsSharedPriceConditionParamDataService<IProjectEntity, IProjectComplete> {
	/**
	 * The constructor
	 */
	public constructor(protected headerService: ProjectMainDataService) {
		super(headerService, PriceConditionHeaderEnum.Project);
	}
}
