/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BusinessPartnerLookupService } from '@libs/businesspartner/shared';
import { IQuoteHeaderEntity } from '../../model/entities/quote-header-entity.interface';
import { ProcurementQuoteHeaderDataService } from '../quote-header-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';

@Injectable({
	providedIn: 'root'
})
export class ProcurementQuoteHeaderValidationService extends BaseValidationService<IQuoteHeaderEntity> {
	private readonly validationService = inject(BasicsSharedDataValidationService);
	private readonly bpLookupService = inject(BusinessPartnerLookupService);

	public constructor(
		private readonly dataService: ProcurementQuoteHeaderDataService
	) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<IQuoteHeaderEntity> {
		return {
			RfqHeaderFk: this.validateRfqHeaderFk,
			ProjectFk: this.validateProjectFk,
			Code: [this.validateCode, this.asyncValidateCode],
			BusinessPartnerFk: this.asyncValidateBusinessPartnerFk,
			SupplierFk: this.validateSupplierFk,
			SubsidiaryFk: this.validateSubsidiaryFk,
			EvaluationDto: this.validateEvaluationDto,
			BillingSchemaFk: this.validateBillingSchemaFk,
			CurrencyFk: this.asyncValidateCurrencyFk,
			ExchangeRate: this.asyncValidateExchangeRate,
			DateQuoted: this.validateDateQuoted,
			BpdVatGroupFk: this.validateBpdVatGroupFk,
			OverallDiscount: this.validateOverallDiscount,
			OverallDiscountOc: this.validateOverallDiscountOc,
			OverallDiscountPercent: this.validateOverallDiscountPercent,
			DateEffective: this.asyncValidateDateEffective,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IQuoteHeaderEntity> {
		return this.dataService;
	}

	public validateRfqHeaderFk(info: ValidationInfo<IQuoteHeaderEntity>) {
		const result = this.validationService.isMandatory(info);
		if (result.valid && info.value !== info.entity.RfqHeaderFk) {
			// onPropertyChanged.rfqHeaderChanged(currentItem, value, field); TODO-DRIZZLE: To be migrated.
		}
		result.apply = true;
		return result;
	}

	public validateProjectFk(info: ValidationInfo<IQuoteHeaderEntity>) {
		// TODO-DRIZZLE: To be migrated.
		return new ValidationResult();
	}

	public validateCode(info: ValidationInfo<IQuoteHeaderEntity>) {
		return this.validationService.isUnique(this.dataService, info, this.dataService.getList());
	}

	public asyncValidateCode(info: ValidationInfo<IQuoteHeaderEntity>) {
		const result = this.validationService.isAsyncUnique(info, 'procurement/quote/header/isunique');
		// dataService.fireItemModified(entity); TODO-DRIZZLE: To be migrated.
		return result;
	}

	public asyncValidateBusinessPartnerFk(info: ValidationInfo<IQuoteHeaderEntity>) {
		const result = this.validationService.isMandatory(info);
		if (result.valid && info.value !== info.entity.BusinessPartnerFk) {
			// onPropertyChanged.businessPartnerChanged(currentItem, value, field); TODO-DRIZZLE: To be checked.
			return firstValueFrom(this.bpLookupService.getItemByKey({
				id: info.value as number
			})).then(item => {
				if (item.PrcIncotermFk) {
					info.entity.IncotermFk = item.PrcIncotermFk;
				}
				return result;
			});
		}
		result.apply = true;
		return result;
	}

	public validateSupplierFk(info: ValidationInfo<IQuoteHeaderEntity>) {
		// if (field && value !== currentItem[field]) {
		// 	onPropertyChanged.supplierChanged(currentItem, value, field);
		// } TODO-DRIZZLE: To be migrated.
		return new ValidationResult();
	}

	public validateSubsidiaryFk(info: ValidationInfo<IQuoteHeaderEntity>) {
		// if (field && value !== currentItem[field]) {
		// 	onPropertyChanged.subsidiaryChanged(currentItem, value);
		// } TODO-DRIZZLE: To be migrated.
		return new ValidationResult();
	}

	public validateEvaluationDto(info: ValidationInfo<IQuoteHeaderEntity>) {
		// if (field && value !== currentItem[field]) {
		// 	onPropertyChanged.evaluationDtoChanged(currentItem, value, field);
		// } TODO-DRIZZLE: To be migrated.
		return new ValidationResult();
	}

	public validateBillingSchemaFk(info: ValidationInfo<IQuoteHeaderEntity>) {
		if (info.entity.BillingSchemaFk !== info.value) {
			info.entity.BillingSchemaFk = info.value as number;
			// dataService.BillingSchemaChanged.fire(); TODO-DRIZZLE: To be checked.
		}
		return new ValidationResult();
	}

	public asyncValidateCurrencyFk(info: ValidationInfo<IQuoteHeaderEntity>) {
		// TODO-DRIZZLE: To be migrated
		return new ValidationResult();
	}

	public asyncValidateExchangeRate(info: ValidationInfo<IQuoteHeaderEntity>) {
		// TODO-DRIZZLE: To be migrated
		return new ValidationResult();
	}

	public validateDateQuoted(info: ValidationInfo<IQuoteHeaderEntity>) {
		if (info.value) {
			info.entity.DateEffective = info.value as string;
		}
		return new ValidationResult();
	}

	public validateBpdVatGroupFk(info: ValidationInfo<IQuoteHeaderEntity>) {
		// info.entity.originVatGroupFk = info.entity.BpdVatGroupFk; TODO-DRIZZLE: To be checked.
		return new ValidationResult();
	}

	public validateOverallDiscount(info: ValidationInfo<IQuoteHeaderEntity>) {
		// return overDiscountValidationService.validateOverallDiscount(entity, value, model, service, dataService, qtoTotalService); TODO-DRIZZLE: To be migrated
		return new ValidationResult();
	}

	public validateOverallDiscountOc(info: ValidationInfo<IQuoteHeaderEntity>) {
		// return overDiscountValidationService.validateOverallDiscountOc(entity, value, model, service, dataService, qtoTotalService); TODO-DRIZZLE: To be migrated
		return new ValidationResult();
	}

	public validateOverallDiscountPercent(info: ValidationInfo<IQuoteHeaderEntity>) {
		// return overDiscountValidationService.validateOverallDiscountPercent(entity, value, model, service, dataService, qtoTotalService); TODO-DRIZZLE: To be migrated
		return new ValidationResult();
	}

	public asyncValidateDateEffective(info: ValidationInfo<IQuoteHeaderEntity>) {
		// let procurementCommonDateEffectiveValidateService = $injector.get('procurementCommonDateEffectiveValidateService');
		// let prcHeaderService = $injector.get('procurementContextService').getMainService();
		// let prcQuoteBoqService = $injector.get('prcBoqMainService').getService(prcHeaderService);
		// let selectHeader = prcHeaderService.getSelected();
		// return procurementCommonDateEffectiveValidateService.asyncModifyDateEffectiveAndUpdateBoq(entity, value, model, prcQuoteBoqService, dataService, service, {
		// 	ProjectId: selectHeader.ProjectFk,
		// 	Module: 'procurement.quote',
		// 	BoqHeaderId: selectHeader ? selectHeader.PrcHeaderFk : -1,
		// 	HeaderId: entity.Id,
		// 	ExchangeRate: entity.ExchangeRate
		// }); TODO-DRIZZLE: To be migrated.
		return new ValidationResult();
	}
}