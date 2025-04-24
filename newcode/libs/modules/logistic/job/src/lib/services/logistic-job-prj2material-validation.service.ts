/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { IProject2MaterialEntity } from '@libs/logistic/interfaces';
import { LogisticJobPrj2MaterialDataService } from './logistic-job-prj2-material-data.service';

/**
 * Logistic project 2 material validation service
 */

@Injectable({
	providedIn: 'root'
})
export class LogisticJobPrj2materialValidationService extends BaseValidationService<IProject2MaterialEntity> {


	private dataService = inject(LogisticJobPrj2MaterialDataService);
	public constructor() {
		super();
	}
	protected generateValidationFunctions(): IValidationFunctions<IProject2MaterialEntity> {
		return {
			ProjectFk:this.validateProjectFk,
			MaterialFk:this.validateMaterialFk,
			MaterialGroupFk:this.validateMaterialGroupFk,
			UomFk:this.validateUomFk,
			RetailPrice:this.validateIsMandatory,
			ListPrice:this.validateIsMandatory,
			Discount:this.validateIsMandatory,
			Charges:this.validateIsMandatory,
			Cost:this.validateIsMandatory,
			PriceExtra:this.validateIsMandatory,
			EstimatePrice:this.validateIsMandatory,
			PriceUnit:this.validateIsMandatory,
			FactorHour:this.validateIsMandatory,
		};
	}

protected validateMaterialGroupFk(info: ValidationInfo<IProject2MaterialEntity>): ValidationResult{
		if(info.entity !==null){
			//TODo: 	platformRuntimeDataService.readonly(entity, [{
			// 					field: 'MaterialFk',
			// 					readonly: false
			// 				}]);
			// 				dataService.gridRefresh();
		}
	return this.validateIsMandatory(info);
}
	protected validateMaterialFk(info: ValidationInfo<IProject2MaterialEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}
	protected validateProjectFk(info: ValidationInfo<IProject2MaterialEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}
	protected validateUomFk(info: ValidationInfo<IProject2MaterialEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IProject2MaterialEntity> {
		return this.dataService;
	}


}