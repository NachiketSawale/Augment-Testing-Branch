/*
 * Copyright(c) RIB Software GmbH
 */

import { get } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { IScheduleEntity } from '@libs/scheduling/interfaces';
import { SchedulingScheduleLookup } from '@libs/scheduling/shared';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { ConstructionSystemSharedParameterTypeHelperService } from '@libs/constructionsystem/shared';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { ICosTestInputEntity } from '../../model/entities/cos-test-input-entity.interface';
import { ConstructionSystemMasterParameterValueLookupService } from '../lookup/construction-system-master-parameter-value-lookup.service';
import { ConstructionSystemMasterTestParameterInputDataService } from '../construction-system-master-test-parameter-input-data.service';
import { ConstructionSystemSharedProjectInstanceHeaderLookupService } from '@libs/constructionsystem/shared';

/**
 * Construction system master Test Input validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterTestInputValidationService extends BaseValidationService<ICosTestInputEntity> {
	private readonly dataService = inject(ConstructionSystemMasterTestParameterInputDataService);
	private readonly paramTypeHelperService = inject(ConstructionSystemSharedParameterTypeHelperService);
	private readonly paramValueLookup = inject(ConstructionSystemMasterParameterValueLookupService);
	private readonly scheduleLookupService = inject(SchedulingScheduleLookup<IScheduleEntity>);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly cosProjectInstanceHeaderLookupService = inject(ConstructionSystemSharedProjectInstanceHeaderLookupService);

	protected generateValidationFunctions(): IValidationFunctions<ICosTestInputEntity> {
		return {
			Value: this.validateValue,
			FormValue: this.validateFormValue,
			ProjectFk: this.validateProjectFk,
			ModelFk: this.validateModelFk,
			CosInsHeaderFk: this.validateCosInsHeaderFk,
			EstHeaderFk: this.validateEstHeaderFk,
			PsdScheduleFk: this.validatePsdScheduleFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICosTestInputEntity> {
		return this.dataService;
	}

	public async validateValue(info: ValidationInfo<ICosTestInputEntity>) {
		await this.validator(info);
		return new ValidationResult();
	}

	private async validateFormValue(info: ValidationInfo<ICosTestInputEntity>) {
		if (info.field) {
			const prop = info.field.slice(0, info.field.indexOf('.'));
			const parameter = get(info.entity, prop);
			if (parameter) {
				await this.validator(new ValidationInfo(parameter, info.value, 'Value'));
			}
		}
		return new ValidationResult();
	}

	private validateProjectFk(info: ValidationInfo<ICosTestInputEntity>) {
		info.entity.CosInsHeaderFk = null; // ICosTestInputEntity has no those properties.
		info.entity.ModelFk = null;
		info.entity.EstHeaderFk = null;
		info.entity.PsdScheduleFk = null;
		this.dataService.CosInsHeaderFkSelectionChanged.next(null);
		this.dataService.entitiesUpdated(info.entity);
		return this.validationUtils.createSuccessObject();
	}

	private validateModelFk(info: ValidationInfo<ICosTestInputEntity>) {
		info.entity.ModelFk = info.value as number;
		// const lookupDataCache = basicsLookupdataLookupDescriptorService.getData('modelProjectModelLookupDataService');  todo-allen: wait for modelProjectModelLookupDataService
		// if (!info.entity.ProjectFk && lookupDataCache) {
		// 	const modelProject = lookupDataCache[info.value];
		// 	info.entity.ProjectFk = modelProject ? modelProject.ProjectFk : null;
		// }
		// constructionSystemMasterTestDataService.gridRefresh(); todo-allen: wait for gridRefresh
		return this.validationUtils.createSuccessObject();
	}

	private async validateCosInsHeaderFk(info: ValidationInfo<ICosTestInputEntity>) {
		info.entity.CosInsHeaderFk = info.value as number;
		const cosInsHeaderProject = await firstValueFrom(this.cosProjectInstanceHeaderLookupService.getItemByKey({id: info.value as number}));
		if (!info.entity.ProjectFk) {
			info.entity.ProjectFk = cosInsHeaderProject?.ProjectFk ?? null;
		}
		info.entity.ModelFk = cosInsHeaderProject?.ModelFk ?? null;
		info.entity.EstHeaderFk = cosInsHeaderProject?.EstHeaderFk ?? null;
		info.entity.PsdScheduleFk = cosInsHeaderProject?.PsdScheduleFk ?? null;
		info.entity.BoqHeaderFk = cosInsHeaderProject?.BoqHeaderFk ?? null;

		this.dataService.CosInsHeaderFkSelectionChanged.next(null);
		// constructionSystemMasterTestDataService.gridRefresh(); todo-allen: wait for gridRefresh
		return this.validationUtils.createSuccessObject();
	}

	private validateEstHeaderFk(info: ValidationInfo<ICosTestInputEntity>) {
		// const lookupDataCache = basicsLookupdataLookupDescriptorService.getData('estimateMainHeaderLookupDataService'); todo-allen: wait for estimateMainHeaderLookupDataService
		// if (lookupDataCache) {
		// 	for (const item in lookupDataCache) {
		// 		if (Object.prototype.hasOwnProperty.call(lookupDataCache, item) && item === info.value.toString()) {
		// 			info.entity.ProjectFk = lookupDataCache[item].ProjectFk;
		// 			info.entity.ModelFk = lookupDataCache[item].ModelFk;
		// 			break;
		// 		}
		// 	}
		// }
		// constructionSystemMasterTestDataService.gridRefresh(); todo-allen: wait for gridRefresh
		return this.validationUtils.createSuccessObject();
	}

	private async validatePsdScheduleFk(info: ValidationInfo<ICosTestInputEntity>) { // todo-allen: The method doesn't seem to be called.
		const scheduleEntity = await firstValueFrom(this.scheduleLookupService.getItemByKey({ id: info.value as number }));
		if (scheduleEntity) {
			info.entity.ProjectFk = scheduleEntity.ProjectFk;
			// info.entity.ModelFk = tmp.ModelFk; // todo-allen: The schedule Entity does not have the ModelFk property. Not sure about the purpose of the code here.
		}

		// constructionSystemMasterTestDataService.gridRefresh(); todo-allen: wait for gridRefresh
		return this.validationUtils.createSuccessObject();
	}

	private async validator(info: ValidationInfo<ICosTestInputEntity>) {
		if (info && info.entity) {
			if (info.entity.IsLookup) {
				const parameterValueEntity = await firstValueFrom(this.paramValueLookup.getItemByKey({ id: info.value as number }));
				const paramValue = parameterValueEntity.ParameterValue;
				info.entity.InputValue = this.paramTypeHelperService.convertValue(info.entity.CosParameterTypeFk, paramValue);
			} else {
				info.entity.InputValue = info.value as string | number | boolean | Date | null | undefined;
			}
		}
		const parameters = this.dataService.getParameterList();
		this.dataService.validateScript(parameters);
	}
}
