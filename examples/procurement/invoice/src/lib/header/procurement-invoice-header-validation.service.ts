/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import * as math from 'mathjs';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IInvHeaderEntity } from '../model';
import { ProcurementInvoiceHeaderDataService } from './procurement-invoice-header-data.service';
import { IEntityIdentification, PlatformHttpService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import {
	BasicsShareBillingSchemaLookupService,
	BasicsSharedAccountAssignmentContractTypeLookupService,
	BasicsSharedCompanyContextService,
	BasicsSharedCompanyDeferaltypeLookupService,
	BasicsSharedDataValidationService,
	BasicsSharedInvoiceTypeLookupService,
	BasicsSharedTaxCodeLookupService,
	BasicsSharedProcurementConfigurationLookupService,
	BasicsSharedReferenceStructuredValidationService,
	BasicsShareProcurementConfigurationToBillingSchemaLookupService,
	IBillingSchemaEntity,
	MainDataDto,
	ProcurementConfigurationEntity,
	Rubric,
} from '@libs/basics/shared';
import { firstValueFrom } from 'rxjs';
import { IInvoiceTypeInfo } from '../model/interfaces/invoice-type-info.interface';
import { FieldType, IGridDialogOptions, LookupSearchRequest, UiCommonGridDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { IContractLookupEntity, PrcInvoiceStatusLookupService, ProcurementPackageLookupService, ProcurementShareContractLookupService, ProcurementShareInvoiceLookupService, ProcurementSharePesLookupService } from '@libs/procurement/shared';
import { HttpParams } from '@angular/common/http';
import { get, isObject, maxBy, sumBy, forEach, isNil, isEmpty } from 'lodash';
import { BusinessPartnerLogicalValidatorFactoryService, BusinesspartnerSharedBankLookupService, BusinesspartnerSharedSupplierLookupService } from '@libs/businesspartner/shared';
import { ProcurementInvoiceCurrencyExchangeRateService } from './procurement-invoice-currency-exchange-rate.service';
import { ProcurementInvoiceChainedInvoiceDataService } from '../services/procurement-invoice-chained-invoice-data.service';
import { ProcurementInvoiceCertificateDataService } from '../services/procurement-invoice-certificate-data.service';
import { ISupplierCompanyEntity, ISupplierEntity } from '@libs/businesspartner/interfaces';
import { zonedTimeToUtc } from 'date-fns-tz';
import { ProcurementInvoiceGeneralsDataService } from '../services/procurement-invoice-generals-data.service';
import { IConHeaderEntity } from '@libs/procurement/common';
import { ProjectSharedLookupService } from '@libs/project/shared';

@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceHeaderValidationService extends BaseValidationService<IInvHeaderEntity> {
	private readonly dataService: ProcurementInvoiceHeaderDataService = inject(ProcurementInvoiceHeaderDataService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly translationService = inject(PlatformTranslateService);
	private readonly http = inject(PlatformHttpService);
	protected readonly companyContext = inject(BasicsSharedCompanyContextService);
	private readonly invTypeLookupService = inject(BasicsSharedInvoiceTypeLookupService);
	private readonly configurationLookupService = inject(BasicsSharedProcurementConfigurationLookupService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly gridDialogService = inject(UiCommonGridDialogService);
	private readonly referenceStructuredValidationService = inject(BasicsSharedReferenceStructuredValidationService);
	private readonly billingSchemaLookupService = inject(BasicsShareBillingSchemaLookupService);
	private readonly prcConfig2BSchemaLookupService = inject(BasicsShareProcurementConfigurationToBillingSchemaLookupService);
	private readonly contractLookupService = inject(ProcurementShareContractLookupService);
	private readonly conHeaderLookupService = inject(ProcurementShareContractLookupService);
	private readonly accountConTypeLookup = inject(BasicsSharedAccountAssignmentContractTypeLookupService);
	private readonly mdcTaxCodeService = inject(BasicsSharedTaxCodeLookupService);
	private readonly currencyExchangeRateService = inject(ProcurementInvoiceCurrencyExchangeRateService);
	private readonly invoiceChainedLookupService = inject(ProcurementShareInvoiceLookupService);
	private readonly certificateDataService = inject(ProcurementInvoiceCertificateDataService);
	private readonly projectLookupService = inject(ProjectSharedLookupService);
	private readonly prcPackageLookupService = inject(ProcurementPackageLookupService);
	private readonly statusLookupService = inject(PrcInvoiceStatusLookupService);
	private readonly pesLookupService = inject(ProcurementSharePesLookupService);
	private readonly supplierLookupService = inject(BusinesspartnerSharedSupplierLookupService);
	private readonly bankLookupService = inject(BusinesspartnerSharedBankLookupService);
	private readonly deferalTypeLookupService = inject(BasicsSharedCompanyDeferaltypeLookupService);
	private readonly businessPartnerValidatorService = inject(BusinessPartnerLogicalValidatorFactoryService).create({
		dataService: this.dataService,
	});

	protected generateValidationFunctions(): IValidationFunctions<IInvHeaderEntity> {
		return {
			PrcConfigurationFk: this.validatePrcConfigurationFk,
			InvTypeFk: this.validateInvTypeFk,
			Code: this.asyncValidateCode,
			BusinessPartnerFk: this.asyncValidateBusinessPartnerFk,
			SupplierFk: this.asyncValidateSupplierFk,
			BasAccassignConTypeFk: this.validateBasAccassignConTypeFk,
			ReferenceStructured: this.validateReferenceStructured,
			ProgressId: this.validateProgressId,
			Reference: this.asyncValidateReference,
			DateInvoiced: this.validateDateInvoiced,
			DatePosted: this.validateDatePosted,
			DateReceived: this.validateDateReceived,
			BasCurrencyFk: this.validateCurrencyFk,
			ExchangeRate: this.validateExchangeRate,
			AmountGross: this.validateAmountGross,
			TotalPerformedGross: this.validateTotalPerformedGross,
			TotalPerformedNet: this.validateTotalPerformedNet,
			AmountNet: this.validateAmountNet,
			AmountNetOc: this.validateAmountNetOc,
			AmountGrossOc: this.validateAmountGrossOc,
			AmountDiscountBasis: this.validateAmountDiscountBasis,
			AmountDiscountBasisOc: this.validateAmountDiscountBasisOc,
			AmountDiscount: this.validateAmountDiscount,
			AmountDiscountOc: this.validateAmountDiscountOc,
			ProjectFk: this.validateProjectFk,
			PrcPackageFk: this.validatePrcPackageFk,
			ControllingUnitFk: this.validateControllingUnitFk,
			PrcStructureFk: this.validatePrcStructureFk,
			TaxCodeFk: this.validateTaxCodeFk,
			PaymentTermFk: this.validatePaymentTermFk,
			PesHeaderFk: this.validatePesHeaderFk,
			BankFk: this.validateBankFk,
			BpdVatGroupFk: this.validateBpdVatGroupFk,
			DateDeferalStart: this.validateDateDeferalStart,
			CompanyDeferalTypeFk: this.validateCompanyDeferalTypeFk,
			PercentDiscount: this.validatePercentDiscount,
			PaymentHint: this.validatePaymentHint,
			DateNetPayable: this.validateDateNetPayable,
			DateDiscount: this.validateDateDiscount,
			ConHeaderFk: this.validateConHeaderFk,
		};
	}

	public getEntityRuntimeData(): IEntityRuntimeDataRegistry<IInvHeaderEntity> {
		return this.dataService;
	}

	private async validatePrcConfigurationFk(info: ValidationInfo<IInvHeaderEntity>) {
		const entity = info.entity;
		const value = info.value as number;
		if (!isNil(entity.ConHeaderFk)) {
			this.onPrcConfigurationFk(entity, value, true, false);
		} else {
			this.onPrcConfigurationFk(entity, value, true, false, undefined, undefined);
		}
		return this.validationUtils.createSuccessObject();
	}

	private async validateInvTypeFk(info: ValidationInfo<IInvHeaderEntity>, fireEvent?: boolean) {
		const entity = info.entity;
		const oldValue = info.entity.InvTypeFk;
		const value = info.value as number;
		if (entity.ConHeaderFk && fireEvent === undefined) {
			this.dataService.autoCreateChainedInvoice$.next({ conHeaderId: entity.ConHeaderFk });
		}
		if (!isNil(entity.ConHeaderFk) && !this.hasSameProgressType(oldValue, value)) {
			const conHeader = await firstValueFrom(this.conHeaderLookupService.getItemByKey({ id: entity.ConHeaderFk }));
			if (conHeader) {
				this.dataService.updatePaymentTermFkAndRelatedProperties(entity, conHeader);
			}
		} else if (!isNil(entity.SupplierFk) && !this.hasSameProgressType(oldValue, value)) {
			const supplier = await firstValueFrom(this.supplierLookupService.getItemByKey({ id: entity.SupplierFk }));
			if (supplier) {
				this.updatePaymentTermFkBySupplier(entity, supplier);
			}
		} else if (!this.hasSameProgressType(oldValue, value)) {
			const config = await firstValueFrom(this.configurationLookupService.getItemByKey({ id: entity.PrcConfigurationFk }));
			if (config) {
				this.updatePaymentTermFkByPrcConfiguration(entity, config);
			}
		}
		if (value) {
			const invType = this.invTypeLookupService.cache.getItem({ id: entity.InvTypeFk });
			if (invType?.Isprogress) {
				const companydeferaltypes = this.deferalTypeLookupService.cache.getList();
				const companydeferaltype = companydeferaltypes.find((x) => x.BasCompanyFk === entity.CompanyFk && x.IsDefault);
				if (companydeferaltype) {
					this.validateCompanyDeferalTypeFk({ entity: entity, value: companydeferaltype.Id, field: 'CompanyDeferalTypeFk' });
				}
			} else {
				entity.CompanyDeferalTypeFk = null;
				entity.DateDeferalStart = null;
			}

			if (invType) {
				const sumChainInvoiceObj = await this.sumChainInvoiceObj(value);
				entity.TotalPerformedGross = this.calculationService.roundTo(math.bignumber(entity.AmountGross).add(sumChainInvoiceObj.Gross));
				entity.TotalPerformedNet = this.calculationService.roundTo(math.bignumber(entity.AmountNet).add(sumChainInvoiceObj.Net));
			}
		}
		this.dataService.readonlyProcessor.process(entity);
		this.dataService.generateNarrative(entity);
		this.dataService.setModified(entity);

		return this.validationUtils.createSuccessObject();
	}

	private async asyncValidateCode(info: ValidationInfo<IInvHeaderEntity>) {
		return this.validationUtils.isAsyncUnique(info, 'procurement/invoice/header/iscodeunique', 'procurement.invoice.header.code').then((response) => {
			const entityValue = get(info.entity, info.field);
			if (!entityValue && isObject(response)) {
				response.apply = true;
			}
			return response;
		});
	}

	private async asyncValidateBusinessPartnerFk(info: ValidationInfo<IInvHeaderEntity>, pointedSupplierFk?: number | null, pointedSubsidiaryFk?: number | null) {
		const entity = info.entity;
		const validateRes = this.validateIsMandatory(info);
		if (!validateRes.valid) {
			return validateRes;
		}
		const value = info.value as number;

		this.businessPartnerValidatorService.resetArgumentsToValidate();
		if (isNil(pointedSupplierFk)) {
			pointedSupplierFk = undefined;
		}
		if (isNil(pointedSubsidiaryFk)) {
			pointedSubsidiaryFk = undefined;
		}
		await this.businessPartnerValidatorService.businessPartnerValidator({ entity, value, needAttach: true, notNeedLoadDefaultSubsidiary: false, pointedSupplierFk, pointedSubsidiaryFk });
		this.dataService.generateDescription(entity, { bpFk: value }).then((description) => {
			entity.Description = description;
			this.dataService.setModified(entity);
		});
		if (entity.Reference) {
			await this.checkReferenceUnique(info, entity.InvStatusFk, entity.Reference, entity.SupplierFk, value);
		}
		return this.validationUtils.createSuccessObject();
	}

	private async asyncValidateSupplierFk(info: ValidationInfo<IInvHeaderEntity>, dontSetPaymentTerm?: boolean) {
		const entity = info.entity;
		const value = info.value as number;
		this.businessPartnerValidatorService.resetArgumentsToValidate();
		await this.businessPartnerValidatorService.supplierValidator(info.entity, info.value as number, dontSetPaymentTerm);
		if (entity.Reference) {
			await this.checkReferenceUnique(info, entity.InvStatusFk, entity.Reference, entity.SupplierFk, value);
		}
		return this.validationUtils.createSuccessObject();
	}

	private async validateBasAccassignConTypeFk(info: ValidationInfo<IInvHeaderEntity>) {
		if (!info.value) {
			return this.validationUtils.createSuccessObject();
		}
		const value = info.value as number;
		const entity = info.entity;
		const accountType = this.accountConTypeLookup.cache.getItem({ id: value });
		entity.IsInvAccountChangeable = accountType && accountType.IsCreateInvaccount ? accountType.IsCreateInvaccount : false;

		entity.BasAccassignConTypeFk = value;
		//todo: after InvoiceAccountAssignment container ready, should subscribe this event this.parentService.entityProxy.propertyChanged$
		return this.validationUtils.createSuccessObject();
	}

	private validateReferenceStructured(info: ValidationInfo<IInvHeaderEntity>) {
		return this.referenceStructuredValidationService.validationReferenceStructured(info.value as string);
	}

	private async validateProgressId(info: ValidationInfo<IInvHeaderEntity>) {
		if (!info.value) {
			return this.validationUtils.createSuccessObject();
		}
		const entity = info.entity;
		const value = info.value as number;
		if (entity.ConHeaderFk !== null) {
			this.getProgressUniqueByContract(entity, entity.ProgressId, entity.ConHeaderFk, false, entity.Id);
		} else {
			const description = await this.dataService.generateDescription(entity, { progressId: value });
			entity.Description = description;
			this.dataService.setModified(entity);
		}
		return this.validationUtils.createSuccessObject();
	}

	private validateDateDiscount(info: ValidationInfo<IInvHeaderEntity>) {
		const entity = info.entity;
		const value = info.value as Date;

		if (!isNil(entity.DateNetPayable)) {
			const dateNetPayable = info.entity.DateNetPayable ? zonedTimeToUtc(info.entity.DateNetPayable, 'UTC') : null;
			if (dateNetPayable && dateNetPayable < value) {
				return this.validationUtils.createErrorObject({ key: 'procurement.invoice.error.dateNetPayableError' });
			}
		}
		return this.validationUtils.createSuccessObject();
	}

	private validateDateNetPayable(info: ValidationInfo<IInvHeaderEntity>) {
		const entity = info.entity;
		const validateRes = this.validateIsMandatory(info);
		if (!validateRes.valid) {
			return validateRes;
		}

		const value = info.value as Date;
		if (!isNil(entity.DateDiscount)) {
			const dateDiscount = info.entity.DatePosted ? zonedTimeToUtc(info.entity.DatePosted, 'UTC') : null;
			if (dateDiscount && dateDiscount > value) {
				return this.validationUtils.createErrorObject({ key: 'procurement.invoice.error.dateNetPayableError' });
			}
		}
		return validateRes;
	}

	private validatePaymentHint(info: ValidationInfo<IInvHeaderEntity>) {
		let value = info.value as string;
		const result = { apply: true, valid: true, error: '' };

		if (value) {
			const userRegex = /^[A-Za-z]+$/;
			if (!userRegex.test(value) || value.length > 3) {
				result.valid = false;
			} else {
				value = value.toUpperCase();
				info.entity.PaymentHint = value;
			}
		}

		if (!result.valid) {
			result.error = this.translationService.instant('procurement.invoice.error.paymentHintError').text;
		}

		return result;
	}

	private async validateDateInvoiced(info: ValidationInfo<IInvHeaderEntity>) {
		const entity = info.entity;
		const result = this.validateIsMandatory(info);
		if (!result.valid) {
			return result;
		}
		await this.dataService.setDateDiscount(entity, false, entity.PaymentTermFk);
		return this.validationUtils.createSuccessObject();
	}

	private validateDatePosted(info: ValidationInfo<IInvHeaderEntity>) {
		return this.validateIsMandatory(info);
	}

	private async validateDateReceived(info: ValidationInfo<IInvHeaderEntity>) {
		const result = this.validateIsMandatory(info);
		if (!result.valid) {
			return result;
		}
		const entity = info.entity;
		await this.dataService.setDateDiscount(entity, false, entity.PaymentTermFk);
		return this.validationUtils.createSuccessObject();
	}

	private async asyncValidateReference(info: ValidationInfo<IInvHeaderEntity>) {
		const validateRes = this.validateIsMandatory(info);
		if (!validateRes.valid) {
			return validateRes;
		}

		const entity = info.entity;
		const value = info.value as string;

		if (entity.SupplierFk || entity.BusinessPartnerFk) {
			const isUnique = await this.checkReferenceUnique(info, entity.InvStatusFk, value, entity.SupplierFk, entity.BusinessPartnerFk);
			if (!isUnique) {
				return this.validationUtils.createErrorObject({
					key: 'procurement.invoice.header.referenceNotUnique',
					params: { fieldName: this.translationService.instant('procurement.invoice.header.reference') },
				});
			}
		}

		return this.validationUtils.createSuccessObject();
	}

	private validateCurrencyFk(info: ValidationInfo<IInvHeaderEntity>) {
		return this.currencyExchangeRateService.validateCurrencyFk(info, info.entity.ProjectFk);
	}

	private async validateExchangeRate(info: ValidationInfo<IInvHeaderEntity>) {
		return this.currencyExchangeRateService.validateExchangeRate(info);
	}

	private async validateAmountGross(info: ValidationInfo<IInvHeaderEntity>, amountGrossOc?: number) {
		const validateRes = this.validateIsMandatory(info);
		if (!validateRes.valid) {
			return validateRes;
		}

		const entity = info.entity;
		const value = info.value as number;
		entity.AmountGross = value;
		entity.AmountGrossOc = amountGrossOc ?? this.dataService.convertToNonOc(value, entity.ExchangeRate);

		const vatPercent = this.dataService.getVatPercentWithTaxCodeMatrix(entity.TaxCodeFk);
		entity.AmountNetOc = this.dataService.calculateNetFromGross(entity.AmountGrossOc, vatPercent);
		entity.AmountVatOc = this.calculationService.roundTo(math.bignumber(entity.AmountGrossOc).sub(entity.AmountNetOc));
		entity.AmountNet = this.dataService.convertToNonOc(entity.AmountNetOc, entity.ExchangeRate);
		entity.AmountVat = this.calculationService.roundTo(math.bignumber(entity.AmountGross).sub(entity.AmountNet));

		const sumChainInvoices = await this.sumChainInvoice('Net', entity.InvTypeFk, entity.Id);
		entity.TotalPerformedNet = this.calculationService.roundTo(math.bignumber(entity.AmountNet).add(sumChainInvoices));
		const sumGrossChainInvoices = await this.sumChainInvoice('Gross', entity.InvTypeFk, entity.Id);
		entity.TotalPerformedGross = this.calculationService.roundTo(math.bignumber(entity.AmountGross).add(sumGrossChainInvoices));

		this.dataService.updateDiscountBasics(entity);
		this.dataService.recalculateAmountBalance(entity);

		this.dataService.setModified(entity);

		return validateRes;
	}

	private async validateAmountGrossOc(info: ValidationInfo<IInvHeaderEntity>) {
		const validateRes = this.validateIsMandatory(info);
		if (!validateRes.valid) {
			return validateRes;
		}
		const entity = info.entity;
		const value = info.value as number;
		entity.AmountGross = this.dataService.convertToNonOc(value, entity.ExchangeRate);

		const validationInfo = new ValidationInfo(entity, entity.AmountGross, 'AmountGross');
		return this.validateAmountGross(validationInfo);
	}

	private async validateTotalPerformedGross(info: ValidationInfo<IInvHeaderEntity>) {
		const entity = info.entity;
		const value = info.value as number;

		const sumChainInvoices = await this.sumChainInvoice('Gross', entity.InvTypeFk, entity.Id);
		entity.AmountGross = this.calculationService.roundTo(math.bignumber(value).sub(sumChainInvoices));
		this.dataService.setModified(entity);

		const validationInfo = new ValidationInfo(entity, entity.AmountGross, 'AmountGross');
		return this.validateAmountGross(validationInfo);
	}

	private async validateTotalPerformedNet(info: ValidationInfo<IInvHeaderEntity>) {
		const entity = info.entity;
		const value = info.value as number;

		entity.TotalPerformedNet = value;
		this.dataService.recalculateAmountBalance(entity);
		const sumChainInvoices = await this.sumChainInvoice('Net', entity.InvTypeFk, entity.Id);
		entity.AmountNet = this.calculationService.roundTo(math.bignumber(value).sub(sumChainInvoices));
		this.dataService.setModified(entity);

		const validationInfo = new ValidationInfo(entity, entity.AmountNet, 'AmountNet');
		return this.validateAmountNet(validationInfo);
	}

	private async validateAmountNet(info: ValidationInfo<IInvHeaderEntity>, amountNetOc?: number) {
		const validateRes = this.validateIsMandatory(info);
		if (!validateRes.valid) {
			return validateRes;
		}

		const entity = info.entity;
		const value = info.value as number;

		entity.AmountNet = value;
		entity.AmountVat = this.calculationService.roundTo(math.bignumber(entity.AmountGross).sub(entity.AmountNet));

		entity.AmountNetOc = amountNetOc ?? this.dataService.convertToOc(entity.AmountNet, entity.ExchangeRate);
		entity.AmountVatOc = this.calculationService.roundTo(math.bignumber(entity.AmountGrossOc).sub(entity.AmountNetOc));

		const sumChainInvoices = await this.sumChainInvoice('Net', entity.InvTypeFk, entity.Id);
		entity.TotalPerformedNet = this.calculationService.roundTo(math.bignumber(value).add(sumChainInvoices));

		this.dataService.updateDiscountBasics(entity);
		this.dataService.recalculateAmountBalance(entity);

		this.dataService.setModified(entity);

		return validateRes;
	}

	private validateAmountDiscount(info: ValidationInfo<IInvHeaderEntity>) {
		const validateRes = this.validateIsMandatory(info);
		if (!validateRes.valid) {
			return validateRes;
		}
		const entity = info.entity;
		const value = info.value as number;

		entity.AmountDiscountOc = this.dataService.convertToOc(value, entity.ExchangeRate);
		return validateRes;
	}

	private validateAmountDiscountOc(info: ValidationInfo<IInvHeaderEntity>) {
		const validateRes = this.validateIsMandatory(info);
		if (!validateRes.valid) {
			return validateRes;
		}
		const entity = info.entity;
		const value = info.value as number;

		entity.AmountDiscount = this.dataService.convertToNonOc(value, entity.ExchangeRate);
		return validateRes;
	}

	private async validateAmountNetOc(info: ValidationInfo<IInvHeaderEntity>, amountNetOc?: number) {
		const validateRes = this.validateIsMandatory(info);
		if (!validateRes.valid) {
			return validateRes;
		}

		const entity = info.entity;
		const value = info.value as number;

		entity.AmountNetOc = value;
		entity.AmountVatOc = this.calculationService.roundTo(math.bignumber(entity.AmountGrossOc).sub(entity.AmountNetOc));
		// AMOUNT_NET has to be updated (AMOUNT_NET_OC / EXCHANGE_RATE)
		entity.AmountNet = this.dataService.convertToNonOc(entity.AmountNetOc, entity.ExchangeRate);
		entity.AmountVat = this.calculationService.roundTo(math.bignumber(entity.AmountGross).sub(entity.AmountNet));

		const validationInfo = new ValidationInfo(entity, entity.AmountNet, 'AmountNet');
		this.validateAmountNet(validationInfo, value);

		this.dataService.recalculateAmountBalance(entity);
		this.dataService.setModified(entity);

		return validateRes;
	}

	private async validateAmountDiscountBasis(info: ValidationInfo<IInvHeaderEntity>) {
		const validateRes = this.validateIsMandatory(info);
		if (!validateRes.valid) {
			return validateRes;
		}
		const entity = info.entity;
		const value = info.value as number;

		entity.AmountDiscountBasisOc = this.dataService.convertToOc(value, entity.ExchangeRate);
		this.dataService.recalculateAmountDiscount(entity);
		return validateRes;
	}

	private async validateAmountDiscountBasisOc(info: ValidationInfo<IInvHeaderEntity>) {
		const validateRes = this.validateIsMandatory(info);
		if (!validateRes.valid) {
			return validateRes;
		}
		const entity = info.entity;
		const value = info.value as number;

		entity.AmountDiscountBasis = this.dataService.convertToNonOc(value, entity.ExchangeRate);
		this.dataService.recalculateAmountDiscount(entity);
		return validateRes;
	}

	protected validateProjectFk(info: ValidationInfo<IInvHeaderEntity>): Promise<ValidationResult> | ValidationResult {
		const entity = info.entity;
		const newValue = info.value as number;

		if (!entity || entity.ProjectFk === newValue) {
			return this.validationUtils.createSuccessObject();
		}
		entity.ProjectFk = newValue;

		this.updateClerkByProject(entity, newValue);
		this.updateProjectStatus(entity, newValue);
		this.dataService.readonlyProcessor.process(entity);

		if (!info.value) {
			entity.ControllingUnitFk = undefined;
			entity.ProjectFk = newValue;
			return this.validationUtils.createSuccessObject();
		}

		this.copyCertificatesFromProject(entity, newValue);
		this.dataService.generateDescription(entity);
		this.dataService.setModified(entity);

		return this.validationUtils.createSuccessObject();
	}

	private async validatePrcPackageFk(info: ValidationInfo<IInvHeaderEntity>) {
		const entity = info.entity;
		const value = info.value as number;
		const proxy = this.dataService.entityProxy.apply(entity);

		if (value) {
			const prcPackage = await firstValueFrom(this.prcPackageLookupService.getItemByKey({ id: value }));
			if (prcPackage) {
				proxy.ProjectFk = prcPackage.ProjectFk;
			}
		}

		return this.validationUtils.createSuccessObject();
	}

	private validateControllingUnitFk(info: ValidationInfo<IInvHeaderEntity>) {
		const entity = info.entity;
		const value = info.value as number;
		if (entity.InvStatusFk) {
			const status = this.statusLookupService.cache.getItem({ id: entity.InvStatusFk });
			if (status && status.ToBeVerifiedBL && !value) {
				const validationInfo = new ValidationInfo(entity, entity.ControllingUnitFk ?? undefined, 'ControllingUnitFk');
				this.validateIsMandatory(validationInfo);
			}
		}
		entity.ControllingUnitFk = value;
		this.dataService.setModified(entity);
		return this.validationUtils.createSuccessObject();
	}

	private async validatePrcStructureFk(info: ValidationInfo<IInvHeaderEntity>, isFromConHeader?: boolean) {
		const entity = info.entity;
		const value = info.value as number;
		if (entity.InvStatusFk) {
			const status = this.statusLookupService.cache.getItem({ id: entity.InvStatusFk });
			if (status && status.ToBeVerifiedBL && !value) {
				const validationInfo = new ValidationInfo(entity, entity.PrcStructureFk ?? undefined, 'PrcStructureFk');
				return this.validateIsMandatory(validationInfo);
			}
		}
		if (isFromConHeader) {
			this.validationUtils.createSuccessObject();
		}

		if (value) {
			const taxCodeFk = await this.http.get<number>('basics/procurementstructure/taxcode/getTaxCodeByStructure', { params: { structureId: value } });
			if (taxCodeFk) {
				entity.TaxCodeFk = taxCodeFk;
				this.validateTaxCodeFk({ entity, value: taxCodeFk, field: 'TaxCodeFk' });
			}

			this.dataService.setModified(entity);
		}

		if (!value || entity.Description) {
			this.updateClerkByProject(entity, entity.ProjectFk);
		}
		return this.validationUtils.createSuccessObject();
	}

	private async validateTaxCodeFk(info: ValidationInfo<IInvHeaderEntity>) {
		const result = this.validationUtils.createSuccessObject();
		const entity = info.entity;
		const value = info.value as number;
		this.validateIsMandatory({ entity, value: value, field: 'TaxCodeFk' });

		if (!entity || !value) {
			return result;
		}
		if (entity.TaxCodeFk !== value) {
			entity.TaxCodeFk = value;
			await this.recalculateAmountAfChangeVatPercent(entity);
		}
		return result;
	}

	private async validatePesHeaderFk(info: ValidationInfo<IInvHeaderEntity>) {
		const entity = info.entity;
		const value = info.value as number;
		if (!value) {
			this.dataService.readonlyProcessor.process(entity);
			return this.validationUtils.createSuccessObject();
		}

		entity.PesHeaderFk = value;
		const invoicePes = await firstValueFrom(this.pesLookupService.getItemByKey({ id: value }));
		if (invoicePes && invoicePes.SalesTaxMethodFk) {
			entity.SalesTaxMethodFk = invoicePes.SalesTaxMethodFk;
			if (invoicePes.ConHeaderFk) {
				entity.ConHeaderFk = invoicePes.ConHeaderFk;
				const conHeaderView = await firstValueFrom(this.contractLookupService.getItemByKey({ id: invoicePes.ConHeaderFk }));
				if (conHeaderView) {
					entity.ConHeaderFk = conHeaderView.ConHeaderFk && !conHeaderView.ProjectChangeFk ? conHeaderView.ConHeaderFk : entity.ConHeaderFk;
					if (!isNil(entity.ConHeaderFk)) {
						await this.validateConHeaderFk({ entity, value: entity.ConHeaderFk, field: 'ConHeaderFk' });
						this.dataService.autoCreateInvoiceToPES$.next(value);
					}
				}
			} else {
				if (entity.Id) {
					this.dataService.autoCreateInvoiceToPES$.next(value);
				}
			}
		}

		return this.validationUtils.createSuccessObject();
	}

	private checkReferenceUnique(info: ValidationInfo<IInvHeaderEntity>, invStatusFk: number, reference: string, supplierFk?: number | null, bpFk?: number | null) {
		return this.validationUtils
			.checkAsyncUnique(info, 'procurement/invoice/header/isreferenceunique', {
				additionalHttpParams: { id: info.entity.Id, code: info.entity.Code, reference: info.entity.Reference, supplierFk: supplierFk ?? 0, businessPartnerFk: bpFk ?? 0, invStatusFk: invStatusFk },
			})
			.then((response) => {
				const dto = new MainDataDto<IInvHeaderEntity>(response);
				const entities = dto.main;
				const errStr = dto.getValueAs<string>('error');
				if (entities.length > 0 && errStr !== undefined) {
					return this.showReferenceDialog(entities, errStr);
				}
				return true;
			});
	}

	private async showReferenceDialog(entities: IInvHeaderEntity[], errorMessage: string): Promise<boolean> {
		const gridDialogData: IGridDialogOptions<IInvHeaderEntity> = {
			width: '40%',
			headerText: 'procurement.invoice.header.headerReference',
			topDescription: errorMessage,
			windowClass: 'grid-dialog',
			gridConfig: {
				uuid: '6aa7827907d9439d99c6dcda4bbd897e',
				columns: [
					{
						type: FieldType.Integer,
						id: 'Id',
						required: true,
						model: 'Id',
						label: 'Id',
						visible: false,
						sortable: false,
					},
					{
						type: FieldType.DateUtc,
						id: 'DateReceived',
						model: 'DateReceived',
						label: {
							text: 'Date Received',
							key: 'procurement.invoice.header.dateReceived',
						},
						visible: true,
						sortable: true,
						width: 125,
					},
					{
						type: FieldType.Code,
						id: 'code',
						model: 'Code',
						label: {
							text: 'Code',
							key: 'cloud.common.entityCode',
						},
						visible: true,
						sortable: true,
						width: 125,
					},
					{
						type: FieldType.Description,
						id: 'desc',
						model: 'Description',
						label: {
							text: 'Description',
							key: 'cloud.common.entityDescription',
						},
						visible: true,
						sortable: true,
						width: 125,
					},
				],
				idProperty: 'Id',
			},
			items: entities,
			isReadOnly: true,
			selectedItems: [],
			resizeable: true,
		};

		await this.gridDialogService.show(gridDialogData);
		return true;
	}

	private async onValidateBillingSchemaFk(entity: IInvHeaderEntity, value: number, fireEvent: boolean) {
		const validationInfo = new ValidationInfo(entity, entity.BillingSchemaFk, 'BillingSchemaFk');
		const validateResult = this.validateIsMandatory(validationInfo);
		this.applyValidationResult(validateResult, entity, 'BillingSchemaFk');

		const oldBillingSchema = await firstValueFrom(this.billingSchemaLookupService.getItemByKey({ id: entity.BillingSchemaFk }));
		let oldIsChained = false;
		if (oldBillingSchema) {
			oldIsChained = oldBillingSchema.IsChained;
		}

		const newBillingSchema = await firstValueFrom(this.billingSchemaLookupService.getItemByKey({ id: value }));
		if (newBillingSchema) {
			this.setProgressAndDescriptionByBillingScheme(entity);
			entity.BillSchemeIsChained = newBillingSchema.IsChained;
		}
		if (entity.ConHeaderFk && fireEvent) {
			this.dataService.autoCreateChainedInvoice$.next({ conHeaderId: entity.ConHeaderFk });
		}
		if (oldIsChained !== newBillingSchema.IsChained) {
			this.dataService.recalculateAmountBalance(entity);
		}
	}

	private async validatePaymentTermFk(info: ValidationInfo<IInvHeaderEntity>) {
		const entity = info.entity;
		await this.dataService.setDateDiscount(entity, true, entity.PaymentTermFk);
		return this.validationUtils.createSuccessObject();
	}

	private async validateBankFk(info: ValidationInfo<IInvHeaderEntity>) {
		const entity = info.entity;
		if (!info.value) {
			entity.BankFk = null;
			entity.BpdBankTypeFk = null;
		}

		const value = info.value as number;
		if (value) {
			const bank = await firstValueFrom(this.bankLookupService.getItemByKey({ id: value }));
			entity.BankFk = value;
			entity.BpdBankTypeFk = bank.BankTypeFk;
		}
		return this.validationUtils.createSuccessObject();
	}

	private validatePercentDiscount(info: ValidationInfo<IInvHeaderEntity>) {
		if (!info.value) {
			const entity = info.entity;
			const value = info.value as number;
			entity.PercentDiscount = value;
			this.dataService.recalculateAmountDiscount(entity);
			this.dataService.setModified(entity);
		}
		return this.validationUtils.createSuccessObject();
	}

	private validateCompanyDeferalTypeFk(info: ValidationInfo<IInvHeaderEntity>) {
		const result = this.validationUtils.createSuccessObject();
		const entity = info.entity;
		if (!info.value) {
			entity.DateDeferalStart = null;
			entity.CompanyDeferalTypeFk = null;
			this.dataService.setModified(entity);
			this.validateDateDeferalStart({ entity: entity, value: entity.DateDeferalStart ?? undefined, field: 'DateDeferalStart' });
			return result;
		}

		const value = info.value as number;
		const companydeferaltype = this.deferalTypeLookupService.cache.getItem({ id: value });
		entity.CompanyDeferalTypeFk = companydeferaltype?.Id;
		if (companydeferaltype && companydeferaltype.IsStartDateMandatory && !isNil(entity.DatePosted)) {
			const datePosted = info.entity.DatePosted ? zonedTimeToUtc(info.entity.DatePosted, 'UTC') : null;
			if (datePosted) {
				const currentYear = datePosted.getFullYear();
				const currentMonth = datePosted.getMonth() + 1;
				const lastDate = new Date(currentYear, currentMonth, 0).getDate();
				entity.DateDeferalStart = new Date(currentYear, currentMonth - 1, lastDate).toISOString();
			}
		} else {
			entity.DateDeferalStart = null;
		}

		this.validateDateDeferalStart({ entity: entity, value: entity.DateDeferalStart ?? undefined, field: 'DateDeferalStart' });
		return result;
	}

	private async validateDateDeferalStart(info: ValidationInfo<IInvHeaderEntity>) {
		const entity = info.entity;
		const value = info.value as string;
		if (entity.CompanyDeferalTypeFk) {
			const companydeferaltype = this.deferalTypeLookupService.cache.getItem({ id: entity.CompanyDeferalTypeFk });
			if (companydeferaltype && companydeferaltype.IsStartDateMandatory && !value) {
				return new ValidationResult('cloud.common.emptyOrNullValueErrorMessage');
			}
		}
		return this.validationUtils.createSuccessObject();
	}

	private validateBpdVatGroupFk(info: ValidationInfo<IInvHeaderEntity>) {
		const validateRes = this.validateIsMandatory(info);
		if (!validateRes.valid) {
			return validateRes;
		}

		const entity = info.entity;
		const value = info.value as number;
		if (entity.BpdVatGroupFk !== value) {
			entity.BpdVatGroupFk = value;
			this.dataService.setModified(entity);
			this.dataService.vatGroupChanged$.next(value);
		}
		return validateRes;
	}

	private async validateConHeaderFk(info: ValidationInfo<IInvHeaderEntity>) {
		const result = this.validationUtils.createSuccessObject();
		const entity = info.entity;
		const value = info.value as number;
		if (!value) {
			this.clearConHeaderFk(entity, value);
			return result;
		}

		const conHeaderView = await firstValueFrom(this.contractLookupService.getItemByKey({ id: value }));
		if (isNil(conHeaderView)) {
			return result;
		}
		entity.ConHeaderFk = value;
		if (conHeaderView.PrcConfigHeaderFk) {
			const configRequest = new LookupSearchRequest('', []);
			configRequest.additionalParameters = {
				PrcConfigHeaderFk: conHeaderView.PrcConfigHeaderFk,
				RubricFk: Rubric.Invoices,
			};
			const config = await firstValueFrom(this.configurationLookupService.getSearchList(configRequest));
			const prcConfigurations = config.items;
			if (prcConfigurations.length > 0 && !isNil(conHeaderView)) {
				this.dataService.readonlyProcessor.process(entity);
				this.handleConHeaderFk(entity, conHeaderView, value);
				if (!isNil(conHeaderView.MdcBillingSchemaFk)) {
					this.setPrcConfigFkAndBillingSchemaFk(entity, this.getDefaultConfigId(prcConfigurations), conHeaderView.MdcBillingSchemaFk, prcConfigurations).then(() => {
						this.dataService.updatePaymentTermFkAndRelatedProperties(entity, conHeaderView);
						this.dataService.autoCreateChainedInvoice$.next({ conHeaderId: value, businessPartnerFk: entity.BusinessPartnerFk ?? undefined });
						this.dataService.onCopyInvGenerals$.next({ PrcHeaderId: conHeaderView.PrcHeaderId, Code: conHeaderView.Code, Description: conHeaderView.Description });
					});
				}
			} else {
				this.clearConHeaderFk(entity, undefined);
				this.dataService.msgDialogService.showMsgBox('procurement.invoice.error.noConfiguration', '', 'ico-error');
				return { apply: false, valid: true, error: '' };
			}
		} else {
			this.handleConHeaderFk(entity, conHeaderView, value);
			this.validateProgressId({ entity: entity, value: entity.ProgressId, field: 'ProgressId' });
			this.dataService.updatePaymentTermFkAndRelatedProperties(entity, conHeaderView);
			this.dataService.autoCreateChainedInvoice$.next({ conHeaderId: value, businessPartnerFk: entity.BusinessPartnerFk ?? undefined });
			this.dataService.onCopyInvGenerals$.next({ PrcHeaderId: conHeaderView.PrcHeaderId, Code: conHeaderView.Code, Description: conHeaderView.Description });
		}
		return result;
	}

	private async updatePaymentTermFkBySupplier(entity: IInvHeaderEntity, supplier?: ISupplierEntity) {
		const invType = this.invTypeLookupService.cache.getItem({ id: entity.InvTypeFk });
		if (!invType || isNil(supplier)) {
			return true;
		}

		if (!entity.ConHeaderFk && entity.PrcConfigurationFk) {
			const supplierCompanyEntities = await this.http.get<ISupplierCompanyEntity[]>('businesspartner/main/suppliercompany/list', { params: { mainItemId: supplier.Id } });
			const companyId = this.companyContext.loginCompanyEntity.Id;
			const suppliersWithSameCompany = supplierCompanyEntities.filter((e) => e.BasCompanyFk === companyId).sort((a, b) => a.Id - b.Id);

			if (suppliersWithSameCompany.length > 0) {
				const supplierCompany = suppliersWithSameCompany[0];
				entity.PaymentTermFk = invType.Isprogress ? supplierCompany.BasPaymentTermPaFk ?? supplier.PaymentTermPaFk : supplierCompany.BasPaymentTermFiFk ?? supplier.PaymentTermFiFk;
				entity.BasPaymentMethodFk = supplierCompany.BasPaymentMethodFk ?? supplier.BasPaymentMethodFk;
			} else {
				entity.PaymentTermFk = invType.Isprogress ? supplier.PaymentTermPaFk : supplier.PaymentTermFiFk;
				entity.BasPaymentMethodFk = supplier.BasPaymentMethodFk;
			}
			this.dataService.setModified(entity);
			if (!isNil(entity.PaymentTermFk)) {
				await this.validatePaymentTermFk({ entity, value: entity.PaymentTermFk, field: 'PaymentTermFk' });
			}
		}
		return true;
	}

	private updatePaymentTermFkByPrcConfiguration(entity: IInvHeaderEntity, config: ProcurementConfigurationEntity) {
		const invType = this.invTypeLookupService.cache.getItem({ id: entity.InvTypeFk });
		if (!invType) {
			return;
		}

		if (!entity.ConHeaderFk && !entity.SupplierFk) {
			const paymentTermFk = invType.Isprogress ? config.PaymentTermPaFk : config.PaymentTermFiFk;
			if (paymentTermFk) {
				this.validatePaymentTermFk({ entity, value: paymentTermFk, field: 'PaymentTermFk' }).then(() => {
					entity.PaymentTermFk = paymentTermFk;
					this.dataService.setModified(entity);
				});
			}
		}
	}

	private getDefaultConfigId(items: ProcurementConfigurationEntity[]): number {
		const defaultConfig = items.find((e) => e.IsDefault);
		return defaultConfig?.Id ?? items[0]?.Id;
	}

	private hasSameProgressType(value: number, newValue: number) {
		const oldInvType = this.invTypeLookupService.cache.getItem({ id: value });
		const newInvType = this.invTypeLookupService.cache.getItem({ id: newValue });
		return oldInvType?.Isprogress === newInvType?.Isprogress;
	}

	private async setProgressAndDescriptionByBillingScheme(entity: IInvHeaderEntity) {
		const billingSchemaFk = entity.BillingSchemaFk;
		const bilSchemaConfig = await firstValueFrom(this.prcConfig2BSchemaLookupService.getItemByKey({ id: billingSchemaFk }));
		if (!billingSchemaFk) {
			return false;
		}

		const isChained = bilSchemaConfig.IsChained;
		if (isChained) {
			const conHeaderFk = entity.ConHeaderFk;
			if (!entity.ProgressId) {
				entity.ProgressId = 1;
			}
			if (conHeaderFk) {
				this.getProgressUniqueByContract(entity, entity.ProgressId, conHeaderFk, true, entity.Id);
			}
		} else {
			entity.ProgressId = 0;
		}
		this.dataService.readonlyProcessor.process(entity);
		return true;
	}

	private async getProgressUniqueByContract(entity: IInvHeaderEntity, progressId?: number, contractId?: number, changeFlag?: boolean, invoiceId?: number) {
		if (!contractId) {
			return false;
		}
		let params = new HttpParams().set('conFk', contractId);
		if (progressId) {
			params = params.set('progressId', progressId);
		}
		if (changeFlag) {
			params = params.set('changeFlg', changeFlag);
		}

		const newProgressId = await this.http.get<number>('procurement/invoice/header/getProgressIdUniqueByContract', { params });

		if (newProgressId !== progressId) {
			const conHeaderView = await firstValueFrom(this.contractLookupService.getItemByKey({ id: contractId }));
			entity.ProgressId = newProgressId;

			const description = await this.dataService.generateDescription(entity);
			entity.Description = description;

			this.dataService.setModified(entity);

			const warningMessage = this.translationService.instant('procurement.invoice.warning.progressIdByWarning', {
				conFk: conHeaderView.Code,
				progressId,
				resetProgressId: newProgressId,
			}).text;
			const title = 'procurement.invoice.warning.warning';
			this.messageBoxService.showMsgBox(warningMessage, title, 'ico-warning');
		} else {
			entity.ProgressId = progressId;
			const description = await this.dataService.generateDescription(entity);
			entity.Description = description;
			this.dataService.setModified(entity);
		}

		return true;
	}

	private setDefaultInvType(entity: IInvHeaderEntity, rubricCategoryFk: number, invTypeFk?: number, isFromWizard?: boolean): void {
		const needUpdate = entity.RubricCategoryFk === rubricCategoryFk;
		const fireEvent = isFromWizard ?? false;
		if (needUpdate) {
			const validationInfo = new ValidationInfo(entity, invTypeFk ?? entity.InvTypeFk, 'InvTypeFk');
			this.validateInvTypeFk(validationInfo, fireEvent);
		}
		this.dataService.generateDescription(entity).then((description) => {
			entity.Description = description;
			this.dataService.setModified(entity);
		});
	}

	private async applyBillingSchema(entity: IInvHeaderEntity, fireEvent: boolean, billingSchema: IBillingSchemaEntity, isFromWizard: boolean) {
		if (!billingSchema) {
			return true;
		}

		await this.onValidateBillingSchemaFk(entity, billingSchema.Id, fireEvent);
		entity.BillingSchemaFk = billingSchema.Id;

		if (entity.ConHeaderFk && (fireEvent || isFromWizard)) {
			this.dataService.autoCreateChainedInvoice$.next({ conHeaderId: entity.ConHeaderFk });
		}
		this.dataService.setModified(entity);
		return true;
	}

	private async reloadBillingSchema(entity: IInvHeaderEntity, fireEvent: boolean, forceReload: boolean, isKeeping: boolean) {
		if (!entity?.PrcConfigurationFk) {
			return true;
		}

		if (isKeeping) {
			const schemas = await this.getDefaultBillingSchemas(entity.PrcConfigurationFk);
			const target = schemas.find((e) => e.Id === entity.BillingSchemaFk) as IBillingSchemaEntity;
			if (target) {
				await this.applyBillingSchema(entity, fireEvent, target, false);
			}
		}

		return true;
	}

	private async onPrcConfigurationFk(entity: IInvHeaderEntity, value: number, fireEvent: boolean, keepBillingSchemaFK: boolean, dataList?: ProcurementConfigurationEntity[], updatekeepBillingSchemaFK?: boolean): Promise<boolean> {
		if (!value) {
			return true;
		}

		const include = dataList?.find((e) => e.PrcConfigHeaderFk === value);

		if (entity.PrcConfigurationFk === value || include !== undefined) {
			return true;
		}

		entity.PrcConfigurationFk = value;
		const config = await firstValueFrom(this.configurationLookupService.getItemByKey({ id: entity.PrcConfigurationFk }));

		if (entity.RubricCategoryFk !== config.RubricCategoryFk) {
			entity.RubricCategoryFk = config.RubricCategoryFk;
			const params = {
				invTypeFk: entity.InvTypeFk,
				repalceRubricCategoryFk: config.RubricCategoryFk,
			};
			const invoiceType = await this.http.get<IInvoiceTypeInfo>('procurement/invoice/header/defaultrubriccategory', { params });

			if (invoiceType) {
				this.setDefaultInvType(entity, entity.RubricCategoryFk, invoiceType.invTypeFk);

				if (dataList) {
					const messageKey = invoiceType.IsAccordance ? 'procurement.invoice.warning.configurationWarnning' : 'procurement.invoice.warning.bothWarnning';
					await this.messageBoxService.showMsgBox(messageKey, '', 'ico-warning');
				}
			} else {
				this.setDefaultInvType(entity, entity.RubricCategoryFk);
			}
		} else if (dataList !== undefined) {
			await this.messageBoxService.showMsgBox('procurement.invoice.warning.configurationWarnning', '', 'ico-warning');
		}

		if (!entity.Code || entity.Version === 0) {
			entity.Code = this.dataService.getNumberDefaultText(entity);
			this.validateEmptyCode(entity);
		}

		if (!keepBillingSchemaFK) {
			await this.reloadBillingSchema(entity, fireEvent, true, true);
			if (updatekeepBillingSchemaFK === false) {
				this.dataService.billingSchemaChanged$.next(entity.BillingSchemaFk);
			}
		}

		if (keepBillingSchemaFK && updatekeepBillingSchemaFK === false) {
			this.dataService.billingSchemaChanged$.next(entity.BillingSchemaFk);
		}

		return true;
	}

	private async getDefaultBillingSchemas(prcConfigurationFk: number) {
		const params = {
			configurationFk: prcConfigurationFk,
		};

		return this.http.get<IEntityIdentification[]>('procurement/common/configuration/defaultbillingschemas', { params });
	}

	private async setPrcConfigFkAndBillingSchemaFk(entity: IInvHeaderEntity, prcConfigFk: number, billingSchemaFk: number, dataList: ProcurementConfigurationEntity[]) {
		await this.onPrcConfigurationFk(entity, prcConfigFk, false, true, dataList, true);
		const billingSchema = await firstValueFrom(this.billingSchemaLookupService.getItemByKey({ id: billingSchemaFk }));
		await this.applyBillingSchema(entity, false, billingSchema, false);
		return true;
	}

	private recalculateAmountNetOc(entity: IInvHeaderEntity) {
		const taxCode = this.mdcTaxCodeService.getItemByKey({ id: entity.TaxCodeFk });
		if (taxCode) {
			const vatPercent = this.dataService.getVatPercentWithTaxCodeMatrix(entity.TaxCodeFk);
			entity.AmountNetOc = this.getPreTaxByAfterTax(entity.AmountGrossOc, vatPercent);
			this.validateAmountNetOc({ entity: entity, value: entity.AmountNetOc, field: 'AmountNetOc' });
			this.dataService.setModified(entity);
		}
	}

	private getPreTaxByAfterTax(afterTax: number, vatPercent: number) {
		const vp = vatPercent ? math.bignumber(100).add(vatPercent).div(100).toNumber() : 1;
		return this.calculationService.roundTo(math.bignumber(afterTax).div(vp));
	}

	private async sumChainInvoice(model: string, invTypeFk: number, invHeaderFk: number) {
		const chainedInvoices = await firstValueFrom(this.invoiceChainedLookupService.getList());
		if (!chainedInvoices.length) {
			return 0;
		}

		const invHeader2Headers = ServiceLocator.injector.get(ProcurementInvoiceChainedInvoiceDataService).getList();
		const filteredInvoices = invHeader2Headers.filter((e) => e.InvHeaderFk === invHeaderFk);
		if (!filteredInvoices.length) {
			return 0;
		}

		const invType = this.invTypeLookupService.cache.getItem({ id: invTypeFk });
		const isFicorrection = invType?.Isficorrection ?? false;

		if (isFicorrection) {
			const maxChianInvoice = maxBy(filteredInvoices, (o) => o.InvHeaderChainedProgressId);
			const relatedChianInvoice = maxChianInvoice ? chainedInvoices[maxChianInvoice.InvHeaderChainedFk] : null;
			return model === 'Net' ? relatedChianInvoice?.TotalPerformedNet ?? 0 : relatedChianInvoice?.TotalPerformedGross ?? 0;
		} else {
			return sumBy(filteredInvoices, (item) => {
				const oneChain = chainedInvoices[item.InvHeaderChainedFk];
				return model === 'Net' ? oneChain?.AmountNet ?? 0 : oneChain?.AmountGross ?? 0;
			});
		}
	}

	private async sumChainInvoiceObj(invTypeFk: number) {
		const returnObj = { Gross: 0, Net: 0 };
		const chainedInvoices = await firstValueFrom(this.invoiceChainedLookupService.getList());
		if (!chainedInvoices.length) {
			return returnObj;
		}

		const invHeader2Headers = ServiceLocator.injector.get(ProcurementInvoiceChainedInvoiceDataService).getList();
		const invType = this.invTypeLookupService.cache.getItem({ id: invTypeFk });
		const isFicorrection = invType?.Isficorrection ?? false;

		if (isFicorrection) {
			const maxChianInvoice = maxBy(invHeader2Headers, (o) => o.InvHeaderChainedProgressId);
			const relatedChianInvoice = maxChianInvoice ? chainedInvoices[maxChianInvoice.InvHeaderChainedFk] : null;
			if (relatedChianInvoice) {
				returnObj.Gross = relatedChianInvoice.TotalPerformedGross ?? 0;
				returnObj.Net = relatedChianInvoice.TotalPerformedNet ?? 0;
			}
		} else {
			forEach(invHeader2Headers, (item) => {
				const invChain = chainedInvoices[item.InvHeaderChainedFk];
				if (invChain) {
					returnObj.Gross += invChain.AmountGross ?? 0;
					returnObj.Net += invChain.AmountNet ?? 0;
				}
			});
		}

		return returnObj;
	}

	private validateEmptyCode(entity: IInvHeaderEntity) {
		if (!entity.Code) {
			const codeTr = this.translationService.instant('cloud.common.entityCode').text;
			const validateResult = this.validationUtils.createErrorObject({
				key: 'cloud.common.generatenNumberFailed',
				params: { fieldName: codeTr },
			});

			this.applyValidationResult(validateResult, entity, 'Code');
		} else {
			this.dataService.removeInvalid(entity, {
				field: 'Code',
				result: this.validationUtils.createSuccessObject(),
			});
		}
	}

	private async copyCertificatesFromProject(entity: IInvHeaderEntity, projectId: number) {
		if (entity.ProjectFk !== projectId) {
			this.certificateDataService.copyCertificatesFromOtherModule(projectId, { PrcHeaderId: entity.Id, PrjProjectId: projectId });
		}
	}

	private async updateClerkByProject(entity: IInvHeaderEntity, newProjectId?: number | null) {
		const params = new HttpParams().set('companyFk', entity.CompanyFk);
		if (newProjectId) {
			params.set('projectFk', newProjectId);
		}
		if (entity.PrcStructureFk) {
			params.set('prcStructureFk', entity.PrcStructureFk);
		}
		if (entity.ClerkPrcFk === null || entity.ClerkReqFk === null) {
			const clerks = await this.http.post<number[]>('procurement/common/data/getClerkFk', params);
			if (clerks && clerks.length > 0) {
				entity.ClerkPrcFk = clerks[0];
				if (clerks.length > 1) {
					entity.ClerkReqFk = clerks[1];
				}
				this.dataService.setModified(entity);
			}
		}
	}

	private async updateProjectStatus(entity: IInvHeaderEntity, projectId: number) {
		const project = await firstValueFrom(this.projectLookupService.getItemByKey({ id: projectId }));
		entity.ProjectStatusFk = project?.StatusFk ?? null;
		this.dataService.setModified(entity);
	}

	private async resetVatGroupAndPostingGroupBySupplier(entity: IInvHeaderEntity, supplierFk?: number | null, isBpdVatGroupFk?: boolean, isPostingGroupFk?: boolean) {
		if (!isBpdVatGroupFk && !isPostingGroupFk) {
			return;
		}
		if (!isNil(supplierFk)) {
			const supplier = await firstValueFrom(this.supplierLookupService.getItemByKey({ id: supplierFk }));
			if (!isNil(supplier)) {
				const supplierCompanyEntities = await this.http.get<ISupplierCompanyEntity[]>('businesspartner/main/suppliercompany/list', { params: { mainItemId: supplier.Id } });
				const companyId = this.companyContext.loginCompanyEntity.Id;
				const suppliersWithSameCompany = supplierCompanyEntities.filter((e) => e.BasCompanyFk === companyId).sort((a, b) => a.Id - b.Id);
				if (isBpdVatGroupFk) {
					const vatSuppliers = suppliersWithSameCompany.filter((e) => e.VatGroupFk !== null);
					const VatGroupFk = isEmpty(vatSuppliers) ? supplier.BpdVatGroupFk : vatSuppliers[0].VatGroupFk;
					if (VatGroupFk) {
						this.validateBpdVatGroupFk({ entity: entity, value: VatGroupFk, field: 'BpdVatGroupFk' });
					}
				}
				if (isPostingGroupFk) {
					const psGrouSuppliers = suppliersWithSameCompany.filter((e) => e.BusinessPostingGroupFk !== null);
					entity.BusinessPostingGroupFk = isEmpty(psGrouSuppliers) ? supplier.BusinessPostingGroupFk : psGrouSuppliers[0].VatGroupFk;
				}
				this.dataService.setModified(entity);
			}
		}
		return true;
	}

	private async recalculateAmountAfChangeVatPercent(item?: IInvHeaderEntity) {
		const entity = item ?? this.dataService.getSelectedEntity();
		if (entity) {
			const vatPercent = this.dataService.getVatPercentWithTaxCodeMatrix(entity.TaxCodeFk);
			entity.AmountNetOc = this.dataService.calculateNetFromGross(entity.AmountGrossOc, vatPercent);
			entity.AmountNet = this.dataService.calculateNetFromGross(entity.AmountGross, vatPercent);
			entity.AmountVatOc = this.dataService.calculationService.roundTo(math.bignumber(entity.AmountGrossOc).sub(entity.AmountNetOc));
			entity.AmountVat = this.calculationService.roundTo(math.bignumber(entity.AmountGross).sub(entity.AmountNet));
			const sumChainInvoices = await this.sumChainInvoice('Net', entity.InvTypeFk, entity.Id);
			entity.TotalPerformedNet = this.calculationService.roundTo(math.bignumber(entity.AmountNet).add(sumChainInvoices));

			this.dataService.updateDiscountBasics(entity);
			this.dataService.recalculateAmountBalance(entity);
			this.dataService.setModified(entity);
		}
	}

	/**
	 * Handles the Contract Header Foreign Key (ConHeaderFk) for the given invoice header entity.
	 *
	 * @param {IInvHeaderEntity} entity - The invoice header entity to update.
	 * @param {IContractLookupEntity} conHeaderView - The contract lookup entity containing the new values.
	 * @param {number} value - The value of the ConHeaderFk.
	 */
	private async handleConHeaderFk(entity: IInvHeaderEntity, conHeaderView: IContractLookupEntity, value: number) {
		// Generate narrative for the entity and set it as the description
		this.dataService.generateNarrative(entity).then((narrative) => {
			entity.Description = narrative;
			this.dataService.setModified(entity);
		});

		// Validate and set BusinessPartnerFk if not already set
		if (!entity.BusinessPartnerFk && conHeaderView.BusinessPartnerFk) {
			const pointedSupplierFk = conHeaderView.BpdSupplierFk ?? null;
			const pointedSubsidiaryFk = conHeaderView.BpdSubsidiaryFk ?? null;
			this.asyncValidateBusinessPartnerFk({ entity, value: conHeaderView.BusinessPartnerFk, field: 'BusinessPartnerFk' }, pointedSupplierFk, pointedSubsidiaryFk).then(() => {
				entity.BusinessPartnerFk = conHeaderView.BusinessPartnerFk;
				entity.ContactFk = conHeaderView.BpdContactFk;
				entity.SubsidiaryFk = conHeaderView.BpdSubsidiaryFk;
				this.setSupplier(entity, conHeaderView);
			});
		} else if (conHeaderView.BpdSupplierFk) {
			this.setSupplier(entity, conHeaderView);
		}

		// Validate and set BpdVatGroupFk
		if (conHeaderView.BpdVatGroupFk) {
			this.validateBpdVatGroupFk({ entity, value: conHeaderView.BpdVatGroupFk, field: 'BpdVatGroupFk' });
		}

		// Update project status and set ProjectFk if not already set
		if (!entity.ProjectFk && conHeaderView.ProjectFk) {
			if (conHeaderView.ProjectFk !== entity.ProjectFk) {
				this.updateProjectStatus(entity, conHeaderView.ProjectFk);
			}
			entity.ProjectFk = conHeaderView.ProjectFk;
		}

		// Placeholder for PrcPackageFk validation
		if (isNil(entity.PrcPackageFk) && !isNil(conHeaderView) && !isNil(conHeaderView.PrcPackageFk)) {
			this.validatePrcPackageFk({ entity: entity, value: conHeaderView.PrcPackageFk, field: 'PrcPackageFk' });
		}

		// Validate and set ControllingUnitFk
		if (!entity.ControllingUnitFk && conHeaderView.ControllingUnitFk) {
			entity.ControllingUnitFk = conHeaderView.ControllingUnitFk;
			this.validateControllingUnitFk({ entity, value: conHeaderView.ControllingUnitFk, field: 'ControllingUnitFk' });
		} else if (entity.PesHeaderFk) {
			const pesHeaderView = await firstValueFrom(this.pesLookupService.getItemByKey({ id: value }));
			if (pesHeaderView?.ControllingUnitFk) {
				entity.ControllingUnitFk = pesHeaderView.ControllingUnitFk;
				this.validateControllingUnitFk({ entity, value: conHeaderView.ControllingUnitFk, field: 'ControllingUnitFk' });
			}
		}

		// Validate and set PrcStructureFk
		if (!entity.PrcStructureFk && conHeaderView.PrcStructureFk) {
			this.validatePrcStructureFk({ entity, value: conHeaderView.PrcStructureFk, field: 'PrcStructureFk' }, true);
			entity.PrcStructureFk = conHeaderView.PrcStructureFk;
		}

		// Set ClerkPrcFk, ClerkReqFk, and SalesTaxMethodFk
		Object.assign(entity, {
			ClerkPrcFk: conHeaderView.ClerkPrcFk,
			ClerkReqFk: conHeaderView.ClerkReqFk,
			SalesTaxMethodFk: conHeaderView.SalesTaxMethodFk,
		});

		// Validate and set TaxCodeFk
		if (conHeaderView.TaxCodeFk) {
			this.validateTaxCodeFk({ entity, value: conHeaderView.TaxCodeFk, field: 'TaxCodeFk' });
		}

		// Validate and set CurrencyFk
		if (conHeaderView.CurrencyFk) {
			this.validateCurrencyFk({ entity, value: conHeaderView.CurrencyFk, field: 'CurrencyFk' });
		}

		// Copy and update certificates
		ServiceLocator.injector.get(ProcurementInvoiceCertificateDataService).copyAndUpdateCertificates(conHeaderView, value);

		// Calculate and update entity based on ConHeader
		const params = entity.Id === 0 ? { conheaderId: value, invoiceId: 0 } : { conheaderId: value, invoiceId: entity.Id };
		const result = await this.http.get<IInvHeaderEntity>('procurement/invoice/header/calculateByConHeader', { params });

		if (result) {
			Object.assign(entity, {
				ContractTotal: result.ContractTotal,
				ContractChangeOrder: result.ContractChangeOrder,
				Invoiced: result.Invoiced,
				Percent: result.Percent,
				ContractTotalGross: result.ContractTotalGross,
				ContractChangeOrderGross: result.ContractChangeOrderGross,
				InvoicedGross: result.InvoicedGross,
				GrossPercent: result.GrossPercent,
				BasAccassignBusinessFk: result.BasAccassignBusinessFk,
				BasAccassignControlFk: result.BasAccassignControlFk,
				BasAccassignAccountFk: result.BasAccassignAccountFk,
				BasAccassignConTypeFk: result.BasAccassignConTypeFk,
				BankFk: result.BankFk,
			});

			if (result.BankFk) {
				this.validateBankFk({ entity, value: entity.BankFk ?? undefined, field: 'BankFk' });
			}
		}

		// Update entity with call-off contract details if applicable
		if (conHeaderView?.ConHeaderFk !== null && conHeaderView.ProjectChangeFk === null) {
			const callOffContract = await this.http.get<IConHeaderEntity>('procurement/contract/header/getitembyId', { params: { id: conHeaderView.ConHeaderFk } });
			if (callOffContract) {
				Object.assign(entity, {
					CallOffMainContractFk: callOffContract.Id,
					CallOffMainContract: callOffContract.Code,
					CallOffMainContractDes: callOffContract.Description,
				});
			}
		}

		// Mark entity as modified and process it as read-only
		this.dataService.setModified(entity);
		this.dataService.readonlyProcessor.process(entity);
	}

	private setSupplier(entity: IInvHeaderEntity, conHeaderView: IContractLookupEntity) {
		entity.SupplierFk = conHeaderView.BpdSupplierFk;
		if (isNil(entity.SupplierFk)) {
			return;
		}
		this.supplierLookupService.getItemByKey({ id: entity.SupplierFk }).subscribe((supplier) => {
			if (supplier && !isNil(supplier.BasPaymentMethodFk)) {
				entity.BasPaymentMethodFk = supplier.BasPaymentMethodFk;
			}
			this.resetVatGroupAndPostingGroupBySupplier(entity, entity.SupplierFk, !isNil(conHeaderView.BpdVatGroupFk), true);
			this.dataService.setModified(entity);
			this.dataService.readonlyProcessor.process(entity);
			this.dataService.setModified(entity);
			this.dataService.readonlyProcessor.process(entity);
		});
	}

	private async clearConHeaderFk(entity: IInvHeaderEntity, value?: number) {
		entity.ConHeaderFk = value;
		entity.ContractOrderDate = null;
		entity.ConStatusFk = 0;
		entity.ContractTotal = 0;
		entity.ContractChangeOrder = 0;
		entity.Invoiced = 0;
		entity.Percent = '0%';

		entity.ContractTotalGross = 0;
		entity.ContractChangeOrderGross = 0;
		entity.InvoicedGross = 0;
		entity.GrossPercent = '0%';
		const billSchema = await firstValueFrom(this.billingSchemaLookupService.getItemByKey({ id: entity.BillingSchemaFk }));
		entity.ProgressId = billSchema?.IsChained ? 1 : 0;
		entity.TotalPerformedGross = entity.AmountGross;
		entity.TotalPerformedNet = entity.AmountNet;
		entity.CallOffMainContractFk = undefined;
		entity.CallOffMainContract = '';
		entity.CallOffMainContractDes = '';

		this.dataService.setModified(entity);
		this.dataService.readonlyProcessor.process(entity);

		ServiceLocator.injector.get(ProcurementInvoiceGeneralsDataService).deleteAll();
	}

	private applyValidationResult(result: ValidationResult, entity: IInvHeaderEntity, field: string) {
		if (result.valid) {
			this.dataService.removeInvalid(entity, { result, field });
		} else {
			this.dataService.addInvalid(entity, { result, field });
		}
	}

	private get calculationService() {
		return this.dataService.calculationService;
	}
}
