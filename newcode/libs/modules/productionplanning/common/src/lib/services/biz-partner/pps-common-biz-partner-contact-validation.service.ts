/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { PlatformConfigurationService } from '@libs/platform/common';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { firstValueFrom } from 'rxjs';
import { IPpsCommonBizPartnerContactEntity } from '../../model/entities/pps-common-biz-partner-contact-entity.interface';

export class PpsCommonBizPartnerContactValidationService extends BaseValidationService<IPpsCommonBizPartnerContactEntity> {

	private http = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);
	protected readonly validationUtils = inject(BasicsSharedDataValidationService);

	public constructor(private dataService: IEntityRuntimeDataRegistry<IPpsCommonBizPartnerContactEntity>) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<IPpsCommonBizPartnerContactEntity> {
		return {
			ContactFk: this.asyncValidateContactFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPpsCommonBizPartnerContactEntity> {
		return this.dataService;
	}

	private async asyncValidateContactFk(info: ValidationInfo<IPpsCommonBizPartnerContactEntity>): Promise<ValidationResult> {

		return this.applyAsyncFieldTest(info);
	}

	private async applyAsyncFieldTest(info: ValidationInfo<IPpsCommonBizPartnerContactEntity>): Promise<ValidationResult> {
		const validationSpec = {
			Prj2BP: info.entity,
			NewIntValue: info.value
		};

		const response = await firstValueFrom(this.http.post<IPpsCommonBizPartnerContactEntity>(this.configService.webApiBaseUrl + 'project/main/project2bpcontact/validate', validationSpec));
		const result = new ValidationResult();
		if (response) {
			result.apply = true;
			//todo...dataService.takeOver(response.data);
		} else {
			result.apply = false;
			result.valid = false;
			result.error = '';
		}

		return result;
	}

}