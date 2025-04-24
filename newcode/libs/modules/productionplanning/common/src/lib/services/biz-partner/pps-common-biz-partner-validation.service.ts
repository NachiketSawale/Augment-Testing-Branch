/*
 * Copyright(c) RIB Software GmbH
 */

import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { PlatformConfigurationService /*, PlatformTranslateService*/ } from '@libs/platform/common';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { firstValueFrom } from 'rxjs';
import { IPpsCommonBizPartnerEntity } from '../../model/entities/pps-common-biz-partner-entity.interface';

export class PpsCommonBizPartnerValidationService extends BaseValidationService<IPpsCommonBizPartnerEntity> {
	// private project2BpDataService = inject(ProjectMainPrj2BusinessPartnerDataService);
	private http = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);
	protected readonly validationUtils = inject(BasicsSharedDataValidationService);
	// protected readonly translateService = inject(PlatformTranslateService);
	// protected readonly errorMsgKey: string = 'cloud.common.emptyOrNullValueErrorMessage';

	public constructor(private dataService: IEntityRuntimeDataRegistry<IPpsCommonBizPartnerEntity>) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<IPpsCommonBizPartnerEntity> {
		return {
			RoleFk: this.validateRoleFk,
			BusinessPartnerFk: this.validateBusinessPartnerFk,
			SubsidiaryFk: this.validateSubsidiaryFk,
		};
	}

	private validateRoleFk(info: ValidationInfo<IPpsCommonBizPartnerEntity>): ValidationResult {
		return this.validationUtils.isMandatory(info);
	}

	// private validateBusinessPartnerFk(info: ValidationInfo<IPpsCommonBizPartnerEntity>): ValidationResult {
	// 	return this.validationUtils.isMandatory(info);
	// }

	// private validateSubsidiaryFk(info: ValidationInfo<IPpsCommonBizPartnerEntity>): ValidationResult {
	// 	return this.validationUtils.isMandatory(info);
	// }

	private async validateBusinessPartnerFk(info: ValidationInfo<IPpsCommonBizPartnerEntity>): Promise<ValidationResult> {

		return this.applyAsyncFieldTest(info);
	}

	private async validateSubsidiaryFk(info: ValidationInfo<IPpsCommonBizPartnerEntity>): Promise<ValidationResult> {

		return this.applyAsyncFieldTest(info);
	}

	private async applyAsyncFieldTest(info: ValidationInfo<IPpsCommonBizPartnerEntity>): Promise<ValidationResult> {
		const validationSpec = {
			Prj2BP: info.entity,
			NewSubsidiary: info.value
		};

		const response = await firstValueFrom(this.http.post<IPpsCommonBizPartnerEntity>(this.configService.webApiBaseUrl + 'project/main/project2bp/validate', validationSpec));
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

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPpsCommonBizPartnerEntity> {
		return this.dataService;
	}
}
