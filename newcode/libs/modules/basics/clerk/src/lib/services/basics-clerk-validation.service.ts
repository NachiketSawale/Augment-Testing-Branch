/*
 * Copyright(c) RIB Software GmbH
 */
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo,
	ValidationResult
} from '@libs/platform/data-access';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { IBasicsClerkEntity } from '@libs/basics/interfaces';
import { BasicsClerkDataService } from './basics-clerk-data.service';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { IUserEntity } from '@libs/usermanagement/interfaces';

export const BASICS_CLERK_VALIDATION_TOKEN = new InjectionToken<BasicsClerkValidationService>('basicsClerkValidationToken');

@Injectable({
	providedIn: 'root'
})
export class BasicsClerkValidationService extends BaseValidationService<IBasicsClerkEntity>{
	private basicsClerkDataService = inject(BasicsClerkDataService);
	private http = inject(HttpClient);
	private config = inject(PlatformConfigurationService);
	protected translateService = inject(PlatformTranslateService);

	protected override getMissingTimeSpanInfo = (info: ValidationInfo<IBasicsClerkEntity>) : ValidationInfo<IBasicsClerkEntity> | undefined => {
		switch (info.field) {
			case 'ValidFrom':
				return new ValidationInfo(info.entity, info.entity.ValidTo ?? undefined, 'ValidTo');
			case 'ValidTo':
				return new ValidationInfo(info.entity, info.entity.ValidFrom ?? undefined, 'ValidFrom');
			default:
				return new ValidationInfo(info.entity, info.value, info.field);
		}
	};
	protected override getLoadedEntitiesForUniqueComparison = (info: ValidationInfo<IBasicsClerkEntity>): IBasicsClerkEntity[] => {
		const itemList = this.basicsClerkDataService.getList();
		const res = itemList.filter(item => {
			return (item as never)[info.field] === info.value && item.Id !== info.entity.Id;
		});

		return res;
	};

	protected generateValidationFunctions(): IValidationFunctions<IBasicsClerkEntity> {
		return {
			Code: [this.validateIsMandatory,this.validateIsUnique],
			TxPw: this.validateTxPw,
			ValidFrom: this.validateValidFrom,
			ValidTo: this.validateValidTo,
			UserFk: this.validateUserFk
		};
	}

	private validateTxPw(info: ValidationInfo<IBasicsClerkEntity> ): ValidationResult {
		info.entity.IsTxUserChanged = true;
		return {apply: true, valid: true};
	}

	private validateValidFrom(info: ValidationInfo<IBasicsClerkEntity>): ValidationResult {
		return this.validateIsValidTimeSpanFrom(info);
	}

	private validateValidTo(info: ValidationInfo<IBasicsClerkEntity>): ValidationResult {
		return this.validateIsValidTimeSpanTo(info);
	}

	private async validateUserFk(info: ValidationInfo<IBasicsClerkEntity>): Promise<ValidationResult> {
		const result = new ValidationResult();

		if (!info.value || !info.entity.UserFk) {
			return Promise.resolve(result);
		}

		const response1 = await lastValueFrom(
			this.http.get<IBasicsClerkEntity>(this.config.webApiBaseUrl + 'basics/clerk/clerkByUser?userId=' + info.value)).catch(error => {

		});

		if (response1 && response1.Id !== info.entity.Id) {
			result.valid = false;
			result.error = 'basics.clerk.userAlreadyExistsError';
			return result;
		}

		const userIds = [info.value];
		const response2 = await lastValueFrom(this.http.post<IUserEntity[]>(this.config.webApiBaseUrl + 'usermanagement/main/user/getUsersByIds', userIds));
		if (response2 && response2[0]) {
			const email = response2[0].Email;
			if (email !== null && email !== undefined){
				info.entity.Email = email;
			}
		}

		result.valid = true;
		return result;
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IBasicsClerkEntity> {
		return this.basicsClerkDataService;
	}
}