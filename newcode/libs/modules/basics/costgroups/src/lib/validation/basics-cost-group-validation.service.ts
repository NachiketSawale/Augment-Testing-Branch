/*
 * Copyright(c) RIB Software GmbH
 */
import {
	BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import {inject, Injectable} from '@angular/core';
import {ICostGroupEntity} from '../model/entities/cost-group-entity.interface';
import {BasicsCostGroupDataService} from '../services/basics-cost-group-data.service';
import {PlatformConfigurationService, PlatformTranslateService} from '@libs/platform/common';
import {HttpClient} from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})

export class BasicsCostGroupValidationService extends BaseValidationService<ICostGroupEntity> {
	private dataService = inject(BasicsCostGroupDataService);
	protected translateService = inject(PlatformTranslateService);

	protected http = inject(HttpClient);
	protected configurationService = inject(PlatformConfigurationService);

	public getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICostGroupEntity> {
		return this.dataService;
	}

	protected generateValidationFunctions(): IValidationFunctions<ICostGroupEntity> {
		return {
			Code: this.asyncValidateCode,
			IsLive: this.validateIsLive,
			Quantity: this.validateQuantity,
			UomFk: this.validateUomFk
		};
	}

	private asyncValidateCode(info: ValidationInfo<ICostGroupEntity>): Promise<ValidationResult> {

		return new Promise((resolve) => {
			const entity = info.entity;

			let result = this.validateIsMandatory(info);
			if (!result.valid) {
				resolve(result);
			} else {
				result = this.validateIsUnique(info);
				if (!result.valid) {
					resolve(result);
				} else {
					this.http.post(this.configurationService.webApiBaseUrl + 'basics/CostGroups/costgroup/isunique', entity)
						.subscribe(response => {
							const isUnique = response as boolean;
							if (isUnique) {
								entity.Code = info.value as string;
								resolve({apply: true, valid: true});
							} else {
								resolve({
									apply: false,
									valid: false,
									error: this.translateService.instant('basics.costgroups.uniqCode').text
								});
							}
						});
				}
			}
		});
	}

	protected validateIsLive(info: ValidationInfo<ICostGroupEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}

	protected validateQuantity(info: ValidationInfo<ICostGroupEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}

	protected validateUomFk(info: ValidationInfo<ICostGroupEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}

	protected override getLoadedEntitiesForUniqueComparison = (info: ValidationInfo<ICostGroupEntity>): ICostGroupEntity[] => {
		const itemList = this.dataService.getList();
		const res = itemList.filter(item => {
			return (item as never)[info.field] === info.value && item.Id !== info.entity.Id;
		});

		return res;
	};
}