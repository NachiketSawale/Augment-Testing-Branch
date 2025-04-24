/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IProjectMainPrj2BusinessPartnerEntity } from '@libs/project/interfaces';
import { ProjectMainPrj2BusinessPartnerDataService } from './project-main-prj-2-business-partner-data.service';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})

export class ProjectMainPrj2BusinessPartnerValidationService extends BaseValidationService<IProjectMainPrj2BusinessPartnerEntity> {

	private project2BpDataService = inject(ProjectMainPrj2BusinessPartnerDataService);
	private http = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);
	protected generateValidationFunctions(): IValidationFunctions<IProjectMainPrj2BusinessPartnerEntity> {
		return {
			BusinessPartnerFk: this.validateBusinessPartnerFk,
			SubsidiaryFk: this.validateSubsidiaryFk
		};
	}

	private async validateBusinessPartnerFk(info: ValidationInfo<IProjectMainPrj2BusinessPartnerEntity>):  Promise<ValidationResult> {

		return this.applyAsyncFieldTest(info);
	}

	private async validateSubsidiaryFk(info: ValidationInfo<IProjectMainPrj2BusinessPartnerEntity>): Promise<ValidationResult> {

		return this.applyAsyncFieldTest(info);
	}

	private async applyAsyncFieldTest(info: ValidationInfo<IProjectMainPrj2BusinessPartnerEntity>): Promise<ValidationResult> {
		const validationSpec = {
			Prj2BP: info.entity,
			NewSubsidiary: info.value
		};


		const response = await firstValueFrom(this.http.post<IProjectMainPrj2BusinessPartnerEntity>(this.configService.webApiBaseUrl + 'project/main/project2bp/validate', validationSpec));
		const result= new ValidationResult();
		if(response) {
			result.apply = true;
		} else {
			result.apply = false;
			result.valid = false;
			result.error = 'basics.company.validation.noValidRegEx';
		}

		return result;
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IProjectMainPrj2BusinessPartnerEntity> {
		return this.project2BpDataService;
	}

}