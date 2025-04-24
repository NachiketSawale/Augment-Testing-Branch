/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { ITimekeeping2ClerkEntity } from '@libs/project/interfaces';
import { ProjectMainTimekeepingClerkDataService } from './project-main-timekeeping-clerk-data.service';
import * as _ from 'lodash';
import { PlatformTranslateService } from '@libs/platform/common';
import { BasicsSharedClerkRoleLookupService } from '@libs/basics/shared';
import { firstValueFrom } from 'rxjs';

@Injectable({
	providedIn: 'root'
})

export class ProjectMainTimekeepingClerkValidationService extends BaseValidationService<ITimekeeping2ClerkEntity> {

	private projectMainTimekeepingClerkDataService = inject(ProjectMainTimekeepingClerkDataService);
	private basicsSharedClerkRoleLookupService = inject(BasicsSharedClerkRoleLookupService);
	private translationService = inject(PlatformTranslateService);

	protected generateValidationFunctions(): IValidationFunctions<ITimekeeping2ClerkEntity> {
		return {
			JobFk: this.validateIsMandatory,
			ClerkFk: [this.validateIsMandatory, this.validateClerkFkAsync],
			ClerkRoleFk: [this.validateIsMandatory, this.validateClerkRoleFkAsync],
		};
	}

	private async doValidateClerkAndRole(info: ValidationInfo<ITimekeeping2ClerkEntity>, compositeModel: keyof ITimekeeping2ClerkEntity, compositeValue: number, errMsg: string): Promise<ValidationResult> {
		const result = new ValidationResult();
		const clerkRoleFkName: keyof ITimekeeping2ClerkEntity = 'ClerkRoleFk';
		const roleFkValue = (info.field === clerkRoleFkName ? info.value : compositeValue) as number;
		const clerkRoleEntity = await firstValueFrom(this.basicsSharedClerkRoleLookupService.getItemByKey({id: roleFkValue}));
		if (clerkRoleEntity && clerkRoleEntity.IsUnique) {
			const recsWithSameRole = _.filter(this.projectMainTimekeepingClerkDataService.getList(), function (cl) {
				return cl[info.field as keyof ITimekeeping2ClerkEntity] === info.value && cl[compositeModel] === compositeValue && cl.JobFk === info.entity.JobFk;
			});

			if (recsWithSameRole && recsWithSameRole.length) {
				result.valid = false;
				result.apply = true;
				result.error = errMsg;
			} else {
				// TODO: Wait for removeFromErrorList and applyValidationResult in base validation service
				// platformRuntimeDataService.removeFromErrorList(info.entity, compositeModel, this, this.getEntityRuntimeData);
				// platformRuntimeDataService.applyValidationResult(true, info.entity, compositeModel);
			}
		}

		// TODO
		//return platformDataValidationService.finishValidation(result, info.entity, info.value, info.field, self, this.projectMainTimekeepingClerkDataService);

		return result;
	}

	private async validateClerkRoleFkAsync(info: ValidationInfo<ITimekeeping2ClerkEntity>): Promise<ValidationResult> {
		const errMsg = this.translationService.instant({key: 'basics.common.clerkRoleMustBeUnique'}).text;
		return this.doValidateClerkAndRole(info, 'ClerkFk', info.entity.ClerkFk, errMsg);
	}

	private async validateClerkFkAsync(info: ValidationInfo<ITimekeeping2ClerkEntity>): Promise<ValidationResult> {
		const errMsg = this.translationService.instant({key: 'basics.common.clerkMustBeUnique'}).text;
		return this.doValidateClerkAndRole(info, 'ClerkRoleFk', info.entity.ClerkRoleFk, errMsg);
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ITimekeeping2ClerkEntity> {
		return this.projectMainTimekeepingClerkDataService;
	}
}