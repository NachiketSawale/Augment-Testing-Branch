/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import {BasicsCostGroupCatalogDataService} from '../services/basics-cost-group-catalog-data.service';
import {BasicsCostGroupCatalogEntity} from '../model/entities/basics-cost-group-catalog-entity.class';

@Injectable({
	providedIn: 'root'
})


export class BasicsCostGroupCatalogValidationService extends BaseValidationService<BasicsCostGroupCatalogEntity> {

	private basicsCostGroupCatalogDataService: BasicsCostGroupCatalogDataService = inject(BasicsCostGroupCatalogDataService);

	protected generateValidationFunctions(): IValidationFunctions<BasicsCostGroupCatalogEntity> {
		return {
			Code: this.validateCode,
			IsLive: this.validateIsLive
		};
	}

	public getEntityRuntimeData(): IEntityRuntimeDataRegistry<BasicsCostGroupCatalogEntity> {
		return this.basicsCostGroupCatalogDataService;
	}

	protected validateCode(info: ValidationInfo<BasicsCostGroupCatalogEntity>): ValidationResult {
		return this.validateIsUniqueAndMandatory(info);
	}

	protected validateIsLive(info: ValidationInfo<BasicsCostGroupCatalogEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}

	private validateIsUniqueAndMandatory(info: ValidationInfo<BasicsCostGroupCatalogEntity>){
		const result = this.validateIsMandatory(info);
		if(!result.valid){
			return result;
		}

		return this.validateIsUnique(info);
	}

	protected override getLoadedEntitiesForUniqueComparison = (info: ValidationInfo<BasicsCostGroupCatalogEntity>): BasicsCostGroupCatalogEntity[] => {
		const itemList = this.basicsCostGroupCatalogDataService.getList();
		const res = itemList.filter(item => {
			return (item as never)[info.field] === info.value && item.Id !== info.entity.Id;
		});

		return res;
	};
}