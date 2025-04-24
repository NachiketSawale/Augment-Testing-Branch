/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { lastValueFrom, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { IResourceWorkOperationTypeEntity } from '@libs/resource/interfaces';
import { ResourceWotWorkOperationTypeDataService } from './resource-wot-work-operation-type-data.service';
import { ResourceWotWorkOperationTypeReadonlyProcessor } from './resource-wot-work-operation-readonly-processor.service';

@Injectable({
	providedIn: 'root'
})
export class ResourceWotWorkOperationTypeValidationService extends BaseValidationService<IResourceWorkOperationTypeEntity> {

	private http = inject(HttpClient);
	private config = inject(PlatformConfigurationService);
	private translateService = inject(PlatformTranslateService);
	private resourceWotWorkOperationTypeProcessor = inject(ResourceWotWorkOperationTypeReadonlyProcessor);
	private resourceWotWorkOperationTypeDataService = inject(ResourceWotWorkOperationTypeDataService);


	protected generateValidationFunctions(): IValidationFunctions<IResourceWorkOperationTypeEntity> {
		return {
			Code: this.validateCodeAsync,
			IsMinorEquipment: this.validateIsMinorEquipment,
		};
	}

	private async validateCodeAsync(info: ValidationInfo<IResourceWorkOperationTypeEntity>): Promise<ValidationResult>{
		const isUnique = {
			Id: info.entity.Id,
			Code: info.value,
			EquipmentContext: info.entity.EquipmentContextFk
		};
		const validationResult= new ValidationResult();

		const url = this.config.webApiBaseUrl + 'resource/wot/workoperationtype/isunique';
		return await lastValueFrom(this.http.post(url, isUnique).pipe(
			map((result) => {
			if(!result){
				validationResult.valid = false;
				validationResult.apply = false;
				validationResult.error = this.translateService.instant('cloud.common.uniqueValueErrorMessage', {object: info.field.toLowerCase()}).text;
			}else {
				validationResult.valid = true;
				validationResult.apply = true;
			}

			return validationResult;
		})));
	}

	private validateIsMinorEquipment(info: ValidationInfo<IResourceWorkOperationTypeEntity>): ValidationResult{
		if(info.value) {
			info.entity.IsHire = false;
		}
		this.resourceWotWorkOperationTypeProcessor.setIsHireColumnReadOnly(info.entity, info.value as boolean);

		return new ValidationResult();
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IResourceWorkOperationTypeEntity> {
		return this.resourceWotWorkOperationTypeDataService;
	}
}