/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { isNil } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { PlatformTranslateService } from '@libs/platform/common';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IRfqBusinessPartnerEntity } from '../../model/entities/rfq-businesspartner-entity.interface';
import { ProcurementRfqBusinessPartnerDataService } from '../rfq-business-partner-data.service';
import { BusinessPartnerLogicalValidatorFactoryService, BusinessPartnerLookupService, BusinesspartnerSharedContactLookupService } from '@libs/businesspartner/shared';
import { ProcurementSharedRfqRejectionReasonLookupService } from '@libs/procurement/shared';

@Injectable({
	providedIn: 'root'
})
export class ProcurementRfqBusinesspartnerValidationService extends BaseValidationService<IRfqBusinessPartnerEntity> {
	private readonly translationService = inject(PlatformTranslateService);
	private readonly contactLookupService = inject(BusinesspartnerSharedContactLookupService);
	private readonly bpLookupService = inject(BusinessPartnerLookupService);
	private readonly rejectionReasonService = inject(ProcurementSharedRfqRejectionReasonLookupService);
	private readonly bpValidator = inject(BusinessPartnerLogicalValidatorFactoryService).create({
		dataService: this.dataService
	});
	public constructor(
		private readonly dataService: ProcurementRfqBusinessPartnerDataService
	) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<IRfqBusinessPartnerEntity> {
		return {
			SubsidiaryFk: this.validateSubsidiaryFk,
			BusinessPartnerFk: this.validateBusinessPartnerFk,
			ContactFk: this.asyncValidateContactFk,
			SupplierFk: this.validateSupplierFk,
			DateRejected: this.asyncValidateDateRejected,
			RfqRejectionReasonFk: this.asyncValidateRfqRejectionReasonFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IRfqBusinessPartnerEntity> {
		return this.dataService;
	}

	private asyncValidateRfqRejectionReason(entity: IRfqBusinessPartnerEntity, rejectionReasonFk?: number | null, dateRejected?: string | null) {
		const validationResult = new ValidationResult();

		if (dateRejected) {
			if (!rejectionReasonFk) {
				validationResult.valid = false;
				validationResult.error = this.translationService.instant({
					key: 'cloud.common.emptyOrNullValueErrorMessage'
				}, {
					fieldName: this.translationService.instant({key: 'procurement.rfq.rfqBusinessPartnerRfqRejectionReason'}).text
				}).text;
				// $timeout(dataService.gridRefresh, 0, false); TODO-DRIZZLE: To be checked.
				return Promise.resolve(validationResult);
			}
			return firstValueFrom(this.rejectionReasonService.getItemByKey({
				id: rejectionReasonFk
			})).then((item) => {
				if (!item.Description) {
					validationResult.valid = false;
					validationResult.error = this.translationService.instant({
						key: 'cloud.common.emptyOrNullValueErrorMessage'
					}, {
						fieldName: this.translationService.instant({key: 'procurement.rfq.rfqBusinessPartnerRfqRejectionReason'}).text
					}).text;
					// $timeout(dataService.gridRefresh, 0, false); TODO-DRIZZLE: To be checked.
				}
				return validationResult;
			});
		}

		// $timeout(dataService.gridRefresh, 0, false); TODO-DRIZZLE: To be checked.
		return Promise.resolve(validationResult);
	}

	protected validateSubsidiaryFk = async (info: ValidationInfo<IRfqBusinessPartnerEntity>) => this.bpValidator.subsidiaryValidator(info.entity, info.value as number);

	public validateBusinessPartnerFk(info: ValidationInfo<IRfqBusinessPartnerEntity>) {
		// TODO-DRIZZLE: To be migrated.
		return new ValidationResult();
	}

	public asyncValidateContactFk(info: ValidationInfo<IRfqBusinessPartnerEntity>) {
		const validationResult = new ValidationResult();

		if (info.value && info.value !== info.entity.ContactFk) {
			return firstValueFrom(this.contactLookupService.getItemByKey({
				id: info.value as number
			})).then((item) => {
				if (isNil(info.entity.BusinessPartnerFk) || info.entity.BusinessPartnerFk === -1) {
					return firstValueFrom(this.bpLookupService.getItemByKey({
						id: item.BusinessPartnerFk
					})).then(() => {
						const validationInfo = new ValidationInfo(info.entity, item.BusinessPartnerFk, 'BusinessPartnerFk');
						info.entity.BusinessPartnerFk = item.BusinessPartnerFk;
						info.entity.ContactFk = info.value as number;
						this.dataService.updateContactHasPortalUserField([info.entity]);
						// dataService.gridRefresh(); TODO-DRIZZLE: To be checked again.
						return this.validateBusinessPartnerFk(validationInfo);
					});
				}
				return validationResult;
			});
		} else {
			this.dataService.updateContactHasPortalUserField([info.entity]);
		}

		return Promise.resolve(validationResult);
	}

	public validateSupplierFk = async(info: ValidationInfo<IRfqBusinessPartnerEntity>) => this.bpValidator.supplierValidator(info.entity, info.value as number);

	public asyncValidateDateRejected(info: ValidationInfo<IRfqBusinessPartnerEntity>) {
		const validationResult = new ValidationResult();

		if (!info.entity.DateRejected || !info.value) {
			return this.asyncValidateRfqRejectionReason(info.entity, info.entity.RfqRejectionReasonFk, info.value as string);
		}

		return Promise.resolve(validationResult);
	}

	public asyncValidateRfqRejectionReasonFk(info: ValidationInfo<IRfqBusinessPartnerEntity>) {
		const validationResult = new ValidationResult();

		if (info.entity.DateRejected) {
			return this.asyncValidateRfqRejectionReason(info.entity, info.value as number, info.entity.DateRejected);
		}

		return Promise.resolve(validationResult);
	}
}