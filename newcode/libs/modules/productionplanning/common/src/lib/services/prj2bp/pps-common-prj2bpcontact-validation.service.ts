/*
 * Copyright(c) RIB Software GmbH
 */

import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { PlatformConfigurationService /*, PlatformTranslateService*/ } from '@libs/platform/common';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IProjectMainPrj2BPContactEntity } from '@libs/project/interfaces';
import { firstValueFrom } from 'rxjs';

export class PpsCommonPrj2bpcontactValidationService extends BaseValidationService<IProjectMainPrj2BPContactEntity> {
	private http = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);
	protected readonly validationUtils = inject(BasicsSharedDataValidationService);

	public constructor(private dataService: IEntityRuntimeDataRegistry<IProjectMainPrj2BPContactEntity>) {
		super();
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IProjectMainPrj2BPContactEntity> {
		return this.dataService;
	}

	protected generateValidationFunctions(): IValidationFunctions<IProjectMainPrj2BPContactEntity> {
		return {
			ContactFk: this.asyncValidateContactFk,
		};
	}

	private async asyncValidateContactFk(info: ValidationInfo<IProjectMainPrj2BPContactEntity>): Promise<ValidationResult> {
		return this.applyAsyncFieldTest(info);
	}

	private async applyAsyncFieldTest(info: ValidationInfo<IProjectMainPrj2BPContactEntity>): Promise<ValidationResult> {
		const validationSpec = {
			Prj2bpcontact: info.entity,
			NewSubsidiary: info.value
		};

		const response = await firstValueFrom(this.http.post<IProjectMainPrj2BPContactEntity>(this.configService.webApiBaseUrl + 'project/main/project2bp/validate', validationSpec));
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

}
