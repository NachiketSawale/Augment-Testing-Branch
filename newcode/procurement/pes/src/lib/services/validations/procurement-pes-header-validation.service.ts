/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IPesHeaderEntity } from '../../model/entities';
import { ProcurementPesHeaderDataService } from '../procurement-pes-header-data.service';
import { PlatformConfigurationService, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { firstValueFrom } from 'rxjs';
import {
	BasicsShareControllingUnitLookupService,
	BasicsSharedCompanyContextService,
	BasicsSharedDataValidationService,
	BasicsSharedProcurementConfigurationLookupService,
	BasicsShareProcurementConfigurationToBillingSchemaLookupService,
	MainDataDto
} from '@libs/basics/shared';
import { clone, isNil, merge } from 'lodash';
import { BusinessPartnerLogicalValidatorFactoryService } from '@libs/businesspartner/shared';
import { IContractLookupEntity, ProcurementShareContractLookupService } from '@libs/procurement/shared';
import { ProcurementPesCurrencyExchangeRateService } from '../procurement-pes-currency-exchange-rate.service';
import { ProcurementPesBillingSchemaDataService } from '../procurement-pes-billing-schema-data.service';
import { ProjectSharedLookupService } from '@libs/project/shared';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPesHeaderValidationService extends BaseValidationService<IPesHeaderEntity> {
	private readonly defaultRate = 1.0;
	private http = inject(PlatformHttpService);
	private config = inject(PlatformConfigurationService);
	private readonly translationService = inject(PlatformTranslateService);
	private readonly validationService = inject(BasicsSharedDataValidationService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	protected readonly companyContext = inject(BasicsSharedCompanyContextService);
	private readonly currencyExchangeRateService = inject(ProcurementPesCurrencyExchangeRateService);

	private readonly projectLookupService = inject(ProjectSharedLookupService);
	private readonly contractLookupService = inject(ProcurementShareContractLookupService);
	private readonly ctrUnitLookupService = inject(BasicsShareControllingUnitLookupService);
	private readonly configurationLookupService = inject(BasicsSharedProcurementConfigurationLookupService);
	private readonly billingSchemaDataService = inject(ProcurementPesBillingSchemaDataService);
	private readonly prcConfig2BSchemaLookupService = inject(BasicsShareProcurementConfigurationToBillingSchemaLookupService);

	private readonly dataService: ProcurementPesHeaderDataService = inject(ProcurementPesHeaderDataService);
	private readonly businessPartnerValidatorService = inject(BusinessPartnerLogicalValidatorFactoryService).create({
		dataService: this.dataService,
	});

	public constructor() {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<IPesHeaderEntity> {
		return {
			Code: this.asyncValidateUnique,
			ClerkPrcFk: this.validateClerkPrcFk,
			Description: this.asyncValidateUnique,
			DocumentDate: this.validateDocumentDate,
			BusinessPartnerFk: this.asyncValidateBusinessPartnerFk,
			SupplierFk: this.asyncValidateSupplierFk,
			ProjectFk: this.asyncValidateProjectFk,
			ConHeaderFk: this.asyncValidateConHeaderFk,
			PackageFk: this.asyncValidatePackageFk,
			ControllingUnitFk: this.asyncValidateControllingUnitFk,
			PrcConfigurationFk: this.asyncValidatePrcConfigurationFk,
			CurrencyFk: this.asyncValidateCurrencyFk,
			ExchangeRate: this.asyncValidateExchangeRate,
			DateDelivered: this.validateDateDelivered,
			BillingSchemaFk: this.asyncValidateBillingSchemaFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPesHeaderEntity> {
		return this.dataService;
	}

	protected get entityProxy() {
		return this.dataService.entityProxy;
	}

	protected async asyncValidateUnique(info: ValidationInfo<IPesHeaderEntity>) {
		const entity = info.entity;
		const result = this.validateIsMandatory(info);

		if (!result.valid) {
			return result;
		}

		const responseData = await this.validatePesHeader(entity, info);
		if (!responseData) {
			this.validationUtils.createErrorObject({ key: 'cloud.common.uniqueValueErrorMessage' });
		}
		return result;
	}

	protected validateDocumentDate(info: ValidationInfo<IPesHeaderEntity>) {
		const value = (isNil(info.value) ? null : info.value) as Date;
		if (value) {
			info.entity.DateDelivered = value.toISOString();
		}
		return this.validationUtils.createSuccessObject();
	}

	protected async asyncValidateBusinessPartnerFk(info: ValidationInfo<IPesHeaderEntity>, isFromBasic?: boolean, pointedSupplierFk?: number, pointedSubsidiaryFk?: number) {
		const entity = info.entity;
		const validateRes = this.validateIsMandatory(info);
		if (!validateRes.valid) {
			return validateRes;
		}
		const value = info.value as number;

		this.businessPartnerValidatorService.resetArgumentsToValidate();
		await this.businessPartnerValidatorService.businessPartnerValidator({ entity, value, needAttach: true, notNeedLoadDefaultSubsidiary: false, pointedSupplierFk, pointedSubsidiaryFk });

		return this.validationUtils.createSuccessObject();
	}

	protected async asyncValidateSupplierFk(info: ValidationInfo<IPesHeaderEntity>, dontSetPaymentTerm?: boolean) {
		this.businessPartnerValidatorService.resetArgumentsToValidate();
		await this.businessPartnerValidatorService.supplierValidator(info.entity, info.value as number, dontSetPaymentTerm);
		return this.validationUtils.createSuccessObject();
	}

	protected validateClerkPrcFk(info: ValidationInfo<IPesHeaderEntity>) {
		return this.validateIsMandatory(info);
	}

	protected async asyncValidateProjectFk(info: ValidationInfo<IPesHeaderEntity>) {
		const entity = info.entity;
		const newValue = info.value as number;

		if (!entity || entity.ProjectFk === newValue) {
			return this.validationUtils.createSuccessObject();
		}
		entity.ProjectFk = newValue;
		await this.updateClerkByProject(entity, newValue);

		//todo: pel, should update controlling unit after procurementCommonControllingUnitFactory service ready
		// var oldControllingUnitFk = entity.ControllingUnitFk;
		// if (!entity.ConHeaderFk && value) {
		// 	entity.ProjectFk = value;
		// 	$q.all([procurementCommonControllingUnitFactory.getControllingUnit(value, oldControllingUnitFk)]).then(function (res) {
		// 		if (res[0] !== '' && res[0] !== null) {
		// 			entity.ControllingUnitFk = res[0];
		// 		}
		// 		validateCurrencyFk(entity, entity.CurrencyFk);
		// 	});
		// } else {
		// 	if (!value) {
		// 		entity.ControllingUnitFk = null;
		// 	} else {
		// 		$q.all([procurementCommonControllingUnitFactory.getControllingUnit(value, oldControllingUnitFk)]).then(function (res) {
		// 			if (res[0] !== '' && res[0] !== null) {
		// 				entity.ControllingUnitFk = res[0];
		// 			}
		// 			validateCurrencyFk(entity, entity.CurrencyFk);
		// 		});
		// 	}
		// }
		entity.PackageFk = undefined;
		this.updateProjectStatus(entity, newValue);
		this.dataService.setModified(entity);
		return this.validationUtils.createSuccessObject();
	}

	protected async asyncValidateConHeaderFk(info: ValidationInfo<IPesHeaderEntity>) {
		let entity = info.entity;
		entity = this.entityProxy.apply(entity);
		const value = info.value ? (info.value as number) : null;

		if (entity.ConHeaderFk === value) {
			return this.validationUtils.createSuccessObject();
		}

		if (!value) {
			entity.BusinessPartnerFk = 0;
			entity.SubsidiaryFk = undefined;
			entity.SupplierFk = undefined;
			entity.PrcStructureFk = undefined;
			entity.CallOffMainContractFk = undefined;
			entity.CallOffMainContract = '';
			entity.CallOffMainContractDes = '';
			//validate bp
			this.addInvalidBusinessPartnerMessage(entity);
		} else {
			const conHeader = await firstValueFrom(this.contractLookupService.getItemByKey({ id: value }));
			if (conHeader) {
				//set info from contract header
				if (conHeader.ClerkPrcFk) {
					entity.ClerkPrcFk = conHeader.ClerkPrcFk;
				}
				if (conHeader.ClerkReqFk) {
					entity.ClerkReqFk = conHeader.ClerkReqFk;
				}
				if (conHeader.SalesTaxMethodFk) {
					entity.SalesTaxMethodFk = conHeader.SalesTaxMethodFk;
				}

				//validate prc clerk
				this.ApplyValidateClerkResult(entity);

				//set call off main contract information
				await this.setCallOffMainContractInfo(conHeader, entity);
			}

			const responseData = await this.validatePesHeader(entity, info);
			if (responseData) {
				const resDto = new MainDataDto<IPesHeaderEntity>(responseData);
				const oldEntity = this.updateEntityFromValidateResponse(resDto, entity);
				//the clerkPrcFk and clerkReqFk keep as original
				entity.ClerkPrcFk = oldEntity.ClerkPrcFk;
				entity.ClerkReqFk = oldEntity.ClerkReqFk;

				await this.asyncValidateControllingUnitFk(info, 'ControllingUnitFk');
				await this.asyncValidatePrcConfigurationFk(info);

				entity.ExchangeRate = (await this.asyncGetDefaultExchangeRate(entity)) as number;
				this.dataService.setModified(entity);
				this.dataService.update(entity).then(() => {
					if (this.dataService.getSelectedEntity()) {
						//todo, pel, wait common boq service ready
						// var pesBoqService = $injector.get('procurementPesBoqService');
						// pesBoqService.createOtherItems({ConHeaderFk: value}, true);
					}
				});
			}
		}

		this.dataService.readonlyProcessor.process(entity);
		return this.validationUtils.createSuccessObject();
	}

	protected async asyncValidateControllingUnitFk(info: ValidationInfo<IPesHeaderEntity>, modelFk?: string) {
		const entity = info.entity;
		const newValue = info.value as number;
		if (newValue) {
			const isValidUnit = await this.http.post<boolean>('controlling/structure/validationControllingUnit', { params: { ControllingUnitFk: newValue } });
			if (isValidUnit) {
				const ctrUnit = await firstValueFrom(this.ctrUnitLookupService.getItemByKey({ id: newValue }));
				if (ctrUnit && ctrUnit.PrjProjectFk) {
					if (entity.ProjectFk !== ctrUnit.PrjProjectFk) {
						entity.ProjectFk = ctrUnit.PrjProjectFk;
						this.updateProjectStatus(entity, ctrUnit.PrjProjectFk);
					}
				}
			} else {
				if (modelFk) {
					const validateResult = this.validationService.createErrorObject({
						key: 'basics.common.error.controllingUnitError',
						params: { fieldName: info.field },
					});
					this.dataService.addInvalid(entity, { field: modelFk, result: validateResult });
				} else {
					return this.validationUtils.createErrorObject({ key: 'basics.common.error.controllingUnitError' });
				}
			}
		}

		return this.validationUtils.createSuccessObject();
	}

	protected async asyncValidatePrcConfigurationFk(info: ValidationInfo<IPesHeaderEntity>) {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : undefined;
		const result = this.validateIsMandatory(info);
		if (!result.valid) {
			return result;
		}
		const responseData = await this.validatePesHeader(entity, info);
		if (responseData) {
			const resDto = new MainDataDto<IPesHeaderEntity>(responseData);
			const oldEntity = this.updateEntityFromValidateResponse(resDto, entity);
			// make sure the existing code not be replaced by isGenerated
			if (entity.Version !== 0) {
				entity.Code = oldEntity.Code;
			}

			const newConfig = value ? await firstValueFrom(this.configurationLookupService.getItemByKey({ id: value })) : undefined;
			if (entity.Version === 0 && newConfig) {
				entity.Code = this.dataService.getNumberDefaultText(entity);
				if (!entity.Code) {
					const codeTr = this.translationService.instant('cloud.common.entityCode').text;
					const validateResult = this.validationService.createErrorObject({
						key: 'cloud.common.generatenNumberFailed',
						params: { fieldName: codeTr },
					});
					this.dataService.addInvalid(entity, { field: 'Code', result: validateResult });
				} else {
					this.dataService.removeInvalid(entity, {
						field: 'Code',
						result: this.validationService.createSuccessObject(),
					});
				}
			}

			if (value) {
				entity.PrcConfigurationFk = value;
			}

			this.UpdateBillingSchemaByConfiguration(entity);


			// todo: pel, common Characteristic logic is not available.
			// var defaultListNotModified = null;
			// var sourceSectionId = 32;// 32 is  prcurement Configration
			// var targetSectionId = 20;// 20 is  Pes.
			//
			// var sourceHeaderId = value;
			// var targetHeaderId;
			// if(dataService.getSelected()){
			// 	targetHeaderId = dataService.getSelected().Id;
			// }
			//
			// var charDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(dataService, targetSectionId);
			// defaultListNotModified = charDataService.getList();
			// var newItem = [];
			// angular.forEach(defaultListNotModified, function (item) {
			// 	newItem.push(item);
			// });

			// var getAndSetListPromise = $http.get(globals.webApiBaseUrl + 'basics/characteristic/data/getAndSetList' + '?sourceHeaderId=' + sourceHeaderId + '&targetHeaderId=' + targetHeaderId + '&sourceSectionId=' + sourceSectionId + '&targetSectionId=' + targetSectionId).then(function (response) {
			// 	if(!_.isNil(dataService.getSelected())) {
			// 		var configData = response.data;
			// 		angular.forEach(configData, function (item) {
			// 			var oldItem = _.find(defaultListNotModified, {CharacteristicFk: item.CharacteristicFk});
			// 			if (!oldItem) {
			// 				newItem.push(item);
			// 			}
			// 		});
			// 		charDataService.setList(newItem);
			// 		angular.forEach(newItem, function (item) {
			// 			charDataService.markItemAsModified(item);
			// 		});
			// 	}
			// });
			//
			// asyncMarker.myPromise = $q.all([validatePromise, getAndSetListPromise]).then(function () {
			// 	platformRuntimeDataService.applyValidationResult(result, entity, model);
			// 	return platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, service, dataService);
			// });
		}
		return this.validationUtils.createSuccessObject();
	}

	protected async asyncValidatePackageFk(info: ValidationInfo<IPesHeaderEntity>) {
		const entity = info.entity;
		const responseData = await this.validatePesHeader(entity, info);
		if (responseData) {
			const resDto = new MainDataDto<IPesHeaderEntity>(responseData);
			this.updateEntityFromValidateResponse(resDto, entity);
			//validate prc clerk
			this.ApplyValidateClerkResult(entity);
			//check bp
			if (!entity.BusinessPartnerFk) {
				this.addInvalidBusinessPartnerMessage(entity);
			}
		}
		return this.validationUtils.createSuccessObject();
	}

	protected async asyncValidateCurrencyFk(info: ValidationInfo<IPesHeaderEntity>) {
		return this.currencyExchangeRateService.validateCurrencyFk(info, info.entity.ProjectFk ?? undefined);
	}

	protected async asyncValidateDateEffective(info: ValidationInfo<IPesHeaderEntity>): Promise<ValidationResult> {
		return Promise.resolve(this.validationService.createSuccessObject());
		// todo: pel, boq common logic is not available
		// let prcPesBoqService = $injector.get('procurementPesBoqService');
		// let selectHeader =  dataService.getSelected();
		// return procurementCommonDateEffectiveValidateService.asyncModifyDateEffectiveAndUpdateBoq(entity, value, model,prcPesBoqService, dataService, service, {
		// 	ProjectId: entity.ProjectFk,
		// 	Module: 'procurement.pes',
		// 	BoqHeaderId: entity.Id,
		// 	HeaderId: selectHeader.Id,
		// 	ExchangeRate: entity.ExchangeRate
		// });
	}

	protected async asyncValidateBillingSchemaFk(info: ValidationInfo<IPesHeaderEntity>) {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : undefined;
		if(entity.BillingSchemaFk !== value){
			entity.BillingSchemaFk = value;
			if(value !== undefined){
				await this.prcConfig2BSchemaLookupService.getItemByKey({id: value});
			}
			this.billingSchemaDataService.recalculate();
		}
		return this.validationUtils.createSuccessObject();
	}

	protected async asyncValidateExchangeRate(info: ValidationInfo<IPesHeaderEntity>) {
		return this.currencyExchangeRateService.validateExchangeRate(info);
	}

	protected validateDateDelivered(info: ValidationInfo<IPesHeaderEntity>) {
		return this.validateIsMandatory(info);
	}

	private async UpdateBillingSchemaByConfiguration(entity: IPesHeaderEntity){
		if (!entity.PrcConfigurationFk) {
			return this.asyncValidateBillingSchemaFk({
				entity: entity,
				value: undefined,
				field: 'BillingSchemaFk',
			});
		}

		const billingschemaFk = await this.http.get<number>('basics/billingschema/common/getdefaultbillingschema', {
			params: { configurationFk: entity.PrcConfigurationFk },
		});

		if (entity.BillingSchemaFk !== billingschemaFk) {
			return this.asyncValidateBillingSchemaFk({
				entity: entity,
				value: billingschemaFk,
				field: 'BillingSchemaFk',
			});
		} else {
			this.billingSchemaDataService.recalculate();
		}

		return true;
	}

	private updateEntityFromValidateResponse(responseData: MainDataDto<IPesHeaderEntity>, entity: IPesHeaderEntity) {
		const resDto = new MainDataDto<IPesHeaderEntity>(responseData);
		const pesDto = resDto.getValueAs<IPesHeaderEntity>('dtos');
		const oldEntity = clone(entity);
		//need to merge th latest entity cause have updated some fields in backend,
		merge(entity, pesDto);
		//reset some special fields from old entity, sine they not need to change
		this.resetSpecialFieldsValue(entity, oldEntity);
		return oldEntity;
	}

	private resetSpecialFieldsValue(entity: IPesHeaderEntity, oldEntity: IPesHeaderEntity) {
		entity.DocumentDate = oldEntity.DocumentDate;
		entity.DateDelivered = oldEntity.DateDelivered;
		entity.DateDeliveredFrom = oldEntity.DateDeliveredFrom;
		entity.DateEffective = oldEntity.DateEffective;
	}

	private async validatePesHeader(entity: IPesHeaderEntity, info: ValidationInfo<IPesHeaderEntity>) {
		const params = {
			HeaderDto: entity,
			Value: info.value,
			Model: info.field,
		};
		return await this.http.post('procurement/pes/header/validate', params);
	}

	private asyncGetDefaultExchangeRate(entity: IPesHeaderEntity) {
		if (entity.CurrencyFk !== this.companyContext.loginCompanyEntity.CurrencyFk) {
			return this.getCurrentRate(entity, entity.CurrencyFk);
		}
		return Promise.resolve(this.defaultRate);
	}

	private async getCurrentRate(entity: IPesHeaderEntity, currencyFk: number) {
		const params = {
			CompanyFk: this.config.clientId as number,
			CurrencyForeignFk: currencyFk,
			ProjectFk: entity.ProjectFk || 0,
		};

		return this.http.get<number>('procurement/common/exchangerate/defaultrate', { params: params });
	}

	private async updateClerkByProject(entity: IPesHeaderEntity, newProjectId: number) {
		const params = {
			prcStructureFk: entity.PrcStructureFk,
			projectFk: newProjectId,
			companyFk: entity.CompanyFk,
		};
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

	private async updateProjectStatus(entity: IPesHeaderEntity, projectId: number) {
		const project = await firstValueFrom(this.projectLookupService.getItemByKey({ id: projectId }));
		entity.ProjectStatusFk = project?.StatusFk ?? null;
		this.dataService.setModified(entity);
		return true;
	}

	private addInvalidBusinessPartnerMessage(entity: IPesHeaderEntity) {
		const businessPartnerTr = this.translationService.instant('cloud.common.entityBusinessPartner').text;
		const validateResult = this.validationService.createErrorObject({
			key: 'cloud.common.emptyOrNullValueErrorMessage',
			params: { fieldName: businessPartnerTr },
		});
		this.dataService.addInvalid(entity, { field: 'BusinessPartnerFk', result: validateResult });
	}

	private async setCallOffMainContractInfo(conHeader: IContractLookupEntity, entity: IPesHeaderEntity) {
		if (conHeader.ConHeaderFk !== null && conHeader.ProjectChangeFk === null) {
			const callOffContract = await firstValueFrom(this.contractLookupService.getItemByKey({ id: conHeader.ConHeaderFk }));
			if (callOffContract) {
				entity.CallOffMainContractFk = callOffContract.Id;
				entity.CallOffMainContract = callOffContract.Code;
				entity.CallOffMainContractDes = callOffContract.Description;
			}
		}
	}

	private ApplyValidateClerkResult(entity: IPesHeaderEntity) {
		const clerkPrcFkValidateResult = this.validateClerkPrcFk({
			entity: entity,
			value: entity.ClerkPrcFk || undefined,
			field: 'ClerkPrcFk',
		});
		if (!clerkPrcFkValidateResult.valid) {
			this.dataService.addInvalid(entity, { field: 'ClerkPrcFk', result: clerkPrcFkValidateResult });
		}
	}

}
