import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IProjectMaterialPortionEntity } from '../model/entities/prj-material-portion-entity.interface';
import { ProjectMaterialPortionDataService } from './project-material-portion-data.service';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { lastValueFrom } from 'rxjs';
import { MainDataDto } from '@libs/basics/shared';
import { IMaterialPriceConditionEntity } from '@libs/basics/interfaces';
import { sumBy } from 'lodash';

@Injectable({
	providedIn: 'root',
})
export class ProjectMaterialPortionValidationService extends BaseValidationService<IProjectMaterialPortionEntity> {

	private http = inject(HttpClient);
	private config = inject(PlatformConfigurationService);

	public constructor(private dataService: ProjectMaterialPortionDataService) {
		super();
	}

	protected override generateValidationFunctions(): IValidationFunctions<IProjectMaterialPortionEntity> {
		return {
			PriceConditionFk: this.asyncValidationPriceConditionFk,
			CostCode: [this.validateCostCode],
		};
	}

	public getEntityRuntimeData(): IEntityRuntimeDataRegistry<IProjectMaterialPortionEntity> {
		return this.dataService;
	}

	private async asyncValidationPriceConditionFk(info: ValidationInfo<IProjectMaterialPortionEntity>): Promise<ValidationResult> {
		const url = this.config.webApiBaseUrl + 'project/material/pricecondition/reload';
		const selectedMaterial = this.dataService.getMaterialEntity();

		if (info.value) {
			const param = {
				PrcPriceConditionId: info.value,
				MainItem: selectedMaterial,
				ExchangeRate: 1,
				IsFromMaterial: false,
				IsCopyFromPrcItem: false,
				MaterialPriceListId: null,
				HeaderId: selectedMaterial?.ProjectFk,
				HeaderName: 'PrjMatPrcConditions',
				ProjectFk: selectedMaterial?.ProjectFk,
				IsCopyFromBoqDivision: false,
				BasicPrcItemId: null,
			};
			const response = await lastValueFrom(this.http.post(url, param));
			const result = new MainDataDto(response);
			const priceConditions = result.getValueAs<IMaterialPriceConditionEntity[]>('PriceConditions');
			if (priceConditions) {
				info.entity.PriceExtra = sumBy(priceConditions, (item) => {
					return item.PriceConditionType && item.PriceConditionType.IsPriceComponent && item.IsActivated ? item.Total : 0;
				});
			}
		}
		return Promise.resolve({ valid: true, apply: true });
	}

	private validateCostCode(info: ValidationInfo<IProjectMaterialPortionEntity>): ValidationResult {
		if (!info.value) {
			info.entity.MdcCostCodeFK = null;
			info.entity.IsRefereToProjectCostCode = false;
			info.entity.Project2MdcCostCodeFk = null;
		}
		return new ValidationResult();
	}
}
