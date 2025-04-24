/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IProjectRoleEntity } from '@libs/project/interfaces';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { BasicsSharedClerkRoleLookupService } from '@libs/basics/shared';
import { firstValueFrom, lastValueFrom, map } from 'rxjs';
import { ProjectMainClerkRoleDataService } from './project-main-clerk-role-data.service';
import { HttpClient } from '@angular/common/http';
import _ from 'lodash';

@Injectable({
	providedIn: 'root'
})

export class ProjectMainClerkRoleValidationService extends BaseValidationService<IProjectRoleEntity> {

	private http = inject(HttpClient);
	private config = inject(PlatformConfigurationService);
	private projectMainClerkRoleDataService = inject(ProjectMainClerkRoleDataService);
	private basicsSharedClerkRoleLookupService = inject(BasicsSharedClerkRoleLookupService);
	private translationService = inject(PlatformTranslateService);

	protected generateValidationFunctions(): IValidationFunctions<IProjectRoleEntity> {
		return {
			ClerkFk: [this.validateIsMandatory, this.validateClerkFkAsync],
			ClerkRoleFk: [this.validateIsMandatory, this.validateClerkRoleFkAsync],
			ValidFrom: [this.validateIsValidTimeSpanFrom, this.validateAdditionalValidFrom],
			ValidTo: [this.validateIsValidTimeSpanTo, this.validateAdditionalValidTo]
		};
	}

	protected override getMissingTimeSpanInfo = (info: ValidationInfo<IProjectRoleEntity>) : ValidationInfo<IProjectRoleEntity> | undefined => {
		switch (info.field) {
			case 'ValidFrom':
				return new ValidationInfo(info.entity, info.entity.ValidTo ?? undefined, 'ValidTo');
			case 'ValidTo':
				return new ValidationInfo(info.entity, info.entity.ValidFrom ?? undefined, 'ValidFrom');
			default:
				return new ValidationInfo(info.entity, info.value, info.field);
		}
	};

	private async validateClerkFkAsync(info: ValidationInfo<IProjectRoleEntity>): Promise<ValidationResult> {
		const validResult = new ValidationResult();
		const url = this.config.webApiBaseUrl + 'basics/clerk/getClerkById?clerkId=' + info.value;
		await lastValueFrom(this.http.get(url).pipe(
			map((result) => {
				const prjRoleEntity = result as IProjectRoleEntity;
				if(prjRoleEntity){
					// TODO: Current AddressEntity & TelephoneNumberEntity are not in correct folder. Referring those entities will violate our code compliance
					//info.entity.Address = result.Address;
					info.entity.Email = prjRoleEntity.Email;
					//info.entity.TelephoneMobil = prjRoleEntity.TelephoneMobil;
					//info.entity.TelephoneNumber = prjRoleEntity.TelephoneNumber;
					// info.entity.TelephoneNumberTelefax = prjRoleEntity.TelephoneNumberTelefax;
					// info.entity.TelephonePrivat = prjRoleEntity.TelephonePrivat;
					// info.entity.TelephonePrivatMobil = prjRoleEntity.TelephonePrivatMobil;
				}
			})));

		return validResult;
	}

	private async validateClerkRoleFkAsync(info: ValidationInfo<IProjectRoleEntity>): Promise<ValidationResult>{
		const clerkRoleFk = info.value as number;
		if(clerkRoleFk){
			const clerkRoleEntity = await firstValueFrom(this.basicsSharedClerkRoleLookupService.getItemByKey({id: clerkRoleFk}));
			info.entity.RoleRequiresUniqueness = clerkRoleEntity.IsUnique;
			if (clerkRoleEntity && clerkRoleEntity.IsUnique) {
				info.entity.ClerkRoleFk = clerkRoleFk;
				return this.validateUniqueRoleIsNotUsedAtSameTimeTwice(info);
			}
		}

		return new ValidationResult();
	}

	private validateAdditionalValidFrom(info: ValidationInfo<IProjectRoleEntity>): ValidationResult{
		if(info.entity.RoleRequiresUniqueness){
			info.entity.ValidFrom = info.value as Date;
			return this.validateUniqueRoleIsNotUsedAtSameTimeTwice(info);
		}

		return new ValidationResult();
	}

	private validateAdditionalValidTo(info: ValidationInfo<IProjectRoleEntity>): ValidationResult{
		if(info.entity.RoleRequiresUniqueness){
			info.entity.ValidTo = info.value as Date;
			return this.validateUniqueRoleIsNotUsedAtSameTimeTwice(info);
		}

		return new ValidationResult();
	}

	private validateUniqueRoleIsNotUsedAtSameTimeTwice(info: ValidationInfo<IProjectRoleEntity>): ValidationResult{

		const validResult = new ValidationResult();
		const records = this.projectMainClerkRoleDataService.getList();
		const clerkRoleFk = info.entity.ClerkRoleFk;
		const withSameRole = _.filter(records, function(rec) {
			return rec.ClerkRoleFk === clerkRoleFk && rec.Id !== info.entity.Id;
		});

		if(withSameRole.length === 0){
			validResult.valid = true;
			return validResult;
		}

		const noOverlappingFound = this.hasNoOverlapping(info.entity, withSameRole);

		if(noOverlappingFound) {
			this.reEvaluate(withSameRole);
		}

		validResult.valid = noOverlappingFound;
		validResult.error = this.translationService.instant({ key: 'cloud.common.uniqueValueErrorMessage', params: {'object': 'ClerkRole'} }).text;
		return validResult;
	}

	private hasNoOverlapping(candidate: IProjectRoleEntity, otherRecords: IProjectRoleEntity[]): boolean{
		let noOverlappingFound = true;
		const areRecordsOverlap = this.recordsAreOverlapping;

		_.forEach(otherRecords, function(rec) {
			if(areRecordsOverlap(rec, candidate)) {
				noOverlappingFound = false;
			}
		});

		return noOverlappingFound;
	}

	private recordsAreOverlapping(left: IProjectRoleEntity, right: IProjectRoleEntity){
		if(_.isNil(left.ValidFrom) && _.isNil(left.ValidTo)) {
			// left lasts forever -> overlapping is happening for sure
			return true;
		}

		if(_.isNil(right.ValidFrom) && _.isNil(right.ValidTo)) {
			// right lasts forever -> overlapping is happening for sure
			return true;
		}

		if(_.isNil(left.ValidFrom)) {
			if(_.isNil(right.ValidFrom)) {
				// right and left start at the beginning of time -> overlapping is happening for sure
				return true;
			}

			if(left.ValidTo){
				return left.ValidTo > right.ValidFrom;
			}
		}

		if(_.isNil(left.ValidTo)) {
			if(_.isNil(right.ValidTo)) {
				// right and left end at the end of time -> overlapping is happening for sure
				return true;
			}

			if(left.ValidFrom){
				return right.ValidTo > left.ValidFrom;
			}
		}

		if(_.isNil(right.ValidFrom) && right.ValidTo! > left.ValidFrom!) {
			// right starts at the beginning of time and ends after the start of left
			return true;
		}

		if(_.isNil(right.ValidTo) && left.ValidTo! > right.ValidFrom!) {
			// right ends at the end of time and starts before the end of left
			return true;
		}

		// all values are set
		if(right.ValidFrom! > left.ValidFrom! && left.ValidTo! > right.ValidFrom!) {
			// right starts after left, but before left ended
			return true;
		}

		if(left.ValidFrom! > right.ValidFrom! && right.ValidTo! > left.ValidFrom!) {
			// left starts after right, but before left right
			return true;
		}

		if(right.ValidFrom! > left.ValidFrom! && left.ValidTo! > right.ValidTo!) {
			// right starts after left and right ends before left
			return true;
		}

		// check if left starts after right and left ends before right
		return left.ValidFrom! > right.ValidFrom! && right.ValidTo! > left.ValidTo!;
	}

	private reEvaluate(candidates: IProjectRoleEntity[]) {
		const len = candidates.length;
		if(len === 0) {
			return;
		}

		_.forEach(candidates, (candidate) => {
			if(this.hasRoleError(candidate)) {
				if(len === 1) {
					this.setRecordValid(candidate);
				} else {
					const allOther = _.filter(candidates, function (rec) {
						return rec.Id !== candidate.Id;
					});

					if(this.hasNoOverlapping(candidate, allOther)) {
						this.setRecordValid(candidate);
					}
				}
			}
		});
	}

	private hasRoleError(record: IProjectRoleEntity): boolean{
		const errors = this.getEntityRuntimeData().getValidationErrors(record);
		const roleErrors = _.filter(errors, function (e){
			return e.field === 'ClerkRoleFk' || e.field === 'ValidFrom' || e.field === 'ValidTo';
		});

		return roleErrors.length > 0;
	}

	private setRecordValid(record: IProjectRoleEntity): void{
		const errFields = this.getEntityRuntimeData().getValidationErrors(record).map(r => r.field);
		if(errFields.includes('ClerkRoleFk')){
			this.getEntityRuntimeData().removeInvalid(record, { field: 'ClerkRoleFk', result: { valid: true, apply: true } });
		}

		if(errFields.includes('ValidFrom')){
			this.getEntityRuntimeData().removeInvalid(record, { field: 'ValidFrom', result: { valid: true, apply: true } });
		}

		if(errFields.includes('ValidTo')){
			this.getEntityRuntimeData().removeInvalid(record, { field: 'ValidTo', result: { valid: true, apply: true } });
		}
		this.projectMainClerkRoleDataService.setModified(record);
	}

		protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IProjectRoleEntity> {
		return this.projectMainClerkRoleDataService;
	}
}