import {
	BaseValidationService, IEntityModification,
	IEntityRuntimeDataRegistry,
	IValidationFunctions, ValidationInfo, ValidationResult,
} from '@libs/platform/data-access';
import { PlatformConfigurationService, PlatformHttpService, PlatformTranslateService, PropertyType } from '@libs/platform/common';
import {ServiceLocator} from '@libs/platform/common';
import {Observable, ReplaySubject} from 'rxjs';
import {get} from 'lodash';
import {
	BasicsSharedCertificateTypeLookupService, BasicsSharedDataValidationService,
	BasicsSharedCertificateStatusLookupService
} from '@libs/basics/shared';
import {runInInjectionContext} from '@angular/core';
import { BusinessPartnerLookupService } from '../../lookup-services';
import { ICertificateEntity } from '@libs/businesspartner/interfaces';

export class BusinesspartnerSharedCertificateValidationService extends BaseValidationService<ICertificateEntity> {

	protected dataService: IEntityRuntimeDataRegistry<ICertificateEntity> & IEntityModification<ICertificateEntity>;
	protected translateService = ServiceLocator.injector.get(PlatformTranslateService);
	protected validationService = ServiceLocator.injector.get(BasicsSharedDataValidationService);
	protected http = ServiceLocator.injector.get(PlatformHttpService);
	protected configService = ServiceLocator.injector.get(PlatformConfigurationService);

	private readonly certificateTypeChanged$ = new ReplaySubject<{entity: ICertificateEntity, value: number}>(1);
	private readonly certificateStatusChanged$ = new ReplaySubject<{entity: ICertificateEntity, value: number}>(1);
	private readonly businessPartnerIssuerFkChanged$ = new ReplaySubject<{entity: ICertificateEntity, value: number | null | undefined}>(1);
	private readonly contractFkChanged$ = new ReplaySubject<{entity: ICertificateEntity, value: number | null | undefined}>(1);
	private readonly businessPartnerFkChanged$ = new ReplaySubject<{entity: ICertificateEntity, value: number}>(1);

	private tranMap: {[key: string]: string} = {
		BusinessPartnerFk: this.translateService.instant('businesspartner.certificate.businessPartner').text,
		CertificateStatusFk: this.translateService.instant('businesspartner.certificate.status').text,
		CertificateTypeFk: this.translateService.instant('businesspartner.certificate.type').text,
		Code: this.translateService.instant('businesspartner.certificate.code').text,
		Amount: this.translateService.instant('businesspartner.certificate.amount').text,
		ConHeaderFk: this.translateService.instant('businesspartner.certificate.contractCode').text,
		Issuer: this.translateService.instant('businesspartner.certificate.issuer').text,
		BusinessPartnerIssuerFk: this.translateService.instant('businesspartner.certificate.issuerBP').text,
		ValidFrom: this.translateService.instant('businesspartner.certificate.validFrom').text,
		ValidTo: this.translateService.instant('businesspartner.certificate.validTo').text,
		Reference: this.translateService.instant('cloud.common.entityReferenceName').text,
		ReferenceDate: this.translateService.instant('businesspartner.certificate.referenceDate').text,
		ProjectFk: this.translateService.instant('businesspartner.certificate.project').text,
		CurrencyFk: this.translateService.instant('businesspartner.certificate.currency').text,
		ExpirationDate: this.translateService.instant('businesspartner.certificate.expirationDate').text,
		CertificateDate: this.translateService.instant('businesspartner.certificate.date').text,
		OrdHeaderFk: this.translateService.instant('businesspartner.certificate.orderHeader').text,
	};

	private static serviceCache: {[key: string]: BusinesspartnerSharedCertificateValidationService} = {};

	public static getService(moduleName: string, dataService: IEntityRuntimeDataRegistry<ICertificateEntity> & IEntityModification<ICertificateEntity>) {
		if (BusinesspartnerSharedCertificateValidationService.serviceCache[moduleName]) {
			return BusinesspartnerSharedCertificateValidationService.serviceCache[moduleName];
		}

		const service = runInInjectionContext(ServiceLocator.injector, () => new BusinesspartnerSharedCertificateValidationService(dataService));
		BusinesspartnerSharedCertificateValidationService.serviceCache[moduleName] = service;
		return service;
	}

	private constructor(service: IEntityRuntimeDataRegistry<ICertificateEntity> & IEntityModification<ICertificateEntity>) {
		super();
		this.dataService = service;
	}

	public getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICertificateEntity> {
		return this.dataService;
	}

	protected generateValidationFunctions(): IValidationFunctions<ICertificateEntity> {
		return {
			CertificateTypeFk: this.validateCertificateTypeFk,
			CertificateStatusFk: this.validateCertificateStatusFk,
			ConHeaderFk: this.validateConHeaderFk,
			BusinessPartnerFk: this.validateBusinessPartnerFk,
			ValidFrom: this.validateValidFrom,
			ValidTo: this.validateValidTo,
			// ProjectFk: this.validateProjectFk,
			Code: this.validateCode,
			CertificateDate: this.createRequiredValidator('CertificateDate'),
			Issuer: this.createRequiredValidator('Issuer'),
			BusinessPartnerIssuerFk: this.createRequiredValidator('BusinessPartnerIssuerFk'),
			Reference: this.createRequiredValidator('Reference'),
			ReferenceDate: this.createRequiredValidator('ReferenceDate'),
			ProjectFk: this.createRequiredValidator('ProjectFk'),
			Amount: this.createRequiredValidator('Amount'),
			CurrencyFk: this.createRequiredValidator('CurrencyFk'),
			ExpirationDate: this.createRequiredValidator('ExpirationDate'),
			OrdHeaderFk: this.createRequiredValidator('OrdHeaderFk'),
		};
	}

	public get certificateTypeChangedEvent$(): Observable<{entity: ICertificateEntity, value: number}> {
		return this.certificateTypeChanged$;
	}

	public get certificateStatusChangedEvent$(): Observable<{entity: ICertificateEntity, value: number}> {
		return this.certificateStatusChanged$;
	}

	public get businessPartnerIssuerFkChangedEvent$(): Observable<{entity: ICertificateEntity, value: number | null | undefined}> {
		return this.businessPartnerIssuerFkChanged$;
	}

	public get contractFkChangedEvent$(): Observable<{entity: ICertificateEntity, value: number | null | undefined}> {
		return this.contractFkChanged$;
	}

	public get businessPartnerFkChangedEvent$(): Observable<{entity: ICertificateEntity, value: number}> {
		return this.businessPartnerFkChanged$;
	}

	protected validateCertificateTypeFk(info: ValidationInfo<ICertificateEntity>): ValidationResult {
		const requiredValidator = this.createRequiredValidator('CertificateTypeFk');
		const result = requiredValidator(info);
		if (result.valid) {
			this.certificateTypeChanged$.next({entity: info.entity, value: info.value as number});
			if (info.entity._statusItem && info.entity._typeItem) {
				const certificateTypes = ServiceLocator.injector.get(BasicsSharedCertificateTypeLookupService).syncService?.getListSync() || [];
				const certificateType = certificateTypes.find(e => e.Id === info.value);
				const isRequest = info.entity._statusItem.Isrequest;
				const shouldCertificateDateValidate = certificateType ? certificateType.HasCertificateDate && !isRequest : false;
				const shouldReferenceValidate = certificateType ? certificateType.HasReference && !isRequest : false;
				const shouldReferenceDataValidate = certificateType ? certificateType.HasReferenceDate && !isRequest : false;
				const shouldContractValidate = certificateType ? certificateType.HasContract && !isRequest : false;
				const shouldIssuerValidate = certificateType ? certificateType.HasIssuer && !isRequest : false;
				const shouldIssuerBPValidate = certificateType ? certificateType.HasIssuerBp && !isRequest : false;
				const shouldValidFromValidate = certificateType ? certificateType.HasValidFrom && !isRequest : false;
				const shouldValidToValidate = certificateType ? certificateType.HasValidTo && !isRequest : false;
				const shouldProjectNoValidate = certificateType ? certificateType.HasProject && !isRequest : false;
				const shouldExpirationDateValidate = certificateType ? certificateType.HasExpirationDate && !isRequest : false;
				const shouldOrdHeaderValidate = certificateType ? certificateType.HasOrder && !isRequest : false;

				this.validateReferenceAndReferenceDate(info.entity, info.value, result,
					shouldCertificateDateValidate,
					shouldReferenceValidate,
					shouldReferenceDataValidate,
					shouldContractValidate,
					shouldIssuerValidate,
					shouldIssuerBPValidate,
					shouldValidFromValidate,
					shouldValidToValidate,
					shouldProjectNoValidate,
					shouldExpirationDateValidate,
					shouldOrdHeaderValidate);
			}
		}

		return result;
	}

	protected validateCertificateStatusFk(info: ValidationInfo<ICertificateEntity>): ValidationResult {
		const requiredValidator = this.createRequiredValidator('CertificateStatusFk');
		const result = requiredValidator(info);
		if (result.valid) {
			this.certificateStatusChanged$.next({entity: info.entity, value: info.value as number});
			if (info.entity._statusItem && info.entity._typeItem) {
				const statusItems = ServiceLocator.injector.get(BasicsSharedCertificateStatusLookupService).syncService?.getListSync() || [];
				const certificateStatus = statusItems.find(e => e.Id === info.value);

				const shouldCertificateDateValidate = certificateStatus ? info.entity._typeItem.HasCertificateDate && !certificateStatus.Isrequest : false;
				const shouldReferenceValidate = certificateStatus ? info.entity._typeItem.HasReference && !certificateStatus.Isrequest : false;
				const shouldReferenceDataValidate = certificateStatus ? info.entity._typeItem.HasReferenceDate && !certificateStatus.Isrequest : false;
				const shouldContractValidate = certificateStatus ? info.entity._typeItem.HasContract && !certificateStatus.Isrequest : false;
				const shouldIssuerValidate = certificateStatus ? info.entity._typeItem.HasIssuer && !certificateStatus.Isrequest : false;
				const shouldIssuerBPValidate = certificateStatus ? info.entity._typeItem.HasIssuerBp && !certificateStatus.Isrequest : false;
				const shouldValidFromValidate = certificateStatus ? info.entity._typeItem.HasValidFrom && !certificateStatus.Isrequest : false;
				const shouldValidToValidate = certificateStatus ? info.entity._typeItem.HasValidTo && !certificateStatus.Isrequest : false;
				const shouldProjectNoValidate = certificateStatus ? info.entity._typeItem.HasProject && !certificateStatus.Isrequest : false;
				const shouldExpirationDateValidate = certificateStatus ? info.entity._typeItem.HasExpirationDate && !certificateStatus.Isrequest : false;
				const shouldOrdHeaderValidate = certificateStatus ? info.entity._typeItem.HasOrder && !certificateStatus.Isrequest : false;
				this.validateReferenceAndReferenceDate(info.entity, info.value, result,
					shouldCertificateDateValidate,
					shouldReferenceValidate,
					shouldReferenceDataValidate,
					shouldContractValidate,
					shouldIssuerValidate,
					shouldIssuerBPValidate,
					shouldValidFromValidate,
					shouldValidToValidate,
					shouldProjectNoValidate,
					shouldExpirationDateValidate,
					shouldOrdHeaderValidate);
			}
		}
		return result;
	}

	protected validateConHeaderFk(info: ValidationInfo<ICertificateEntity>): ValidationResult {
		this.contractFkChanged$.next({entity: info.entity, value: info.value ? info.value as number : null});
		const bpFkResult = this.validateBusinessPartnerFk({
			entity: info.entity,
			value: info.entity.BusinessPartnerFk,
			field: 'BusinessPartnerFk'
		});
		const projectFkResult = this.validateProjectFk({
			entity: info.entity,
			value: info.entity.ProjectFk ? info.entity.ProjectFk : undefined,
			field: 'ProjectFk'
		});

		this.applyValidationResult(bpFkResult, info.entity, 'BusinessPartnerFk');
		this.applyValidationResult(projectFkResult, info.entity, 'ProjectFk');

		const requiredValidator = this.createRequiredValidator(info.field);
		return requiredValidator(info);
	}

	public validateBusinessPartnerFk(info: ValidationInfo<ICertificateEntity>): ValidationResult {
		this.businessPartnerFkChanged$.next({entity: info.entity, value: info.value ? info.value as number : -1});
		const requiredValidator = this.createRequiredValidator(info.field);
		const result = requiredValidator(info);
		this.applyValidationResult(result, info.entity, info.field);
		if (!result.valid) {
			info.entity.SubsidiaryFk = null;
		} else {
			const businessPartners = ServiceLocator.injector.get(BusinessPartnerLookupService).syncService?.getListSync() || [];
			const businessPartner = businessPartners.find(e => e.Id === info.value);

			if (businessPartner) {
				info.entity.SubsidiaryFk = businessPartner.SubsidiaryFk;
			} else {
				info.entity.SubsidiaryFk = null;
			}
		}

		return result;
	}

	protected validateValidFrom(info: ValidationInfo<ICertificateEntity>): ValidationResult {
		const relModel = 'ValidTo';
		const validatePeriodResult = this.validationService.validatePeriod(this.getEntityRuntimeData(), info,
			info.value ? info.value.toString() : '', info.entity.ValidTo ?  info.entity.ValidTo.toString() : '', relModel);
		const requiredValidator = this.createRequiredValidator(info.field);
		const validToRequiredValidator = this.createRequiredValidator(relModel);
		const result = requiredValidator(info);
		const validToResult = validToRequiredValidator({entity: info.entity, value: info.entity.ValidTo || undefined, field: relModel});
		if (validatePeriodResult.valid) {
			this.applyValidationResult(result, info.entity, info.field);
			this.applyValidationResult(validToResult, info.entity, relModel);
			return result;
		}
		this.applyValidationResult(validatePeriodResult, info.entity, info.field);
		return validatePeriodResult;
	}

	protected validateValidTo(info: ValidationInfo<ICertificateEntity>): ValidationResult {
		const relModel = 'ValidFrom';
		const validatePeriodResult = this.validationService.validatePeriod(this.getEntityRuntimeData(), info,
			info.entity.ValidTo ?  info.entity.ValidTo.toString() : '', info.value ? info.value.toString() : '', relModel);
		const requiredValidator = this.createRequiredValidator(info.field);
		const validFromRequiredValidator = this.createRequiredValidator(relModel);
		const result = requiredValidator(info);
		const validFromResult = validFromRequiredValidator({entity: info.entity, value: info.entity.ValidTo || undefined, field: relModel});
		if (validatePeriodResult.valid) {
			this.applyValidationResult(result, info.entity, info.field);
			this.applyValidationResult(validFromResult, info.entity, relModel);
			return result;
		}
		this.applyValidationResult(validatePeriodResult, info.entity, info.field);
		return validatePeriodResult;
	}

	protected validateProjectFk(info: ValidationInfo<ICertificateEntity>): ValidationResult {
		const requiredValidator = this.createRequiredValidator(info.field);
		const result = requiredValidator(info);
		this.applyValidationResult(result, info.entity, info.field);
		return result;
	}

	public validateCode(info: ValidationInfo<ICertificateEntity>): ValidationResult {
		const requiredValidator = this.createRequiredValidator('Code');
		const result = requiredValidator(info);
		this.applyValidationResult(result, info.entity, info.field);
		return result;
	}

	// noinspection JSUnusedLocalSymbols
	public handleRequiredValidation(entity: ICertificateEntity) {  // move the codes
		const fields = ['BusinessPartnerFk', 'CertificateStatusFk', 'CertificateTypeFk', 'Code', 'Amount',
			'ConHeaderFk', 'Issuer', 'BusinessPartnerIssuerFk', 'ValidFrom', 'ValidTo', 'Reference',
			'ReferenceDate', 'ProjectFk', 'CurrencyFk', 'ExpirationDate', 'CertificateDate', 'OrdHeaderFk'];
		if (!entity.Version) {
			fields.forEach(field => {
				const requiredValidator = this.createRequiredValidator(field);
				const value = get(entity, field);
				const result = requiredValidator({entity: entity, value: value, field: field});

				this.applyValidationResult(result, entity, field);
			});
		}
	}

	private createRequiredValidator(field: string, hasField?: string, isField?: string) {  // move the codes
		return (info: ValidationInfo<ICertificateEntity>): ValidationResult => {
			let mandatory;
			const result: ValidationResult = {
				apply: true,
				valid: true
			};

			function getMandatory1(hasField: string, isField?: string) {
				if (info.entity._typeItem && info.entity._statusItem) {
					const typeItem = get(info.entity._typeItem, hasField);
					isField = isField || 'IsRequest';
					const statusItem = get(info.entity._statusItem, isField);
					return typeItem && !statusItem;
				}
			}

			function getMandatory2(hasField: string) {
				if (info.entity._typeItem) {
					return get(info.entity._typeItem, hasField);
				}
			}

			switch (field) {
				case 'ConHeaderFk':
					hasField = 'HasContract';
					mandatory = getMandatory1(hasField, isField);
					break;
				case 'Issuer':
					hasField = 'HasIssuer';
					mandatory = getMandatory1(hasField, isField);
					break;
				case 'BusinessPartnerIssuerFk':
					hasField = 'HasIssuerBP';
					mandatory = getMandatory1(hasField, isField);
					this.businessPartnerIssuerFkChanged$.next({entity: info.entity, value: info.value ? info.value as number : null});
					break;
				case 'ValidFrom':
					hasField = 'HasValidFrom';
					mandatory = getMandatory1(hasField, isField);
					break;
				case 'ValidTo':
					hasField = 'HasValidTo';
					mandatory = getMandatory1(hasField, isField);
					break;
				case 'Reference':
					hasField = 'HasReference';
					mandatory = getMandatory1(hasField, isField);
					break;
				case 'ReferenceDate':
					hasField = 'HasReferenceDate';
					mandatory = getMandatory1(hasField, isField);
					break;
				case 'ProjectFk':
					hasField = 'HasProject';
					mandatory = getMandatory1(hasField, isField);
					break;
				case 'Amount':
				case 'CurrencyFk':
					hasField = 'HasAmount';
					mandatory = getMandatory1(hasField, isField);
					break;
				case 'ExpirationDate':
					hasField = 'HasExpirationDate';
					mandatory = getMandatory1(hasField, isField);
					break;
				case 'CertificateDate':
					hasField = 'HasCertificateDate';
					mandatory = getMandatory1(hasField, isField);
					break;
				case 'OrdHeaderFk':
					hasField = 'HasOrder';
					mandatory = getMandatory2(hasField);
					break;
				default:
					mandatory = true;
					break;
			}

			if (mandatory) {
				result.valid = !(info.value === '' || info.value === null || info.value === -1);
				if (!result.valid) {
					result.error = this.translateService.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: this.tranMap[field]}).text;
				}
			}

			// add the validation action
			this.applyValidationResult(result, info.entity, field);

			return result;
		};
	}

	private validateReferenceAndReferenceDate(entity: ICertificateEntity, value: PropertyType | undefined, result: ValidationResult,
									  shouldCertificateDateValidate: boolean,
									  shouldReferenceValidate: boolean,
									  shouldReferenceDataValidate: boolean,
									  shouldContractValidate: boolean,
									  shouldIssuerValidate: boolean,
									  shouldIssuerBPValidate: boolean,
									  shouldValidFromValidate: boolean,
									  shouldValidToValidate: boolean,
									  shouldProjectNoValidate: boolean,
									  shouldExpirationDateValidate: boolean,
									  shouldOrdHeaderValidate: boolean) {
		const certificateDateResult = {...result};
		const referenceResult = {...result};
		const referenceDateResult = {...result};
		const contractResult = {...result};
		const issuerResult = {...result};
		const issuerBPResult = {...result};
		const validFromResult = {...result};
		const validToResult = {...result};
		const projectResult = {...result};
		const expirationDateResult = {...result};
		const hasOrderResult = {...result};
		let valueChanged = false;
		const readonlyFields = [];
		if (shouldCertificateDateValidate && !entity.CertificateDate) {
			certificateDateResult.valid = false;
			certificateDateResult.error = this.translateService.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: this.tranMap['CertificateDate']}).text;
			this.dataService.setModified(entity);
			readonlyFields.push({
				field: 'CertificateDate',
				readOnly: false
			});
			valueChanged = true;
		}

		if (shouldReferenceValidate && !entity.Reference) {
			referenceResult.valid = false;
			referenceResult.error = this.translateService.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: this.tranMap['Reference']}).text;
			this.dataService.setModified(entity);
			readonlyFields.push({
				field: 'Reference',
				readOnly: false
			});
			valueChanged = true;
		}

		if (shouldReferenceDataValidate && !entity.ReferenceDate) {
			referenceDateResult.valid = false;
			referenceDateResult.error = this.translateService.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: this.tranMap['ReferenceDate']}).text;
			this.dataService.setModified(entity);
			readonlyFields.push({
				field: 'ReferenceDate',
				readOnly: false
			});
			valueChanged = true;
		}

		if (shouldContractValidate && !entity.ConHeaderFk) {
			contractResult.valid = false;
			contractResult.error = this.translateService.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: this.tranMap['ConHeaderFk']}).text;
			this.dataService.setModified(entity);
			readonlyFields.push({
				field: 'ConHeaderFk',
				readOnly: false
			});
			valueChanged = true;
		}

		if (shouldIssuerValidate && !entity.Issuer) {
			issuerResult.valid = false;
			issuerResult.error = this.translateService.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: this.tranMap['Issuer']}).text;
			this.dataService.setModified(entity);
			readonlyFields.push({
				field: 'Issuer',
				readOnly: false
			});
			valueChanged = true;
		}

		if (shouldIssuerBPValidate && !entity.BusinessPartnerIssuerFk) {
			issuerBPResult.valid = false;
			issuerBPResult.error = this.translateService.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: this.tranMap['BusinessPartnerIssuerFk']}).text;
			this.dataService.setModified(entity);
			readonlyFields.push({
				field: 'BusinessPartnerIssuerFk',
				readOnly: false
			});
			valueChanged = true;
		}

		if (shouldValidFromValidate && !entity.ValidFrom) {
			validFromResult.valid = false;
			validFromResult.error = this.translateService.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: this.tranMap['ValidFrom']}).text;
			this.dataService.setModified(entity);
			readonlyFields.push({
				field: 'ValidFrom',
				readOnly: false
			});
			valueChanged = true;
		}

		if (shouldValidToValidate && !entity.ValidTo) {
			validToResult.valid = false;
			validToResult.error = this.translateService.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: this.tranMap['ValidTo']}).text;
			this.dataService.setModified(entity);
			readonlyFields.push({
				field: 'ValidTo',
				readOnly: false
			});
			valueChanged = true;
		}

		if (shouldProjectNoValidate && !entity.ProjectFk) {
			projectResult.valid = false;
			projectResult.error = this.translateService.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: this.tranMap['ProjectFk']}).text;
			this.dataService.setModified(entity);
			readonlyFields.push({
				field: 'ProjectFk',
				readOnly: false
			});
			valueChanged = true;
		}

		if (shouldExpirationDateValidate && !entity.ExpirationDate) {
			expirationDateResult.valid = false;
			expirationDateResult.error = this.translateService.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: this.tranMap['ExpirationDate']}).text;
			this.dataService.setModified(entity);
			readonlyFields.push({
				field: 'ExpirationDate',
				readOnly: false
			});
			valueChanged = true;
		}

		if (shouldOrdHeaderValidate && !entity.OrdHeaderFk) {
			hasOrderResult.valid = false;
			hasOrderResult.error = this.translateService.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: this.tranMap['OrdHeaderFk']}).text;
			this.dataService.setModified(entity);
			readonlyFields.push({
				field: 'OrdHeaderFk',
				readOnly: false
			});
			valueChanged = true;
		}

		this.applyValidationResult(certificateDateResult, entity, 'CertificateDate');
		this.applyValidationResult(referenceResult, entity, 'Reference');
		this.applyValidationResult(referenceDateResult, entity, 'ReferenceDate');
		this.applyValidationResult(contractResult, entity, 'ConHeaderFk');
		this.applyValidationResult(issuerResult, entity, 'Issuer');
		this.applyValidationResult(issuerBPResult, entity, 'BusinessPartnerIssuerFk');
		this.applyValidationResult(validFromResult, entity, 'ValidFrom');
		this.applyValidationResult(validToResult, entity, 'ValidTo');
		this.applyValidationResult(projectResult, entity, 'ProjectFk');
		this.applyValidationResult(expirationDateResult, entity, 'ExpirationDate');
		this.applyValidationResult(hasOrderResult, entity, 'OrdHeaderFk');
		if (valueChanged) {
			this.dataService.setEntityReadOnlyFields(entity, readonlyFields);
		}
	}

	private applyValidationResult(result: ValidationResult, entity: ICertificateEntity, field: string) {
		if (result.valid) {
			this.dataService.removeInvalid(entity, {result: result, field: field});
		} else {
			this.dataService.addInvalid(entity, {result: result, field: field});
		}
	}
}