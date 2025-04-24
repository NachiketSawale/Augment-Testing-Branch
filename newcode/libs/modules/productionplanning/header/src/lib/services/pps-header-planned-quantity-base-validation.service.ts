/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IPpsPlannedQuantityEntity } from '@libs/productionplanning/formulaconfiguration';
import { PpsHeaderPlannedQuantityBaseDataService } from './pps-header-planned-quantity-base-data-service';
import { PpsPlannedQuantityTypes } from '../model/constants/pps-planned-quantity-types';

@Injectable({
	providedIn: 'root'
})
export class PpsHeaderPlannedQuantityBaseValidationService extends BaseValidationService<IPpsPlannedQuantityEntity> {

	public constructor(protected dataService: PpsHeaderPlannedQuantityBaseDataService) {
		super();
		this.dataService = dataService;
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPpsPlannedQuantityEntity> {
		return this.dataService;
	}

	protected generateValidationFunctions(): IValidationFunctions<IPpsPlannedQuantityEntity> {
		return {
			BasUomFk: this.validateBasUomFk,
			PropertyMaterialCostcodeFk: this.validatePropertyMaterialCostcodeFk,
		};
	}

	private validateBasUomFk(info: ValidationInfo<IPpsPlannedQuantityEntity>): ValidationResult {
		const entity = info.entity;
		if (entity.PpsPlannedQuantityTypeFk !== PpsPlannedQuantityTypes.Material &&
			entity.PpsPlannedQuantityTypeFk !== PpsPlannedQuantityTypes.CostCode) {
			return new ValidationResult();
		}
		return this.validateIsMandatory(info);
	}

	private validatePropertyMaterialCostcodeFk(info: ValidationInfo<IPpsPlannedQuantityEntity>): ValidationResult {
		const entity = info.entity;
		if (entity.PpsPlannedQuantityTypeFk === PpsPlannedQuantityTypes.Userdefined ||
			entity.PpsPlannedQuantityTypeFk === PpsPlannedQuantityTypes.Accounting) {
			return new ValidationResult();
		}
		return this.validateIsMandatory(info);
	}

}