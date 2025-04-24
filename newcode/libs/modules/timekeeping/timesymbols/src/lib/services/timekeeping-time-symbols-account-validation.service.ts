/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, ProviderToken } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, PlatformSchemaService, ValidationInfo, ValidationResult, ValidationServiceFactory } from '@libs/platform/data-access';
import { cloneDeep, isNil } from 'lodash';
import { PlatformHttpService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { ITimeSymbolAccountEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingTimeSymbolsAccountDataService } from './timekeeping-time-symbols-account-data.service';
import { BasicsSharedDataValidationService, BasicsSharedTimekeepingSurchargeTypeLookupService } from '@libs/basics/shared';
import { firstValueFrom } from 'rxjs';
import { ICompanyEntity } from '@libs/basics/interfaces';
import { ControllingSharedControllingUnitLookupService } from '@libs/controlling/shared';


@Injectable({
	providedIn: 'root'
})
export class TimekeepingTimeSymbolsAccountValidationService extends BaseValidationService<ITimeSymbolAccountEntity> {

	private readonly  http = inject(PlatformHttpService);
	private readonly   dataService = inject(TimekeepingTimeSymbolsAccountDataService);
	private readonly  translate: PlatformTranslateService = inject(PlatformTranslateService);
	private readonly  validationUtils = inject(BasicsSharedDataValidationService);
	private  readonly controllingUnitLookupProvider = inject(ControllingSharedControllingUnitLookupService);
	private  validators: IValidationFunctions<ITimeSymbolAccountEntity> | null = null;

	public constructor() {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<ITimeSymbolAccountEntity>> = PlatformSchemaService<ITimeSymbolAccountEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Timekeeping.TimeSymbols', typeName: 'TimeSymbolAccountDto'}).then(
			(scheme) => {
				this.validators = new ValidationServiceFactory<ITimeSymbolAccountEntity>().provideValidationFunctionsFromScheme(scheme, this);
			}
		);
	}


	protected override generateValidationFunctions(): IValidationFunctions<ITimeSymbolAccountEntity> {
		return {
			SurchargeTypeFk: [this.asyncValidateSurchargeTypeFk, this.validateAdditionalSurchargeTypeFk],
			CostGroupFk: [this.asyncValidateCostGroupFk, this.validateAdditionalCostGroupFk],
			CompanyChargedFk: [this.asyncValidateCompanyChargedFk, this.validateAdditionalCompanyChargedFk],
			ControllingUnitFk: [this.asyncValidateControllingUnitFk],
		};
	}

	private asyncValidateSurchargeTypeFk(info: ValidationInfo<ITimeSymbolAccountEntity>): Promise<ValidationResult> {
		return new Promise((resolve) => {
			this.handleAsyncValidation(info, 'SurchargeTypeFk').then(resolve);
		});
	}

	private asyncValidateCostGroupFk(info: ValidationInfo<ITimeSymbolAccountEntity>): Promise<ValidationResult> {
		return new Promise((resolve) => {
			this.handleAsyncValidation(info, 'CostGroupFk').then(resolve);
		});
	}

	private asyncValidateCompanyChargedFk(info: ValidationInfo<ITimeSymbolAccountEntity>): Promise<ValidationResult> {
		return new Promise((resolve) => {
			this.handleAsyncValidation(info, 'CompanyChargedFk').then(resolve);
		});
	}

	private asyncValidateControllingUnitFk(info: ValidationInfo<ITimeSymbolAccountEntity>): Promise<ValidationResult> {
		return new Promise((resolve) => {
			this.handleAsyncValidation(info, 'ControllingUnitFk').then(resolve);
		});
	}

	private async handleAsyncValidation(info: ValidationInfo<ITimeSymbolAccountEntity>, model: string): Promise<ValidationResult> {
		try {
			if (model === 'ControllingUnitFk') {
				await this.getControllingUnit(info.entity, info.value as number);
			} else {
				await this.validateWholeRecord(info.entity, info.value as number, model);
			}
			return this.validationUtils.createSuccessObject();
		} catch (error) {
			return this.validationUtils.createErrorObject({key: 'cloud.common.uniqueValueErrorMessage'});
		}
	}

	private validateAdditionalSurchargeTypeFk(info: ValidationInfo<ITimeSymbolAccountEntity>): ValidationResult {
		return this.validateSyncWholeRecord(info.entity, info.value as number, 'SurchargeTypeFk');
	}

	private validateAdditionalCostGroupFk(info: ValidationInfo<ITimeSymbolAccountEntity>): ValidationResult {
		return this.validateSyncWholeRecord(info.entity, info.value as number, 'CostGroupFk');
	}

	private validateAdditionalCompanyChargedFk(info: ValidationInfo<ITimeSymbolAccountEntity>): ValidationResult {
		return this.validateSyncWholeRecord(info.entity, info.value as number, 'CompanyChargedFk');
	}

	private async validateWholeRecord(entity: ITimeSymbolAccountEntity, value: number, model: string): Promise<void> {
		const companyChargedFk = entity.CompanyChargedFk ?? 0;
		const surchargeTypeFk = entity.SurchargeTypeFk ?? 0;
		const costGroupFk = entity.CostGroupFk ?? 0;

		const account = {
			Id: entity.Id,
			TimeSymbolId: entity.TimeSymbolFk,
			CompanyChargedId: model === 'CompanyChargedFk' ? value : companyChargedFk > 0 ? companyChargedFk : null,
			SurchargeTypeId: model === 'SurchargeTypeFk' ? value : surchargeTypeFk > 0 ? surchargeTypeFk : null,
			CostGroupId: model === 'CostGroupFk' ? value : costGroupFk > 0 ? costGroupFk : null
		};

		await this.http.post<boolean>('timekeeping/timesymbols/account/isrecordunique', account)
			.then(response => {
				if (response !== undefined && response !== null) {
					const invalidFields = ['TimeSymbolFk', 'CompanyChargedFk', 'SurchargeTypeFk', 'CostGroupFk'];
					if ((entity.ControllingUnitFk ?? 0) > 0) {
						invalidFields.push('ControllingUnitFk');
					}

					const validationInfo = new ValidationInfo<ITimeSymbolAccountEntity>(entity, value, model);
					this.ensureNoRelatedError(this.dataService, validationInfo, invalidFields);
					return this.validationUtils.createSuccessObject();
				} else {
					return this.validationUtils.createErrorObject({key: 'timekeeping.timesymbols.enityUnknownIssue'});
				}
			});
	}

	private validateSyncWholeRecord(entity: ITimeSymbolAccountEntity, value: number, model: string) {

		const result = {apply: true, valid: true, error: ''};
		const record = cloneDeep(entity);
		if (model === 'CompanyChargedFk'){
			record.CompanyChargedFk = value;
		} else if (model === 'SurchargeTypeFk'){
			record.SurchargeTypeFk = value;
		} else {
			record.CostGroupFk = value;
		}

		let list = this.dataService.getList();

		list = list.filter(item => {
			return item.Id !== entity.Id &&
				item.CompanyChargedFk === record.CompanyChargedFk &&
				item.TimeSymbolFk === record.TimeSymbolFk &&
				item.CostGroupFk === record.CostGroupFk;
		});

		const list1 = list.filter(item => {
			return item.CompanyFk === record.CompanyFk &&
				item.SurchargeTypeFk === record.SurchargeTypeFk;
		});

		let isMultipleStandardRate = false;

		const surchargeTypeLookup = ServiceLocator.injector.get(BasicsSharedTimekeepingSurchargeTypeLookupService);
		if (record.SurchargeTypeFk) {
			firstValueFrom(surchargeTypeLookup.getItemByKey({id: record.SurchargeTypeFk}))
				.then(surchargeType => {
					if (surchargeType?.IsStandardRate) {
						let n = 0;
						while (n < list.length && !isMultipleStandardRate){
							firstValueFrom(surchargeTypeLookup.getItemByKey({id: list[n].SurchargeTypeFk})).
							then(st => {
								if (st) {
									isMultipleStandardRate = st.IsStandardRate;
								}
							});
							n++;
						}
					}
				});
		}
		let invalidFields = ['TimeSymbolFk', 'CompanyChargedFk', 'SurchargeTypeFk', 'CostGroupFk'];

		if (isMultipleStandardRate) {
			if (model === 'CostGroupFk') {
				invalidFields = ['TimeSymbolFk', 'CompanyChargedFk', 'CostGroupFk'];
			}
			result.error = this.translate.instant('timekeeping.period.selectrecord').text;
			result.valid = false;
		} else if (list1.length > 0) {
			result.error = this.translate.instant('cloud.common.uniqueValueErrorMessage').text;
			result.valid = false;
		}

		if (entity.ControllingUnitFk != null && entity.ControllingUnitFk > 0) {
			invalidFields.push('ControllingUnitFk');
		}

		const validationInfo = new ValidationInfo<ITimeSymbolAccountEntity>(entity, value, model);

		this.ensureNoRelatedError(this.dataService, validationInfo, invalidFields);

		if (result.valid){
			return this.validationUtils.createSuccessObject();
		} else {
			return this.validationUtils.createErrorObject(result.error);
		}
	}


	private getControllingUnit(entity: ITimeSymbolAccountEntity, value: number) {
		return new Promise((resolve) => {
			const controllingUnit = firstValueFrom(this.controllingUnitLookupProvider.getItemByKey({id: value}));
			controllingUnit.then(cu => {
				const companyFk = cu.CompanyFk;
				const result = {apply: true, valid: true, error: ''};

				if (isNil(companyFk)) {
					result.error = this.translate.instant('timekeeping.period.errorMsgControllingUnit').text;
					resolve(this.validationUtils.createErrorObject(result.error));
				} else {
					if (entity.CompanyChargedFk !== companyFk) {
						entity.CompanyChargedFk = companyFk;
							const result = this.validateSyncWholeRecord(entity, entity.CompanyChargedFk, 'CompanyChargedFk');
							if (result.valid) {
								this.validateWholeRecord(entity, entity.CompanyChargedFk, 'CompanyChargedFk')
									.then(validationResult => resolve(validationResult));
							}
					}
					const isReadOnly = entity.CompanyChargedFk === entity.CompanyFk;
					const readOnlyFields = [
						{field: 'AccountICCostFk', readOnly: isReadOnly},
						{field: 'AccountICRevFk', readOnly: isReadOnly}
					];
					this.dataService.setEntityReadOnlyFields(entity, readOnlyFields);
					this.http.get<ICompanyEntity>('basics/company/getCompanyById?companyId=' + entity.CompanyFk)
						.then(res => {
								entity.CompanyChargedLedgerContextFk = res.LedgerContextFk;
								resolve(true);
						});
				}
			});
		});
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ITimeSymbolAccountEntity> {
		return this.dataService;
	}
}
