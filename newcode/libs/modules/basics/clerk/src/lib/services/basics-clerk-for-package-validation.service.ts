/*
 * Copyright(c) RIB Software GmbH
 */
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { IBasicsClerkForPackageEntity } from '@libs/basics/interfaces';
import { BasicsClerkForPackageDataService } from './basics-clerk-for-package-data.service';
import { BasicsSharedClerkRoleLookupService } from '@libs/basics/shared';
import { firstValueFrom } from 'rxjs';
import { ServiceLocator } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class BasicsClerkForPackageValidationService extends BaseValidationService<IBasicsClerkForPackageEntity>{
	private readonly basicsClerkForPackageDataService = inject(BasicsClerkForPackageDataService);
	protected generateValidationFunctions(): IValidationFunctions<IBasicsClerkForPackageEntity> {
		return {
			ClerkRoleFk: this.validateClerkRoleFk
		};
	}

	private async validateClerkRoleFk(info: ValidationInfo<IBasicsClerkForPackageEntity>): Promise<ValidationResult>{
		let isSuccess = true;
		const result= new ValidationResult();
		if(!info.value){
			isSuccess = false;
			result.apply = true;
			result.valid = false;
			// error$tr$param$ needed?
			result.error = 'cloud.common.emptyOrNullValueErrorMessage';
		}
		const basClerkRoleLookupService = ServiceLocator.injector.get(BasicsSharedClerkRoleLookupService);
		const role = await firstValueFrom(basClerkRoleLookupService.getItemByKey({ id: info.value as number}));
		if(role && role.IsUnique){
			const clerkForPackageList = this.basicsClerkForPackageDataService.getList();
			const sameRoleClerks =clerkForPackageList.filter(item => {
				return item.ClerkRoleFk === info.value as number;
			});
			if(sameRoleClerks && sameRoleClerks.length > 0){
				isSuccess = false;
			}
			if(!isSuccess){
				result.apply = true;
				result.valid = false;
				result.error = 'basics.common.clerkRoleMustBeUnique';
			}
		}

		return result;
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IBasicsClerkForPackageEntity> {
		return this.basicsClerkForPackageDataService;
	}
}