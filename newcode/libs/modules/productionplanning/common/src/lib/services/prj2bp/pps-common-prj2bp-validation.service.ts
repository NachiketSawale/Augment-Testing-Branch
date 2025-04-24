/*
 * Copyright(c) RIB Software GmbH
 */

import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { PlatformConfigurationService /*, PlatformTranslateService*/ } from '@libs/platform/common';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IProjectMainPrj2BusinessPartnerEntity } from '@libs/project/interfaces';
import { firstValueFrom } from 'rxjs';

export class PpsCommonPrj2bpValidationService extends BaseValidationService<IProjectMainPrj2BusinessPartnerEntity> {
	private http = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);
	protected readonly validationUtils = inject(BasicsSharedDataValidationService);

	public constructor(private dataService: IEntityRuntimeDataRegistry<IProjectMainPrj2BusinessPartnerEntity>) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<IProjectMainPrj2BusinessPartnerEntity> {
		return {
			RoleFk: this.validateRoleFk,
			BusinessPartnerFk: this.validateBusinessPartnerFk,
			SubsidiaryFk: this.validateSubsidiaryFk,
		};
	}

	private validateRoleFk(info: ValidationInfo<IProjectMainPrj2BusinessPartnerEntity>): ValidationResult {
		return this.validationUtils.isMandatory(info);
	}

	private async validateSubsidiaryFk(info: ValidationInfo<IProjectMainPrj2BusinessPartnerEntity>): Promise<ValidationResult> {

		return this.applyAsyncFieldTest(info);
	}

	private async validateBusinessPartnerFk(info: ValidationInfo<IProjectMainPrj2BusinessPartnerEntity>): Promise<ValidationResult> {

		return this.applyAsyncFieldTest(info);
	}

	private async applyAsyncFieldTest(info: ValidationInfo<IProjectMainPrj2BusinessPartnerEntity>): Promise<ValidationResult> {
		const validationSpec = {
			Prj2BP: info.entity,
			NewSubsidiary: info.value
		};

		const response = await firstValueFrom(this.http.post<IProjectMainPrj2BusinessPartnerEntity>(this.configService.webApiBaseUrl + 'project/main/project2bp/validate', validationSpec));
		const result = new ValidationResult();
		if (response) {
			result.apply = true;
			//todo...dataService.takeOver(response.data);
		} else {
			result.apply = false;
			result.valid = false;
			result.error = 'basics.company.validation.noValidRegEx';
		}

		return result;
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IProjectMainPrj2BusinessPartnerEntity> {
		return this.dataService;
	}
}
