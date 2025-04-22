import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import {
	AddressEntity,
	BasicsSharedDataValidationService,
	BasicsSharedMaterialCatalogLookupService,
	BasicsSharedProcurementConfigurationLookupService,
	BasicsSharedProcurementStructureLookupService,
	BasicsSharedTaxCodeLookupService,
	BasicsSharedReqStatusLookupService,
	IProcurementStructureLookupEntity, BasicsSharedCompanyContextService,
} from '@libs/basics/shared';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { isNil, isNumber, forEach } from 'lodash';
import { lastValueFrom } from 'rxjs';
import { StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { IOriginalData, IPrcItemEntity, IPrcGeneralsReloadData } from '@libs/procurement/common';
import { IReqHeaderEntity } from '../../model/entities/reqheader-entity.interface';
import { ProcurementRequisitionHeaderDataService } from '../requisition-header-data.service';
import { BusinessPartnerLogicalValidatorFactoryService, BusinessPartnerLookupService } from '@libs/businesspartner/shared';
import { ProcurementPackageLookupService } from '@libs/procurement/shared';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { ProcurementRequisitionOverallDiscountService } from '../procurement-requisition-overall-discount.service';

@Injectable({
	providedIn: 'root',
})
export class ProcurementRequisitionHeaderValidationService extends BaseValidationService<IReqHeaderEntity> {
	private readonly requisitionService = inject(ProcurementRequisitionHeaderDataService);
	private readonly validationService = inject(BasicsSharedDataValidationService);
	private readonly translationService = inject(PlatformTranslateService);
	private readonly httpService = inject(PlatformHttpService);

	private readonly configurationLookupService = inject(BasicsSharedProcurementConfigurationLookupService);
	private readonly structureLookupService = inject(BasicsSharedProcurementStructureLookupService);
	private readonly taxCodeLookupService = inject(BasicsSharedTaxCodeLookupService);
	private readonly packageLookupService = inject(ProcurementPackageLookupService);
	private readonly bpLookupService = inject(BusinessPartnerLookupService);
	private readonly projectLookupService = inject(ProjectSharedLookupService);
	private readonly reqStatusLookupService = inject(BasicsSharedReqStatusLookupService);
	private readonly materialCatalogLookupService = inject(BasicsSharedMaterialCatalogLookupService);

	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly companyContext = inject(BasicsSharedCompanyContextService);
	private readonly overallDiscountService = inject(ProcurementRequisitionOverallDiscountService);
	// private readonly commonGeneralsService = inject(ProcurementCommonGeneralsDataService); // todo chi: should replace by concrete service
	private readonly businessPartnerValidatorService = inject(BusinessPartnerLogicalValidatorFactoryService).create({
		dataService: this.requisitionService,
	});

	private packageUpdatingAddress: boolean = false;

	private readonly deliverDateUpdateToItemInfoDialogId = this.uuidGenerator();
	private readonly updatePaymentTermFIToItemsDialogId = this.uuidGenerator();
	private readonly updatePaymentTermPAToItemsDialogId = this.uuidGenerator();
	private readonly updatePaymentTermFIandPAToItemsDialogId = this.uuidGenerator();
	private readonly updateIncotermToItemDialogId = this.uuidGenerator();
	private readonly willClearAllBoqsDialogId = this.uuidGenerator();

	public getEntityRuntimeData(): IEntityRuntimeDataRegistry<IReqHeaderEntity> {
		return this.requisitionService;
	}

	public async validateBusinessPartnerFk(info: ValidationInfo<IReqHeaderEntity>, pointedSupplierFk?: number, pointedSubsidiaryFk?: number, isFromConfigDialog?: boolean) {
		const value = info.value ? (info.value as number) : undefined;
		const entity = info.entity;
		if (value !== entity.BusinessPartnerFk) {
			if (!isFromConfigDialog) {
				const dataEntity: IPrcGeneralsReloadData = {};
				dataEntity.MainItemId = entity.PrcHeaderFk;
				if (value) {
					dataEntity.BusinessPartnerFk = value;
				}
				dataEntity.OriginalBusinessPartnerFk = entity.BusinessPartnerFk ?? undefined;
				// await this.commonGeneralsService.reloadGeneralsByBusinessPartnerFk(dataEntity); // todo chi: should replace by concrete service
			}

			const bps = this.bpLookupService.syncService?.getListSync();
			const businessPartner = bps?.find((e) => e.Id === value);
			if (businessPartner?.PrcIncotermFk) {
				this.validateIncotermFk({ entity: entity, value: businessPartner.PrcIncotermFk, field: 'PrcIncotermFk' });
				entity.IncotermFk = businessPartner.PrcIncotermFk;
			}
		}
		this.businessPartnerValidatorService.resetArgumentsToValidate();
		await this.businessPartnerValidatorService.businessPartnerValidator({
			entity: entity,
			value: value,
			needAttach: true,
			notNeedLoadDefaultSubsidiary: false,
			pointedSupplierFk: pointedSupplierFk,
			pointedSubsidiaryFk: pointedSubsidiaryFk,
		});

		return this.validationService.createSuccessObject();
	}

	public async validateSupplierFk(info: ValidationInfo<IReqHeaderEntity>, dontSetPaymentTerm?: boolean) {
		this.businessPartnerValidatorService.resetArgumentsToValidate();
		await this.businessPartnerValidatorService.supplierValidator(info.entity, info.value as number, dontSetPaymentTerm);
		return this.validationService.createSuccessObject();
	}

	public async validateDialogCode(info: ValidationInfo<IReqHeaderEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value as string;
		const translationObject = this.translationService.instant('cloud.common.isGenerated').text;
		const modelTr = this.translationService.instant('procurement.requisition.code').text;
		let validationResult = this.validationService.createSuccessObject();
		if (!value && entity.Code !== null && entity.Code !== translationObject) {
			validationResult.valid = false;
			validationResult.error = this.translationService.instant('cloud.common.emptyOrNullValueErrorMessage', { object: modelTr }).text;
		} else {
			let rubricCategoryFk = 0;
			const config = entity.PrcHeaderEntity ? await lastValueFrom(this.configurationLookupService.getItemByKey({ id: entity.PrcHeaderEntity.ConfigurationFk })) : null;
			if (config) {
				rubricCategoryFk = config.RubricCategoryFk;
			}
			const hasToGenerate = entity.Version === 0 && this.requisitionService.numberGenerator.hasNumberGenerateConfig(rubricCategoryFk);
			if (!(hasToGenerate && entity.Version === 0)) {
				validationResult = await this.validationService.isAsyncUnique(info, 'procurement/requisition/requisition/isunique', 'procurement.requisition.code');
			}
		}

		if (validationResult.valid) {
			this.requisitionService.removeInvalid(entity, { field: info.field, result: validationResult });
			this.requisitionService.removeInvalid(entity, {
				field: 'PrcHeaderEntity.ConfigurationFk',
				result: validationResult,
			});
		} else {
			this.requisitionService.addInvalid(entity, { field: info.field, result: validationResult });
		}
		return validationResult;
	}

	public async validatePackageFk(info: ValidationInfo<IReqHeaderEntity>, isFromConfigDialog?: boolean) {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : null;

		if (!value) {
			entity.PackageFk = value;
			this.requisitionService.readonlyProcessor.process(entity);
			return Promise.resolve(this.validationService.createSuccessObject());
		}

		if (entity.PackageFk !== value) {
			const data = await lastValueFrom(this.packageLookupService.getItemByKey({ id: value }));
			if (!data) {
				return Promise.resolve(this.validationService.createSuccessObject());
			}

			// apply changed data
			entity.ClerkPrcFk = data.ClerkPrcFk;
			entity.ClerkReqFk = data.ClerkReqFk;

			const projectResult = await this.validateProjectFk(
				{
					entity: entity,
					value: data.ProjectFk ?? undefined,
					field: 'ProjectFk',
				},
				isFromConfigDialog,
			);
			if (projectResult.valid) {
				entity.ProjectFk = data.ProjectFk;
			}

			const taxCodeResult = await this.validateTaxCodeFk(
				{
					entity: entity,
					value: data.TaxCodeFk,
					field: 'TaxCodeFk',
				},
				true,
				isFromConfigDialog,
			);
			if (taxCodeResult.valid) {
				entity.TaxCodeFk = data.TaxCodeFk;
			}

			if (!entity.Description) {
				// todo chi: common logic is not available
				const descriptionLength = 252; // prcCommonDomainMaxlengthHelper.get('Procurement.Requisition', 'ReqHeaderDto', 'Description');
				entity.Description = data.Description ? data.Description.substring(0, descriptionLength - 1) : '';
			}

			const structureResult = await this.validateStructureFk(
				{
					entity: entity,
					value: data.StructureFk ?? undefined,
					field: 'PrcHeaderEntity.StructureFk',
				},
				isFromConfigDialog,
			);
			if (structureResult.valid && entity.PrcHeaderEntity) {
				entity.PrcHeaderEntity.StructureFk = data.StructureFk ?? undefined;
			}

			entity.PackageFk = value;
			this.requisitionService.readonlyProcessor.process(entity);

			if (!isFromConfigDialog) {
				// todo chi: common logic is not available
				// procurementCommonTotalDataService.copyTotalsFromPackage(data);
			}

			// delivery address ************
			if (value) {
				this.packageUpdatingAddress = true;
				const address = await this.httpService.get<AddressEntity>('procurement/package/package/getdeliveryaddress', {
					params: {
						packageId: value,
					},
				});

				if (address) {
					entity.AddressFk = address.Id;
					entity.AddressEntity = address;
				}
				this.packageUpdatingAddress = false;
			}
		}

		return this.validationService.createSuccessObject();
	}

	public async validateReqHeaderFk(info: ValidationInfo<IReqHeaderEntity>, isFromConfigDialog?: boolean) {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : null;
		entity.ReqHeaderFk = value;
		if (value) {
			const reqHeaderEntity = await this.httpService.get<IReqHeaderEntity>('procurement/requisition/requisition/getitembyId?id=' + value);

			if (entity.ProjectFk !== reqHeaderEntity.ProjectFk) {
				await this.projectStatus(entity, reqHeaderEntity.ProjectFk);
			}
			entity.ProjectFk = reqHeaderEntity.ProjectFk;
			entity.PackageFk = reqHeaderEntity.PackageFk;
			entity.TaxCodeFk = reqHeaderEntity.TaxCodeFk;
			entity.ClerkPrcFk = reqHeaderEntity.ClerkPrcFk;
			entity.ClerkReqFk = reqHeaderEntity.ClerkReqFk;
			entity.BasCurrencyFk = reqHeaderEntity.BasCurrencyFk;
			entity.ExchangeRate = reqHeaderEntity.ExchangeRate;
			entity.MaterialCatalogFk = reqHeaderEntity.MaterialCatalogFk;
			entity.BasPaymentTermFiFk = reqHeaderEntity.BasPaymentTermFiFk;
			entity.BasPaymentTermPaFk = reqHeaderEntity.BasPaymentTermPaFk;
			entity.BasPaymentTermAdFk = reqHeaderEntity.BasPaymentTermAdFk;
			if (entity.MaterialCatalogFk && !isFromConfigDialog) {
				// todo chi: common logic is not available
				// var param = {
				// 	paymentTermFI: entity.BasPaymentTermFiFk,
				// 	paymentTermPA: entity.BasPaymentTermPaFk,
				// 	paymentTermAD: entity.BasPaymentTermAdFk
				// };
				// dataService.basisChanged.fire(null, param);
			}
			entity.ReqTypeFk = reqHeaderEntity.ReqTypeFk;
			entity.PrcAwardmethodFk = reqHeaderEntity.PrcAwardmethodFk;
			entity.ControllingUnitFk = reqHeaderEntity.ControllingUnitFk;
			entity.BusinessPartnerFk = reqHeaderEntity.BusinessPartnerFk;
			entity.SubsidiaryFk = reqHeaderEntity.SubsidiaryFk;
			entity.SupplierFk = reqHeaderEntity.SupplierFk;
			entity.IncotermFk = reqHeaderEntity.IncotermFk;
			// total copy
			if (entity.PrcHeaderEntity && reqHeaderEntity.PrcHeaderEntity) {
				const oldConfiguration = entity.PrcHeaderEntity.ConfigurationFk;
				if (oldConfiguration !== reqHeaderEntity.PrcHeaderEntity.ConfigurationFk && !isFromConfigDialog) {
					entity.PrcHeaderEntity.ConfigurationFk = reqHeaderEntity.PrcHeaderEntity.ConfigurationFk;
					// todo chi: common logic is not available
					// procurementCommonTotalDataService.copyTotalsFromConfiguration();
				}
				entity.PrcHeaderEntity.StructureFk = reqHeaderEntity.PrcHeaderEntity.StructureFk;
			}
			// readonly
			this.requisitionService.readonlyProcessor.process(entity);
			// in requisition module, the BusinessPartnerFk is not Required
			// remove error
			// applyManualValidation(service.validateBusinessPartnerFk(entity, reqHeaderEntity.BusinessPartnerFk), entity, 'BusinessPartnerFk', reqHeaderEntity.BusinessPartnerFk);
			// general certificate
			if (!isFromConfigDialog) {
				this.overWriteGeneralsAndCertificates(reqHeaderEntity, entity);
			}
			// copy address
			const oldAddressEntityId = entity.AddressFk;
			if (reqHeaderEntity.AddressEntity) {
				if (oldAddressEntityId) {
					if (!entity.AddressEntity) {
						entity.AddressEntity = new AddressEntity(oldAddressEntityId, reqHeaderEntity.AddressEntity.CountryFk, reqHeaderEntity.AddressEntity.AddressModified);
					}
					entity.AddressEntity.Id = oldAddressEntityId;
					entity.AddressEntity.Address = reqHeaderEntity.AddressEntity.Address;
					entity.AddressEntity.AddressLine = reqHeaderEntity.AddressEntity.AddressLine;
					entity.AddressEntity.City = reqHeaderEntity.AddressEntity.City;
					entity.AddressEntity.County = reqHeaderEntity.AddressEntity.County;
					entity.AddressEntity.Street = reqHeaderEntity.AddressEntity.Street;
				} else {
					const address = await this.httpService.get<AddressEntity>('basics/common/address/create');
					if (address) {
						entity.AddressEntity = address;
						entity.AddressEntity.Address = reqHeaderEntity.AddressEntity.Address;
						entity.AddressEntity.AddressLine = reqHeaderEntity.AddressEntity.AddressLine;
						entity.AddressEntity.City = reqHeaderEntity.AddressEntity.City;
						entity.AddressEntity.County = reqHeaderEntity.AddressEntity.County;
						entity.AddressEntity.Street = reqHeaderEntity.AddressEntity.Street;
					}
				}
			} else {
				entity.AddressEntity = null;
				entity.AddressFk = null;
			}

			if (!isFromConfigDialog) {
				// characteristic
				// todo chi: common logic is not available
				// var targetSectionId = 6;// 6 is  req.
				// var target2SectionId = 51;// 6 is  req.
				// procurementCommonCharacteristicDataService.takeCharacteristicByBasics(dataService, targetSectionId, reqHeaderEntity.Characteristic, entity.Id);
				// procurementCommonCharacteristicDataService.takeCharacteristicByBasics(dataService, target2SectionId, reqHeaderEntity.Characteristic2, entity.Id);
			}
		} else {
			this.requisitionService.readonlyProcessor.process(entity);
		}
		return this.validationService.createSuccessObject();
	}

	public async validateReqStatusFk(info: ValidationInfo<IReqHeaderEntity>) {
		const entity = info.entity;
		let value = info.value as number;
		if (entity.ReqStatusFk !== value) {
			value = value || -1;
			const data = await lastValueFrom(this.reqStatusLookupService.getItemByKey({ id: value }));

			let dateCanceled = null;
			if (data && data.Iscanceled === true) {
				dateCanceled = new Date();
			} else {
				dateCanceled = undefined;
			}
			entity.DateCanceled = dateCanceled;

			// todo chi: common logic is not available
			// moduleContext.setModuleStatus(data);
		}
		return this.validationService.createSuccessObject();
	}

	// todo chi: complex type field
	public async validateStructureFk(info: ValidationInfo<IReqHeaderEntity>, isFromConfigDialog?: boolean): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : undefined;

		if (entity?.PrcHeaderEntity?.ConfigurationFk && entity.PrcHeaderEntity.StructureFk !== value && !isFromConfigDialog) {
			const originalEntity: IOriginalData = {
				originalConfigurationFk: entity.PrcHeaderEntity.ConfigurationFk,
				originalStructureFk: entity.PrcHeaderEntity.StructureFk,
			};
			entity.PrcHeaderEntity.StructureFk = value;
			this.reloadGeneralsAndCertificates(entity, originalEntity);
			// const targetSectionId = 6;// 6 is  req.
			// const target2SectionId = 51;// 6 is  req.
			// todo chi: common logic is not available
			// procurementCommonCharacteristicDataService.takeCharacteristicByStructure(dataService, targetSectionId,target2SectionId,entity.PrcHeaderEntity,entity.Id);
		}

		const clerkData = {
			prcStructureFk: value,
			projectFk: entity.ProjectFk,
			companyFk: entity.CompanyFk,
		};

		let structure: IProcurementStructureLookupEntity | null = null;
		if (value) {
			structure = await lastValueFrom(this.structureLookupService.getItemByKey({ id: value }));
			const taxCodeFk = await this.httpService.get<number | null | undefined>('basics/procurementstructure/taxcode/getTaxCodeByStructure', {
				params: {
					structureId: value,
				},
			});

			await this.validateTaxCodeFk({ entity: entity, value: taxCodeFk ?? undefined, field: 'TaxCodeFk' }, true);
		}

		const clerkIds = await this.httpService.post<number[]>('procurement/common/data/getClerkFk', clerkData);
		if (clerkIds && clerkIds.length > 0) {
			if (clerkIds[0]) {
				entity.ClerkPrcFk = clerkIds[0];
			}
			if (clerkIds[1]) {
				entity.ClerkReqFk = clerkIds[1];
			}
		}

		// set reference when package and reference null but structure have value
		if (value && !entity.Description && !entity.PackageFk) {
			// todo chi: common logic is not available
			const descriptionLength = 252; // prcCommonDomainMaxlengthHelper.get('Procurement.Requisition', 'ReqHeaderDto', 'Description');
			entity.Description = structure ? structure.DescriptionInfo.Translated.substring(0, descriptionLength - 1) : '';
		}

		return this.validationService.createSuccessObject();
	}

	public async validateTaxCodeFk(info: ValidationInfo<IReqHeaderEntity>, isInject?: boolean, isFromConfigDialog?: boolean): Promise<ValidationResult> {
		const result = this.validationService.createSuccessObject();
		const entity = info.entity;
		const value = info.value as number;
		if (!entity?.TaxCodeFk || value === -1) {
			return this.validationService.createErrorObject('should not empty');
		}
		if (entity.TaxCodeFk !== value) {
			const data = await lastValueFrom(this.taxCodeLookupService.getItemByKey({ id: value }));

			if (data) {
				if (entity.VatPercent !== data.VatPercent && !isFromConfigDialog) {
					// todo chi: where to set this value or need?
					// dataService.isTotalDirty = true;
				}
				entity.TaxCodeFk = value;
				entity.VatPercent = data.VatPercent;
				if (isInject === undefined && !isFromConfigDialog) {
					entity.TaxCodeFk = value;
					// todo chi: common logic is not available
					// procurementCommonTaxCodeChangeService.taxCodeChanged(value, moduleName, dataService, entity);
				} else if (!isFromConfigDialog) {
					this.requisitionService.entityProxy.apply(entity).TaxCodeFk = value;
				}
			}
		}
		return result;
	}

	public async validateProjectFk(info: ValidationInfo<IReqHeaderEntity>, isFromConfigDialog?: boolean) {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : null;

		if (entity.ProjectFk === value) {
			return this.validationService.createSuccessObject();
		}

		if (entity.ProjectFk !== value) {
			entity.ProjectFk = value;

			const clerkData = {
				prcStructureFk: entity.PrcHeaderEntity?.StructureFk,
				projectFk: value,
				companyFk: entity.CompanyFk,
			};

			await this.projectStatus(entity, value);

			const clerkIds = await this.httpService.post<number[]>('procurement/common/data/getClerkFk', clerkData);
			if (clerkIds && clerkIds.length > 0) {
				if (clerkIds[0]) {
					entity.ClerkPrcFk = clerkIds[0];
				}
				if (clerkIds[1]) {
					entity.ClerkReqFk = clerkIds[1];
				}
			}

			if (isNumber(value) && value > 0 && !isFromConfigDialog) {
				// copy certificates from other modules.
				// todo chi: use concrete service
				// this.certificateDataService.copyCertificatesFromOtherModule(value, {PrcHeaderId: entity.PrcHeaderFk, PrjProjectId: value});
			}
		}

		// const oldControllingUnitFk = entity.ControllingUnitFk;

		if (!value) {
			entity.ControllingUnitFk = null;
			entity.ProjectChangeFk = null;
			entity.ProjectFk = value;
			this.requisitionService.readonlyProcessor.process(entity);
			return this.validationService.createSuccessObject();
		}
		// todo chi: use concrete service
		// const controllingUnit = await $injector.get('procurementCommonControllingUnitFactory').getControllingUnit(value, oldControllingUnitFk);
		const controllingUnitId = 1;
		if (controllingUnitId) {
			this.requisitionService.entityProxy.apply(entity).ControllingUnitFk = controllingUnitId;
			this.requisitionService.wantToUpdateCUToItemsAndBoq(entity, true, isFromConfigDialog);
		} else {
			await this.validateBasCurrencyFk(
				{
					entity: entity,
					value: entity.BasCurrencyFk,
					field: 'BasCurrencyFk',
				},
				isFromConfigDialog,
			);
		}
		await this.getAddressAndProjectChange(entity, value);

		if (!isFromConfigDialog) {
			// todo chi: common logic is not available
			// dataService.reloadHeaderText(entity, {
			// 	isOverride: true
			// });
		}

		return this.validationService.createSuccessObject();
	}

	public async validateBasCurrencyFk(info: ValidationInfo<IReqHeaderEntity>, isFromConfigDialog?: boolean) {
		const entity = info.entity;
		let value = info.value as number;
		entity.BasCurrencyFk = value;
		this.requisitionService.readonlyProcessor.process(entity);
		value = value || -1;
		if (value === this.companyContext.loginCompanyEntity.CurrencyFk) {
			entity.ExchangeRate = 1.0;
			entity.OverallDiscount = entity.OverallDiscountOc;
			if (!isFromConfigDialog) {
				this.requisitionService.exchangeRateChanged$.next({
					exchangeRate: entity.ExchangeRate,
					isCurrencyChanged: true,
					currencyFk: entity.BasCurrencyFk, // todo chi: this is not need originally.
				});
			}
			this.validateExchangeRate(entity, 1, 'ExchangeRate', true);
		} else {
			const rate = await this.getCurrentRate(entity, value);

			entity.ExchangeRate = rate;
			// todo chi: common logic is not available
			// entity.OverallDiscount = prcCommonCalculationHelper.round(entity.OverallDiscountOc / rate);
			if (rate && !isFromConfigDialog) {
				this.requisitionService.exchangeRateChanged$.next({
					exchangeRate: entity.ExchangeRate,
					isCurrencyChanged: true,
					currencyFk: entity.BasCurrencyFk,
				});
			}
			this.validateExchangeRate(entity, rate, 'ExchangeRate', true);
		}
		return this.validationService.createSuccessObject();
	}

	public async asyncValidateBasCurrencyFk(info: ValidationInfo<IReqHeaderEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value as number;

		// const originalCurrency = entity[model];
		// const originalRate = entity.ExchangeRate;
		entity.BasCurrencyFk = value;
		// const checkBoqWhenModifyRateProm = this.checkBoqWhenModifyRate(entity.Id);
		if (value === this.companyContext.loginCompanyEntity.CurrencyFk) {
			entity.ExchangeRate = 1;
			if (entity.Version === 0) {
				this.requisitionService.readonlyProcessor.process(entity);
			}
			// todo chi: common logic is not available
			// return procurementCommonExchangerateValidateService.asyncModifyRateThenCheckBoq(entity, value, model, service, dataService, updateExchangeRateUrl, checkBoqWhenModifyRateProm, checkBoqWhenModifyRateMsgBox, originalRate, originalCurrency);
			return Promise.resolve(this.validationService.createSuccessObject());
		} else {
			entity.ExchangeRate = await this.getCurrentRate(entity, entity.BasCurrencyFk);
			if (entity.Version === 0) {
				this.requisitionService.readonlyProcessor.process(entity);
			}
			// todo chi: common logic is not available
			// return procurementCommonExchangerateValidateService.asyncModifyRateThenCheckBoq(entity, value, model, service, dataService, updateExchangeRateUrl, checkBoqWhenModifyRateProm, checkBoqWhenModifyRateMsgBox, originalRate, originalCurrency);
			return Promise.resolve(this.validationService.createSuccessObject());
		}
	}

	protected asyncValidateDateEffective(info: ValidationInfo<IReqHeaderEntity>) {
		return this.validationService.createSuccessObject();
		// todo chi: common logic is not available
		// let procurementCommonDateEffectiveValidateService = $injector.get('procurementCommonDateEffectiveValidateService');
		// let prcHeaderService = moduleContext.getMainService();
		// let prcRequisitionBoqService = $injector.get('prcBoqMainService').getService(prcHeaderService);
		// let selectHeader = prcHeaderService.getSelected();
		// return procurementCommonDateEffectiveValidateService.asyncModifyDateEffectiveAndUpdateBoq(entity, value, model, prcRequisitionBoqService, dataService, service, {
		// 	ProjectId: selectHeader.ProjectFk,
		// 	Module: 'procurement.requisition',
		// 	BoqHeaderId: selectHeader ? selectHeader.PrcHeaderFk : -1,
		// 	HeaderId: entity.Id,
		// 	ExchangeRate: entity.ExchangeRate
		// });
	}

	protected async validateMaterialCatalogFk(info: ValidationInfo<IReqHeaderEntity>) {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : null;
		const itemLists: IPrcItemEntity[] = []; //procurementCommonPrcItemDataService.getList(); // todo chi: use concrete service

		if (!value) {
			this.requisitionService.entityProxy.apply(entity).MaterialCatalogFk = value;
			this.requisitionService.readonlyProcessor.process(entity);
			forEach(itemLists, item => {
				if (item.MdcMaterialFk !== null) {
					// todo chi: use concrete service
					// procurementCommonPrcItemDataService.setColumnsReadOnly(itemLists[i], false);
					// procurementCommonPrcItemDataService.markItemAsModified(itemLists[i]);
				}
			});

			return this.validationService.createSuccessObject();
		}
		if (entity.MaterialCatalogFk !== value) {
			this.requisitionService.entityProxy.apply(entity).MaterialCatalogFk = value;
			const tempValue = value || -1;
			const data = await lastValueFrom(this.materialCatalogLookupService.getItemByKey({ id: tempValue }));
			if (!data) {
				return this.validationService.createSuccessObject();
			}

			// trigger changed event
			const hasMdcCatPaymentTermFks = !!(data.PaymentTermAdFk ?? data.PaymentTermFiFk ?? data.PaymentTermFk);
			const dontSetPaymentTerm = hasMdcCatPaymentTermFks;
			await this.validateBusinessPartnerFk(
				{
					entity: entity,
					value: data.BusinessPartnerFk,
					field: 'BusinessPartnerFk',
				},
				data.SupplierFk,
				data.SubsidiaryFk,
			);
			await this.validateSupplierFk(
				{
					entity: entity,
					value: data.SupplierFk,
					field: 'SupplierFk',
				},
				dontSetPaymentTerm,
			);

			// apply changed values
			entity.BusinessPartnerFk = data.BusinessPartnerFk;
			entity.SubsidiaryFk = data.SubsidiaryFk;
			entity.SupplierFk = data.SupplierFk;
			entity.IncotermFk = data.IncotermFk;
			if (hasMdcCatPaymentTermFks) {
				entity.BasPaymentTermFiFk = data.PaymentTermFiFk;
				entity.BasPaymentTermPaFk = data.PaymentTermFk;
				entity.BasPaymentTermAdFk = data.PaymentTermAdFk;
			}

			forEach(itemLists, (item) => {
				if (item.MdcMaterialFk !== null) {
					item.BasPaymentTermFiFk = data.PaymentTermFiFk;
					item.BasPaymentTermPaFk = data.PaymentTermFk;
					// itemLists[i].BasPaymentTermAdFk = data.PaymentTermAdFk; // todo chi: no such field
					item.PrcIncotermFk = entity.IncotermFk;
					// todo chi: use concrete service
					// procurementCommonPrcItemDataService.setColumnsReadOnly(itemLists[i], true);
					// procurementCommonPrcItemDataService.markItemAsModified(itemLists[i]);
				}
			});

			this.requisitionService.readonlyProcessor.process(entity);
		}
		return this.validationService.createSuccessObject();
	}

	public validateAssetMasterFk(info: ValidationInfo<IReqHeaderEntity>): ValidationResult {
		return this.validationService.createSuccessObject(); // todo chi: do it later
	}

	//
	public validateDialogConfigurationFk(info: ValidationInfo<IReqHeaderEntity>): ValidationResult {
		return this.validationService.createSuccessObject(); // todo chi: do it later
	}

	protected override generateValidationFunctions(): IValidationFunctions<IReqHeaderEntity> {
		return {
			BusinessPartnerFk: this.validateBusinessPartnerFk,
			SupplierFk: this.validateSupplierFk,
			IncotermFk: this.validateIncotermFk,
			Code: [this.validateCode, this.asyncValidateCode],
			BasCurrencyFk: [this.validateBasCurrencyFk, this.asyncValidateBasCurrencyFk],
			PackageFk: this.validatePackageFk,
			ExchangeRate: this.asyncValidateExchangeRate,
			TaxCodeFk: this.validateTaxCodeFk,
			ReqHeaderFk: this.validateReqHeaderFk,
			ReqStatusFk: this.validateReqStatusFk,
			BasPaymentTermFiFk: this.validateBasPaymentTermFiFk,
			BasPaymentTermPaFk: this.validateBasPaymentTermPaFk,
			BasPaymentTermAdFk: this.validateBasPaymentTermAdFk,
			DateEffective: this.asyncValidateDateEffective,
			ProjectFk: this.validateProjectFk,
			MaterialCatalogFk: this.validateMaterialCatalogFk,
			DateReceived: this.validateDateReceived,
			DateRequired: this.validateDateRequired,
			BpdVatGroupFk: this.validateBpdVatGroupFk,
			BoqWicCatFk: this.validateBoqWicCatFk,
			BoqWicCatBoqFk: this.asyncValidateBoqWicCatBoqFk,
			ControllingUnitFk: this.validateControllingUnitFk,
			OverallDiscount: this.validateOverallDiscount,
			OverallDiscountOc: this.validateOverallDiscountOc,
			OverallDiscountPercent: this.validateOverallDiscountPercent

			// todo chi: complex type
			// StructureFk: this.validateStructureFk,
			// ConfigurationFk: this.validateConfigurationFk,
			// StrategyFk: this.validateStrategyFk
		};
	}

	protected validateIncotermFk(info: ValidationInfo<IReqHeaderEntity>) {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : undefined;

		if (!entity) {
			return this.validationService.createSuccessObject();
		}
		if (entity.IncotermFk !== value) {
			const items: IPrcItemEntity[] = []; // var items = procurementCommonPrcItemDataService.getList(); // tood chi: use concrete service
			if (items.length > 0) {
				const itemIncotermsHasDiff = this.hasDiffData(items, value, (e) => e.PrcIncotermFk);
				if (itemIncotermsHasDiff) {
					this.messageBoxService
						.showYesNoDialog({
							bodyText: this.translationService.instant('procurement.common.updateIncotermToItem').text,
							dontShowAgain: true,
							id: this.updateIncotermToItemDialogId,
						})
						?.then((response) => {
							if (response.closingButtonId === StandardDialogButtonId.Ok) {
								const items: IPrcItemEntity[] = []; // todo chi: procurementCommonPrcItemDataService.getList(); // tood chi: use concrete service
								forEach(items, item => {
									item.PrcIncotermFk = value;
									// procurementCommonPrcItemDataService.markItemAsModified(items[i]); // tood chi: use concrete service
								});
							}
						});
				}
			}
			entity.IncotermFk = value;
		}
		return this.validationService.createSuccessObject();
	}

	protected validateCode(info: ValidationInfo<IReqHeaderEntity>): ValidationResult {
		const list = this.requisitionService.getList();
		const validateResult = this.validationService.isUnique(this.requisitionService, info, list);
		if (!validateResult.valid) {
			validateResult.error = this.translationService.instant('procurement.requisition.ReqHeaderReferenceUniqueError').text;
		}
		return validateResult;
	}

	protected async asyncValidateCode(info: ValidationInfo<IReqHeaderEntity>): Promise<ValidationResult> {
		return await this.validationService.isAsyncUnique(info, 'procurement/requisition/requisition/isunique', 'procurement.requisition.code');
	}

	protected validateBasPaymentTermFiFk(info: ValidationInfo<IReqHeaderEntity>) {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : undefined;
		if (!entity) {
			return this.validationService.createSuccessObject();
		}
		if (entity.BasPaymentTermFiFk !== value) {
			const items: IPrcItemEntity[] = []; // procurementCommonPrcItemDataService.getList(); // todo chi: use concrete service
			if (items.length > 0) {
				const itemsFiHasDiff = this.hasDiffData(items, value, (e) => e.BasPaymentTermFiFk);
				if (itemsFiHasDiff) {
					this.messageBoxService
						.showYesNoDialog({
							bodyText: this.translationService.instant('procurement.common.updatePaymentTermFIToItems').text,
							dontShowAgain: true,
							id: this.updatePaymentTermFIToItemsDialogId,
						})
						?.then((response) => {
							if (response.closingButtonId === StandardDialogButtonId.Ok) {
								const items: IPrcItemEntity[] = []; // todo chi: procurementCommonPrcItemDataService.getList(); // tood chi: use concrete service
								forEach(items, items => {
									items.BasPaymentTermFiFk = value;
									// procurementCommonPrcItemDataService.markItemAsModified(items[i]); // tood chi: use concrete service
								});
							}
						});
				}
			}
			entity.BasPaymentTermFiFk = value;
		}
		return this.validationService.createSuccessObject();
	}

	protected validateBasPaymentTermPaFk(info: ValidationInfo<IReqHeaderEntity>) {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : undefined;

		if (!entity) {
			return this.validationService.createSuccessObject();
		}
		if (entity.BasPaymentTermPaFk !== value) {
			const items: IPrcItemEntity[] = []; // procurementCommonPrcItemDataService.getList(); // todo chi: use concrete service
			if (items.length > 0) {
				const itemsPaHasDiff = this.hasDiffData(items, value, (e) => e.BasPaymentTermPaFk);
				if (itemsPaHasDiff) {
					this.messageBoxService
						.showYesNoDialog({
							bodyText: this.translationService.instant('procurement.common.updatePaymentTermPAToItems').text,
							dontShowAgain: true,
							id: this.updatePaymentTermPAToItemsDialogId,
						})
						?.then((response) => {
							if (response.closingButtonId === StandardDialogButtonId.Ok) {
								const items: IPrcItemEntity[] = []; // todo chi: procurementCommonPrcItemDataService.getList(); // tood chi: use concrete service
								forEach(items, items => {
									items.BasPaymentTermPaFk = value;
									// procurementCommonPrcItemDataService.markItemAsModified(items[i]); // tood chi: use concrete service
								});
							}
						});
				}
			}
			entity.BasPaymentTermPaFk = value;
		}
		return this.validationService.createSuccessObject();
	}

	protected validateBasPaymentTermAdFk(info: ValidationInfo<IReqHeaderEntity>) {
		info.entity.BasPaymentTermAdFk = info.value ? (info.value as number) : null;
		return this.validationService.createSuccessObject();
	}

	private validatePaymentTermPaFkandPaymentTermFiFk(entity: IReqHeaderEntity, paymentTermPaFk: number | null | undefined, paymentTermFiFk: number | null | undefined, isFromSupplierFk: boolean) {
		if (!entity) {
			return this.validationService.createSuccessObject();
		}
		if (entity.SupplierFk && !isFromSupplierFk) {
			return this.validationService.createSuccessObject();
		}

		if (entity.BasPaymentTermPaFk !== paymentTermPaFk || entity.BasPaymentTermFiFk !== paymentTermFiFk) {
			const items: IPrcItemEntity[] = []; // procurementCommonPrcItemDataService.getList(); todo chi: use concrete service
			if (items.length > 0) {
				const itemsPaHasDiff = this.hasDiffData(items, paymentTermPaFk, (e) => e.BasPaymentTermPaFk);
				const itemsFiHasDiff = this.hasDiffData(items, paymentTermFiFk, (e) => e.BasPaymentTermFiFk);
				if (itemsPaHasDiff || itemsFiHasDiff) {
					this.messageBoxService
						.showYesNoDialog({
							bodyText: this.translationService.instant('procurement.common.updatePaymentTermFIandPAToItems').text,
							dontShowAgain: true,
							id: this.updatePaymentTermFIandPAToItemsDialogId,
						})
						?.then((response) => {
							if (response.closingButtonId === StandardDialogButtonId.Ok) {
								const items: IPrcItemEntity[] = []; // todo chi: procurementCommonPrcItemDataService.getList(); // tood chi: use concrete service
								forEach(items, item => {
									item.BasPaymentTermPaFk = paymentTermPaFk ?? undefined;
									item.BasPaymentTermFiFk = paymentTermFiFk ?? undefined;
									// procurementCommonPrcItemDataService.markItemAsModified(items[i]); // tood chi: use concrete service
								});
							}
						});
				}
			}

			entity.BasPaymentTermPaFk = paymentTermPaFk;
			entity.BasPaymentTermFiFk = paymentTermFiFk;
		}
		return true;
	}

	protected asyncValidateExchangeRate(info: ValidationInfo<IReqHeaderEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value as number;
		if (entity.ExchangeRate !== value) {
			// const originalRate = entity.ExchangeRate;
			// const checkBoqWhenModifyRateProm = this.checkBoqWhenModifyRate(entity.Id);
			entity.ExchangeRate = value;
			// todo chi: common logic is not available
			// return procurementCommonExchangerateValidateService.asyncModifyRateThenCheckBoq(entity, value, model, service, dataService, updateExchangeRateUrl, checkBoqWhenModifyRateProm, checkBoqWhenModifyRateMsgBox, originalRate);
		}
		return Promise.resolve(this.validationService.createSuccessObject());
	}

	// todo chi: validatePrcHeaderEntity$ConfigurationFk
	public async validateConfigurationFk(info: ValidationInfo<IReqHeaderEntity>, isFromWizard?: boolean) {
		const entity = info.entity;
		const value = info.value as number;
		if (entity?.PrcHeaderEntity && entity.PrcHeaderEntity.ConfigurationFk !== value) {
			const originalEntity: IOriginalData = {
				originalConfigurationFk: entity.PrcHeaderEntity.ConfigurationFk,
				originalStructureFk: entity.PrcHeaderEntity.StructureFk,
			};
			originalEntity.originalConfigurationFk = entity.PrcHeaderEntity.ConfigurationFk;
			originalEntity.originalStructureFk = entity.PrcHeaderEntity.StructureFk;

			const oldConfigHeadId = entity.PrcHeaderEntity.ConfigurationFk ?
				await lastValueFrom(this.configurationLookupService.getItemByKey({ id: entity.PrcHeaderEntity.ConfigurationFk })) : null;
			const newConfigHeadId = await lastValueFrom(this.configurationLookupService.getItemByKey({ id: value }));

			if (newConfigHeadId) {
				entity.PrcContracttypeFk = newConfigHeadId.PrcContractTypeFk;
				entity.PrcAwardmethodFk = newConfigHeadId.PrcAwardMethodFk;

				this.validatePaymentTermPaFkandPaymentTermFiFk(entity, newConfigHeadId.PaymentTermPaFk, newConfigHeadId.PaymentTermFiFk, false);

				if (value && entity.Version === 0) {
					entity.Code = this.requisitionService.numberGenerator.provideNumberDefaultText(newConfigHeadId.RubricCategoryFk);
					if (!entity.Code) {
						const codeTr = this.translationService.instant('procurement.requisition.code').text;
						const validateResult = this.validationService.createErrorObject({
							key: 'cloud.common.generatenNumberFailed',
							params: { fieldName: codeTr },
						});
						this.requisitionService.addInvalid(entity, { field: 'Code', result: validateResult });
					} else {
						this.requisitionService.removeInvalid(entity, {
							field: 'Code',
							result: this.validationService.createSuccessObject(),
						});
					}
				}
			}

			entity.PrcHeaderEntity.ConfigurationFk = value;
			this.requisitionService.readonlyProcessor.process(entity);
			if (entity.PrcHeaderEntity.StructureFk) {
				this.reloadGeneralsAndCertificates(entity, originalEntity);
			}
			if (oldConfigHeadId && newConfigHeadId && oldConfigHeadId.Id !== newConfigHeadId.Id && !isFromWizard) {
				// todo chi: common logic is not available
				// procurementCommonTotalDataService.copyTotalsFromConfiguration();
			}
		}

		// todo chi: common logic is not available
		// const defaultListNotModified = null;
		// const sourceSectionId = 32;// 32 is  prcurement Configration
		// const targetSectionId = 6;// 6 is    requisition.
		//
		// var charDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(dataService, targetSectionId);
		// defaultListNotModified = charDataService.getList();
		// var newItem = [];
		// angular.forEach(defaultListNotModified, function (item) {
		// 	newItem.push(item);
		// });
		if (value) {
			// todo chi: common logic is not available
			// const sourceHeaderId = value;
			// const targetHeaderId = this.requisitionService.getSelectedEntity()!.Id;
			// const charData = await this.httpService.get('basics/characteristic/data/getAndSetList', {
			// 	params: {
			// 		sourceHeaderId: sourceHeaderId,
			// 		targetHeaderId: targetHeaderId,
			// 		sourceSectionId: sourceSectionId,
			// 		targetSectionId: targetSectionId
			// 	}
			// });
			// angular.forEach(charData, function (item) {
			// 	var oldItem = _.find(defaultListNotModified, {CharacteristicFk: item.CharacteristicFk});
			// 	if (!oldItem) {
			// 		newItem.push(item);
			// 	}
			// });
			// charDataService.setList(newItem);
			// angular.forEach(newItem, function (item) {
			// 	charDataService.markItemAsModified(item);
			// });

			// not from change configuration wizard
			if (!isFromWizard) {
				// todo chi: common logic is not available
				// dataService.reloadHeaderText(entity, {
				// 	isOverride: true
				// });
			}
		}
		return this.validationService.createSuccessObject();
	}

	public async asyncValidateDialogConfigurationFk(info: ValidationInfo<IReqHeaderEntity>) {
		const entity = info.entity;
		const value = info.value as number;

		if (entity?.PrcHeaderEntity && entity.PrcHeaderEntity.ConfigurationFk !== value) {
			if (value && entity.Version === 0) {
				const newConfigHeadId = await lastValueFrom(this.configurationLookupService.getItemByKey({ id: value }));
				entity.Code = this.requisitionService.numberGenerator.provideNumberDefaultText(newConfigHeadId.RubricCategoryFk);
				if (!entity.Code) {
					const codeTr = this.translationService.instant('procurement.requisition.code').text;
					const validateResult = this.validationService.createErrorObject({
						key: 'cloud.common.generatenNumberFailed',
						params: { fieldName: codeTr },
					});
					this.requisitionService.addInvalid(entity, { field: 'Code', result: validateResult });
				} else {
					this.requisitionService.addInvalid(entity, {
						field: 'Code',
						result: this.validationService.createSuccessObject(),
					});
				}
			}
		}
		return this.validationService.createSuccessObject();
	}

	protected validateDateReceived(info: ValidationInfo<IReqHeaderEntity>) {
		return this.validationService.isMandatory(info, 'cloud.common.entityReceived');
	}

	protected validateDateRequired(info: ValidationInfo<IReqHeaderEntity>, isFromConfigDialog?: boolean) {
		const entity = info.entity;
		const value = info.value ? (info.value as Date) : null;
		if (entity.DateRequired !== value) {
			if (!isFromConfigDialog) {
				const bodyText = this.translationService.instant('procurement.common.deliverDateUpdateToItemInfo').text;
				this.messageBoxService
					.showYesNoDialog({
						bodyText: bodyText,
						dontShowAgain: true,
						id: this.deliverDateUpdateToItemInfoDialogId,
					})
					?.then((response) => {
						if (response.closingButtonId === StandardDialogButtonId.Ok) {
							// todo chi: use concrete service
							const items: IPrcItemEntity[] = []; // procurementCommonPrcItemDataService.getList();
							forEach(items, item => {
								if (!item.Hasdeliveryschedule) {
									item.DateRequired = value ? value.toString() : undefined; // todo chi: right?
									// procurementCommonPrcItemDataService.markItemAsModified(items[i]);
								}
							});
						}
					});
			}

			entity.DateRequired = value;
			entity.DateEffective = value || entity.DateEffective;
		}
		return this.validationService.createSuccessObject();
	}

	public validateDialogProjectFk(info: ValidationInfo<IReqHeaderEntity>) {
		return this.validateProjectFk(info, true);
	}

	public validateDialogBusinessPartnerFk(info: ValidationInfo<IReqHeaderEntity>) {
		return this.validateBusinessPartnerFk(info, undefined, undefined, true);
	}

	public validateDialogPackageFk(info: ValidationInfo<IReqHeaderEntity>) {
		return this.validatePackageFk(info, true);
	}

	public validateDialogReqHeaderFk(info: ValidationInfo<IReqHeaderEntity>) {
		return this.validateReqHeaderFk(info, true);
	}

	public validateDialogTaxCodeFk(info: ValidationInfo<IReqHeaderEntity>) {
		return this.validateTaxCodeFk(info, undefined, true);
	}

	public validateDialogDateRequired(info: ValidationInfo<IReqHeaderEntity>) {
		return this.validateDateRequired(info, true);
	}

	public validateDialogStructureFk(info: ValidationInfo<IReqHeaderEntity>) {
		return this.validateStructureFk(info, true);
	}

	public asyncSetPrcConfigFkAndBillingSchemaFkForWizard(entity: IReqHeaderEntity, prcConfigFk: number) {
		return this.validationService.createSuccessObject();
		// todo chi: common logic is not available
		// var arrPromise=[];
		// if(entity && entity.PrcHeaderEntity && entity.PrcHeaderEntity.ConfigurationFk !== prcConfigFk) {
		// 	var promise1 = procurementCommonTotalDataService.asyncCopyTotalsFromConfiguration(prcConfigFk);
		// 	arrPromise.push(promise1);
		// }
		// var promise2 = service.validatePrcHeaderEntity$ConfigurationFk(entity, prcConfigFk, 'ConfigurationFk', true);
		// arrPromise.push(promise2);
		// return $q.all(arrPromise);
	}

	protected validateBpdVatGroupFk(info: ValidationInfo<IReqHeaderEntity>) {
		// todo chi: need?
		info.entity.originVatGroupFk = info.entity.BpdVatGroupFk;
		return this.validationService.createSuccessObject();
	}

	// todo chi: validatePrcHeaderEntity$StrategyFk
	protected validateStrategyFk(info: ValidationInfo<IReqHeaderEntity>) {
		const entity = info.entity;
		const value = info.value as number;
		const result = this.validationService.createSuccessObject();
		if ((!value || value < 1) && entity.PrcHeaderEntity && (!entity.PrcHeaderEntity.StrategyFk || entity.PrcHeaderEntity.StrategyFk < 1)) {
			result.valid = false;
			result.error = this.translationService.instant('cloud.common.ValidationRule_ForeignKeyRequired', { p_0: this.translationService.instant('procurement.requisition.headerGrid.reqheaderStrategy').text }).text;
		}
	}

	protected validateOverallDiscount(info: ValidationInfo<IReqHeaderEntity>) {
		return this.overallDiscountService.validateOverallDiscountFields(info);
	}

	protected validateOverallDiscountOc(info: ValidationInfo<IReqHeaderEntity>) {
		return this.overallDiscountService.validateOverallDiscountFields(info);
	}

	protected validateOverallDiscountPercent(info: ValidationInfo<IReqHeaderEntity>) {
		return this.overallDiscountService.validateOverallDiscountPercent(info);
	}

	protected validateBoqWicCatFk(info: ValidationInfo<IReqHeaderEntity>) {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : null;
		const originBoqWicCatFk = entity.BoqWicCatFk;
		entity.BoqWicCatFk = value;
		if (entity.BoqWicCatBoqFk !== null) {
			entity.BoqWicCatBoqFk = null;
			// todo chi: common logic is not available
			// boqMainLookupFilterService.setSelectedWicGroupIds([]);
			// boqMainLookupFilterService.setSelectedBoqHeader(null);
		} else {
			// todo chi: common logic is not available
			// boqMainLookupFilterService.setSelectedWicGroupIds([value]);
		}
		if (originBoqWicCatFk !== value) {
			this.requisitionService.readonlyProcessor.process(entity);
		}
		return this.validationService.createSuccessObject();
	}

	protected asyncValidateBoqWicCatBoqFk(info: ValidationInfo<IReqHeaderEntity>) {
		return this.validationService.createSuccessObject();
		// const entity = info.entity;
		// const value = info.value ? info.value as number : null;

		// todo chi: common logic is not available
		// var prcBoqServiceFactory = $injector.get('procurementCommonPrcBoqService');
		// var prcBoqService = prcBoqServiceFactory.getService(dataService);
		// var boqs = prcBoqService.getList();
		// var defer = $q.defer();
		// if (value && entity.BoqWicCatBoqFk !== value) {
		// 	if (boqs && boqs.length) {
		// 		var options = {
		// 			headerText: $translate.instant('procurement.contract.conEntityBoqWicCatBoqFk'),
		// 			bodyText: $translate.instant('procurement.contract.willClearAllBoqs'),
		// 			showYesButton: true,
		// 			showNoButton: true,
		// 			iconClass: 'ico-question',
		// 			id: willClearAllBoqsDialogId,
		// 			dontShowAgain: true
		// 		};
		// 		return moduleContext.showDialogAndAgain(options).then(function (response) {
		// 			if (response.yes === true) {
		// 				return changeBoqWicCatBoqFk(entity, value, model).then(function () {
		// 					var deleteBoqPromises = [];
		// 					_.forEach(boqs, function(b) {
		// 						deleteBoqPromises.push(prcBoqService.deleteItem(b));
		// 					});
		// 					return $q.all(deleteBoqPromises).then(function() {
		// 						return true;
		// 					});
		// 				});
		// 			}
		// 			else {
		// 				return {apply: false, valid: true};
		// 			}
		// 		});
		// 	}
		// 	else {
		// 		return changeBoqWicCatBoqFk(entity, value, model);
		// 	}
		// }
		// defer.resolve(true);
		// return defer.promise;
	}

	protected validateControllingUnitFk(info: ValidationInfo<IReqHeaderEntity>) {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : null;
		if (value && entity.ControllingUnitFk !== value) {
			this.requisitionService.entityProxy.apply(entity).ControllingUnitFk = value;
			this.requisitionService.wantToUpdateCUToItemsAndBoq(entity);
		}
		return this.validationService.createSuccessObject();
	}

	private async projectStatus(entity: IReqHeaderEntity, projectId?: number | null) {
		if (!projectId) {
			entity.ProjectStatusFk = null;
			return;
		}
		const project = await lastValueFrom(this.projectLookupService.getItemByKey({ id: projectId }));

		if (project) {
			entity.ProjectStatusFk = project.StatusFk;
		}
	}

	private async getAddressAndProjectChange(entity: IReqHeaderEntity, projectId: number) {
		entity.ProjectFk = projectId;
		this.requisitionService.readonlyProcessor.process(entity);
		if (!entity.AddressEntity && !this.packageUpdatingAddress) {
			const address = await this.httpService.get<AddressEntity>('procurement/package/package/getdeliveryaddress', {
				params: {
					projectId: projectId,
				},
			});

			if (address) {
				entity.AddressFk = address.Id;
				entity.AddressEntity = address;
			}
		}
	}

	// region reload certificates and generals when configuration or structure changed in prc header
	private reloadGeneralsAndCertificates(entity: IReqHeaderEntity, originalEntity: IOriginalData) {
		// todo chi: common logic is not available
		// procurementCommonCertificateDataService.clearConfiguration2certCache();
		if (originalEntity?.originalConfigurationFk && originalEntity.originalStructureFk) {
			// todo chi: common logic is not available
			// procurementCommonGeneralsDataService.reloadData(originalEntity);
			// procurementCommonCertificateDataService.reloadData(originalEntity);
		} else if (entity?.PrcHeaderEntity?.ConfigurationFk && entity.PrcHeaderEntity.StructureFk) {
			// todo chi: common logic is not available
			// procurementCommonGeneralsDataService.reloadData();
			// procurementCommonCertificateDataService.reloadData();
		}
	}

	private async setClerkPrcFkAndClerkReqFk(entity: IReqHeaderEntity, prcStructureFk: number | null | undefined, projectFk: number, companyFk: number) {
		const clerkData = {
			prcStructureFk: prcStructureFk,
			projectFk: projectFk,
			companyFk: companyFk,
		};
		const result = await this.httpService.post<number[]>('procurement/common/data/getClerkFk', clerkData);
		if (result.length > 0) {
			if (!isNil(result[0])) {
				entity.ClerkPrcFk = result[0];
			}
			if (!isNil(result[1])) {
				entity.ClerkReqFk = result[1];
			}
		}
	}

	private validateExchangeRate(entity: IReqHeaderEntity, value: number, model: string, skipFireEvent: boolean) {
		const result = this.validationService.createSuccessObject();

		this.requisitionService.removeInvalid(entity, { field: model, result: result });

		// todo chi: common logic is not available
		// result = procurementCommonExchangerateFormatterService.test(value);
		if (!result.valid) {
			this.requisitionService.addInvalid(entity, { field: model, result: result });

			// todo chi: how to deal with isZero
			// if (!result.isZero) {
			// 	return result;
			// }
		}

		// todo chi: common logic is not available
		// moduleContext.exchangeRate = entity.ExchangeRate;
		if (entity.ExchangeRate !== value) {
			// dataService.isTotalDirty = true; // todo chi: how to set isTotalDirty
			entity.ExchangeRate = value;
			// todo chi: common logic is not available
			// entity.OverallDiscount = prcCommonCalculationHelper.round(entity.OverallDiscountOc / value);
			if (!skipFireEvent) {
				this.requisitionService.exchangeRateChanged$.next({
					exchangeRate: value,
					currencyFk: entity.BasCurrencyFk,
					isCurrencyChanged: false,
				});
			}
		}
		return result;
	}

	private async getCurrentRate(entity: IReqHeaderEntity, value: number): Promise<number> {
		return await this.httpService.get<number>('procurement/common/exchangerate/rate', {
			params: {
				CompanyFk: this.companyContext.loginCompanyEntity.Id,
				CurrencyForeignFk: value,
				ProjectFk: entity.ProjectFk ?? 0,
				currencyRateTypeFk: 2,
			},
		});
	}

	private checkBoqWhenModifyRate(id: number) {
		return () => {
			return this.checkForVersionBoqs(id);
		};
	}

	private checkForVersionBoqs(packageFk: number) {
		return this.httpService.get('procurement/common/boq/checkforversionboqs' + '?packageFk=' + packageFk);
	}

	private checkBoqWhenModifyRateMsgBox() {
		return this.messageBoxService.showMsgBox({
			headerText: 'procurement.common.changeCurrencyVersionBoqHeader',
			bodyText: 'procurement.common.changeCurrencyVersionBoqText',
			iconClass: 'ico-info',
		});
	}

	private overWriteGeneralsAndCertificates(entity: IReqHeaderEntity, originalEntity: IReqHeaderEntity) {
		// todo chi: common logic is not available
		// procurementCommonGeneralsDataService.overWriteData(entity, originalEntity);
		// procurementCommonCertificateDataService.overWriteData(entity, originalEntity);
	}

	private async checkForRelatedVersionBoqs(prcHeaderFk: number) {
		return await this.httpService.get('procurement/common/boq/checkforrelatedversionboqs' + '?prcHeaderFk=' + prcHeaderFk);
	}

	private hasDiffData(items: IPrcItemEntity[], value: number | null | undefined, fun: (entity: IPrcItemEntity) => number | null | undefined): boolean {
		return items.some((e) => {
			if (value === null || value === undefined) {
				return isNumber(fun(e));
			} else if (isNumber(fun(e))) {
				return fun(e) !== value;
			}
			return true;
		});
	}

	private uuidGenerator(long?: boolean) {
		if (long) {
			return this._p8() + this._p8(true) + this._p8(true) + this._p8();
		} else {
			return this._p8() + this._p8() + this._p8() + this._p8();
		}
	}

	private _p8(s?: boolean) {
		const p = (Math.random().toString(16) + '000000000').substring(2, 8);

		return s ? '-' + p.substring(0, 4) + '-' + p.substring(4, 4) : p;
	}

	// todo chi: for complex type fields: validateMainEventDto$EndRelevant, validateMainEventDto$StartRelevant
}