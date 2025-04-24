/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IProjectMainPrj2BPContactEntity } from '@libs/project/interfaces';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { ProjectMainPrj2BpContactDataService } from './project-main-prj-2-bpcontact-data.service';

@Injectable({
	providedIn: 'root'
})

export class ProjectMainPrj2BpContactValidationService extends BaseValidationService<IProjectMainPrj2BPContactEntity> {

	private project2BpContactDataService = inject(ProjectMainPrj2BpContactDataService);
	private http = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);
	protected generateValidationFunctions(): IValidationFunctions<IProjectMainPrj2BPContactEntity> {
		return {
			BusinessPartnerFk: this.asyncValidateContactFk,
			ContactFk: this.validateContactFk
		};
	}

	private async asyncValidateContactFk(info: ValidationInfo<IProjectMainPrj2BPContactEntity>):  Promise<ValidationResult> {

		return this.applyAsyncFieldTest(info);
	}

	private validateContactFk(info: ValidationInfo<IProjectMainPrj2BPContactEntity>): ValidationResult {

		return this.validateIsMandatory(info);
	}

	private async applyAsyncFieldTest(info: ValidationInfo<IProjectMainPrj2BPContactEntity>): Promise<ValidationResult> {
		const validationSpec = {
			Prj2BP: info.entity,
			NewIntValue: info.value
		};

		const response = await firstValueFrom(this.http.post<IProjectMainPrj2BPContactEntity>(this.configService.webApiBaseUrl + 'project/main/project2bpcontact/validate', validationSpec));
		const result= new ValidationResult();
		if(response) {
			result.apply = true;
			this.project2BpContactDataService.setModified(response);
		} else {
			result.apply = false;
			result.valid = false;
			result.error = '';
		}

		return result;
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IProjectMainPrj2BPContactEntity> {
		return this.project2BpContactDataService;
	}

}