import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { ProcurementPackageHeaderDataService } from '../package-header-data.service';
import { AddressEntity, BasicsSharedDataValidationService, BasicsSharedProcurementConfigurationLookupService, BasicsSharedProcurementStructureLookupService, BasicsSharedTaxCodeLookupService, Rubric } from '@libs/basics/shared';
import { PlatformConfigurationService, PlatformHttpService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { filter, find, isNil, forEach, extend, isEmpty } from 'lodash';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { ProcurementCommonCompanyContextService } from '@libs/procurement/common';
import { IBasicsAssetMasterEntity } from '@libs/basics/interfaces';
import { ProcurementPackageLookupService } from '@libs/procurement/shared';
import { IBoqItemEntity } from '@libs/boq/interfaces';
import { Package2HeaderDataService } from '../package-2header-data.service';
import { IProjectTelephoneNumberResponse } from '../../model/entities/project-telephone-number-response-entity.interface';
import { ICanGenerateCodeResult } from '../../model/entities/can-generate-code-result.interface';
import { BusinessPartnerLogicalValidatorFactoryService } from '@libs/businesspartner/shared';
import { ProcurementPackageCurrencyExchangeRateService } from '../procurement-package-currency-exchange-rate.service';
import { ProcurementPackageOverallDiscountService } from '../procurement-package-overall-discount.service';
import { IPrcBoqExtendedEntity } from '@libs/procurement/interfaces';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageHeaderValidationService extends BaseValidationService<IPrcPackageEntity> {
	private readonly packageService = inject(ProcurementPackageHeaderDataService);
	private readonly validationService = inject(BasicsSharedDataValidationService);
	private readonly translationService = inject(PlatformTranslateService);
	private readonly httpService = inject(PlatformHttpService);
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly configurationLookupService = inject(BasicsSharedProcurementConfigurationLookupService);
	private readonly structureLookupService = inject(BasicsSharedProcurementStructureLookupService);
	private readonly taxCodeLookupService = inject(BasicsSharedTaxCodeLookupService);
	private readonly packageLookupService = inject(ProcurementPackageLookupService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly companyContext = inject(ProcurementCommonCompanyContextService);
	private readonly businessPartnerValidatorService = inject(BusinessPartnerLogicalValidatorFactoryService).create({
		dataService: this.packageService,
	});
	private readonly currencyExchangeRate = inject(ProcurementPackageCurrencyExchangeRateService);
	private readonly overallDiscountService = inject(ProcurementPackageOverallDiscountService);

	protected override generateValidationFunctions(): IValidationFunctions<IPrcPackageEntity> {
		return {
			Code: [this.validateCode, this.asyncValidateCode],
			StructureFk: this.validateStructureFk,
			PlannedStart: this.validatePlannedStart,
			PlannedEnd: this.validatePlannedEnd,
			ActualStart: this.validateActualStart,
			ActualEnd: this.validateActualEnd,
			ScheduleFk: this.validateScheduleFk,
			TaxCodeFk: this.validateTaxCodeFk,
			CurrencyFk: this.validateCurrencyFk,
			DateEffective: this.asyncValidateDateEffective,
			ExchangeRate: this.validateExchangeRate,
			ConfigurationFk: this.validateConfigurationFk,
			AssetMasterFk: this.validateAssetMasterFk,
			ActivityFk: this.validateActivityFk,
			BpdVatGroupFk: this.validateBpdVatGroupFk,
			MdcControllingUnitFk: this.validateMdcControllingUnitFk,
			ProjectFk: this.validateProjectFk,
			BusinessPartnerFk: this.validateBusinessPartnerFk,
			SupplierFk: this.validateSupplierFk,
			SubsidiaryFk: this.validateSubsidiaryFk,
			OverallDiscount: this.validateOverallDiscount,
			OverallDiscountOc: this.validateOverallDiscountOc,
			OverallDiscountPercent: this.validateOverallDiscountPercent
		};
	}

	public getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPrcPackageEntity> {
		return this.packageService;
	}

	protected async validateBusinessPartnerFk(info: ValidationInfo<IPrcPackageEntity>) {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : undefined;

		await this.businessPartnerValidatorService.businessPartnerValidator({
			entity: entity,
			value: value || undefined,
		});
		this.packageService.entityProxy.apply(entity).BusinessPartnerFk = value;
		return Promise.resolve(this.validationService.createSuccessObject());
	}

	protected async validateSupplierFk(info: ValidationInfo<IPrcPackageEntity>) {
		return await this.businessPartnerValidatorService.supplierValidator(info.entity, info.value ? (info.value as number) : 0);
	}

	protected async validateSubsidiaryFk(info: ValidationInfo<IPrcPackageEntity>) {
		return await this.businessPartnerValidatorService.subsidiaryValidator(info.entity, info.value ? (info.value as number) : 0);
	}

	protected validateCode(info: ValidationInfo<IPrcPackageEntity>): ValidationResult {
		if (info.field === 'Description') {
			return this.validationService.createSuccessObject();
		}

		const packages = filter(this.packageService.getList(), function (item) {
			return item.ProjectFk === info.entity.ProjectFk;
		});

		const validateResult = this.validationService.isUnique(this.packageService, info, packages);
		if (!validateResult.valid) {
			validateResult.error = this.translationService.instant('procurement.package.packageCodeUniqueError').text;
		}
		return validateResult;
	}

	protected async asyncValidateCode(info: ValidationInfo<IPrcPackageEntity>): Promise<ValidationResult> {
		const model = info.field;
		const validationResult = this.validationService.createSuccessObject();
		if (model === 'Description') {
			return Promise.resolve(validationResult);
		}

		const modelTr = this.translationService.instant('cloud.common.entityCode').text;
		const error = this.translationService.instant('cloud.common.uniqueValueErrorMessage', { object: modelTr }).text;

		const result = await this.httpService.get<boolean>('procurement/package/package/isunique', {
			params: {
				id: info.entity.Id,
				projectFk: info.entity.ProjectFk,
				code: info.value as string,
			},
		});

		if (!result) {
			validationResult.error = error;
		}
		return Promise.resolve(validationResult);
	}

	public async validateDialogCode(info: ValidationInfo<IPrcPackageEntity>): Promise<ValidationResult> {
		const value = info.value;
		const entity = info.entity;
		const translationObject = this.translationService.instant('cloud.common.isGenerated').text;
		const modelTr = this.translationService.instant('cloud.common.entityCode').text;
		const validationResult = this.validationService.createSuccessObject();

		if (!value && entity.Code && entity.Code !== translationObject) {
			validationResult.valid = false;
			validationResult.error = this.translationService.instant('cloud.common.emptyOrNullValueErrorMessage', { object: modelTr }).text;
			return Promise.resolve(validationResult);
		} else {
			// remove configurationFK error
			this.packageService.removeInvalid(entity, { field: 'ConfigurationFk', result: { valid: true, apply: true } });
			if (!entity.ProjectFk) {
				return Promise.resolve({ valid: true, apply: true });
			}

			const modelTr = this.translationService.instant('cloud.common.entityCode').text;
			const error = this.translationService.instant('cloud.common.uniqueValueErrorMessage', { object: modelTr }).text;
			const id = entity.Id;
			const config = entity.ConfigurationFk ?
				await lastValueFrom(this.configurationLookupService.getItemByKey({ id: entity.ConfigurationFk })) : null;
			const hasToGenerate = this.packageService.numberGenerator.hasNumberGenerateConfig(config ? config.RubricCategoryFk : -1);
			if (!hasToGenerate || entity.Version !== 0) {
				const result = await this.httpService.get<boolean>('procurement/package/package/isunique', {
					params: {
						id: id,
						projectFk: entity.ProjectFk,
						code: info.value as string,
					},
				});

				if (!result) {
					validationResult.error = error;
				}
			}
		}

		if (validationResult.valid) {
			this.packageService.removeInvalid(entity, { field: info.field, result: validationResult });
		} else {
			this.packageService.addInvalid(entity, { field: info.field, result: validationResult });
		}

		// remove configurationFK error
		this.packageService.removeInvalid(entity, { field: 'ConfigurationFk', result: { valid: true, apply: true } });

		return Promise.resolve(validationResult);
	}

	protected async validateStructureFk(info: ValidationInfo<IPrcPackageEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : undefined;

		// const OriginalPrcStructureId = entity.StructureFk;
		const structure = value ? await lastValueFrom(this.structureLookupService.getItemByKey({ id: value })) : null;
		if (entity.StructureFk !== value && value) {
			// if clear strcutre, the configuration should keep and no need change to default value. by lcn #130249
			entity.IsChangedStructure = true;
			// change default configration
			let keepChange = true;
			const strValue = value === -1 ? null : value;
			if (structure && !structure.PrcConfigHeaderFk) {
				keepChange = false;
				entity.IsChangedStructure = false;
			}

			if (keepChange) {
				const urlStr = 'basics/procurementconfiguration/configuration/getByStructure?' + (strValue === null ? 'rubricId=' + Rubric.Package : 'structureId=' + strValue + '&rubricId=' + Rubric.Package);
				const result = await this.httpService.get<number>(urlStr);
				const oldConfigHeader = entity.ConfigurationFk ? await lastValueFrom(this.configurationLookupService.getItemByKey({ id: entity.ConfigurationFk })) : null;
				const newConfigHeader = await lastValueFrom(this.configurationLookupService.getItemByKey({ id: result }));

				const oldConfigHeaderId = oldConfigHeader ? oldConfigHeader.PrcConfigHeaderFk : -1;
				if (newConfigHeader && oldConfigHeaderId !== newConfigHeader.PrcConfigHeaderFk) {
					entity.ConfigurationFk = result as number;
					await this.validateConfigurationFk({
						entity: entity,
						value: entity.ConfigurationFk,
						field: 'ConfigurationFk',
					});
				}
			}
		}

		// todo chi: common logic to get length of the field
		const descriptionLength = 252; // todo chi: prcCommonDomainMaxlengthHelper.get('Procurement.Package', 'PrcPackageDto', 'Description');

		if (!entity.Description) {
			if (structure && structure.DescriptionInfo && structure.DescriptionInfo.Translated) {
				entity.Description = structure.DescriptionInfo.Translated.substring(0, descriptionLength -1);
			}
		} else {
			if (structure) {
				// const oldStructure = _.find(basicsLookupdataLookupDescriptorService.getData('prcstructure'), {Id: entity.StructureFk});
				// todo chi: the code helper is not ready
				// codeHelperService.getUpdatePackageDescriptionByStructure().then((val) => {
				// 	if (val) {
				// 		if (structure && structure.DescriptionInfo.Translated) {
				// 			entity.Description = structure.DescriptionInfo.Translated.substr(0, descriptionLength);
				// 		}
				// 		dataService.markItemAsModified(entity);
				// 		const _structureData = {
				// 			id: entity.Id,
				// 			value: entity.Description,
				// 			OriginalPrcStructureId: OriginalPrcStructureId
				// 		};
				// 		this.packageService.propertyChanged({ // todo chi: use entityProxy instead
				// 			fieldKind: 'structure',
				// 			isUpdateSubListDescription: true,
				// 			..._structureData
				// 		});
				// 	}
				// });
			}
		}

		// if (entity.Version === 0) { // todo chi: move this logic to sub package and event. -> sub package has been done
		this.packageService.entityProxy.apply(entity).StructureFk = value; // todo chi: move from bottom, right?
		// }

		await this.setClerkPrcFkAndClerkReqFk(entity, value, entity.ProjectFk, entity.CompanyFk);

		/** *update textcode when structure change***/
		if (structure) {
			/* const TaxCodeFk = structure.TaxCodeFk;
			if (TaxCodeFk) {
				entity.TaxCodeFk = TaxCodeFk;
				dataService.taxCodeFkChanged.fire();
			}
			to alm: because taxCodeFkChanged watcher depends on VatPercent which is set in validateTaxCodeFk function */
			const taxCodeFk = await this.httpService.get<number | null | undefined>('basics/procurementstructure/taxcode/getTaxCodeByStructure?structureId=' + value);

			if (taxCodeFk) {
				await this.validateTaxCodeFk({ entity: entity, value: taxCodeFk, field: 'TaxCodeFk' }, true);
			}
		}

		return Promise.resolve(this.validationService.createSuccessObject());
	}

	public async validateDialogStructureFk(info: ValidationInfo<IPrcPackageEntity>, noSetConfigurationFk?: boolean): Promise<ValidationResult> {
		const descriptionLength = 252; // todo chi: prcCommonDomainMaxlengthHelper.get('Procurement.Package', 'PrcPackageDto', 'Description');
		const entity = info.entity;
		let value = info.value ? (info.value as number) : null;
		value = value || -1;
		const structure = await lastValueFrom(this.structureLookupService.getItemByKey({ id: value }));
		if (!entity.Description) {
			if (structure && structure.DescriptionInfo.Translated) {
				entity.Description = structure.DescriptionInfo.Translated.substring(0, descriptionLength - 1);
			}
		} else {
			if (structure && entity.StructureFk) {
				const oldStructure = await lastValueFrom(this.structureLookupService.getItemByKey({ id: entity.StructureFk }));
				if (oldStructure && entity.Description === oldStructure.DescriptionInfo.Translated && structure.DescriptionInfo.Translated) {
					entity.Description = structure.DescriptionInfo.Translated.substring(0, descriptionLength - 1);
				}
			}
		}

		// change default configration
		// if clear strcutre, the configuration should keep and no need change to default value. by lcn #130249
		if (!(value === -1 && entity.StructureFk !== -1)) {
			// todo: create new data
			let keepChange = true;
			const strValue = value === -1 ? null : value;
			if (structure && !structure.PrcConfigHeaderFk) {
				keepChange = false;
			}
			if (keepChange) {
				const urlStr = 'basics/procurementconfiguration/configuration/getByStructure?' + (strValue === null ? 'rubricId=31' : 'structureId=' + strValue + '&rubricId=31');
				const result = await this.httpService.get<number>(urlStr);

				if (isNil(noSetConfigurationFk)) {
					const oldConfigHeader = entity.ConfigurationFk ? await lastValueFrom(this.configurationLookupService.getItemByKey({ id: entity.ConfigurationFk })) : null;
					const newConfigHeader = await lastValueFrom(this.configurationLookupService.getItemByKey({ id: result }));

					const oldConfigHeaderId = oldConfigHeader ? oldConfigHeader.PrcConfigHeaderFk : -1;
					if (newConfigHeader && oldConfigHeaderId !== newConfigHeader.PrcConfigHeaderFk) {
						if (entity.ConfigurationFk !== result) {
							entity.ConfigurationFk = result;
							await this.validateDialogConfigurationFk({
								entity: entity,
								value: entity.ConfigurationFk,
								field: 'ConfigurationFk',
							});

							if (isNil(entity.isCreateByPackage)) {
								// the poped up message only in contract module to create package,and it should allow to select option"no show in future"
								await this.messageBoxService.showMsgBox({
									bodyText: this.translationService.instant('procurement.package.createDialog4ConfigurationWarning').text,
									iconClass: 'ico-warning',
								});
							}
						}
					}
				}
			}
		}

		entity.StructureFk = value;
		if (structure) {
			const TaxCodeFk = structure.TaxCodeFk;
			if (TaxCodeFk) {
				entity.TaxCodeFk = TaxCodeFk;
			}
		}

		if (value && value > 0) {
			return this.validationService.createSuccessObject();
		}
		return this.validationService.createErrorObject(this.translationService.instant('cloud.common.required').text);
	}

	protected validatePlannedStart(info: ValidationInfo<IPrcPackageEntity>): ValidationResult {
		const entity = info.entity;
		const value = info.value ? (info.value as Date) : null;
		entity.DateEffective = value || entity.DateEffective;
		return this.validationService.validatePeriod(this.packageService, info, value ? value.toString() : '', entity.PlannedEnd ? entity.PlannedEnd.toString() : '', 'PlannedEnd');
	}

	protected validatePlannedEnd(info: ValidationInfo<IPrcPackageEntity>): ValidationResult {
		const entity = info.entity;
		return this.validationService.validatePeriod(this.packageService, info, entity.PlannedStart ? entity.PlannedStart.toString() : '', info.value ? info.value.toString() : '', 'PlannedStart');
	}

	protected validateActualStart(info: ValidationInfo<IPrcPackageEntity>): ValidationResult {
		const entity = info.entity;
		return this.validationService.validatePeriod(this.packageService, info, info.value ? info.value.toString() : '', entity.ActualEnd ? entity.ActualEnd.toString() : '', 'ActualEnd');
	}

	protected validateActualEnd(info: ValidationInfo<IPrcPackageEntity>): ValidationResult {
		const entity = info.entity;
		return this.validationService.validatePeriod(this.packageService, info, entity.ActualStart ? entity.ActualStart.toString() : '', info.value ? info.value.toString() : '', 'ActualStart');
	}

	protected validateScheduleFk(info: ValidationInfo<IPrcPackageEntity>): ValidationResult {
		// if click clear button ,then should reset Activity to null
		// if selected another Schedule then should be reset Activity to null
		const entity = info.entity;
		const value = info.value ? (info.value as number) : undefined;
		if (!value || entity.ScheduleFk !== value) {
			entity.ActivityFk = undefined;
		}
		entity.ScheduleFk = value;
		this.packageService.readonlyProcessor.process(entity);
		return this.validationService.createSuccessObject();
	}

	public async validateTaxCodeFk(info: ValidationInfo<IPrcPackageEntity>, isInject?: boolean): Promise<ValidationResult> {
		const result = this.validationService.createSuccessObject();
		const entity = info.entity;
		const value = info.value as number;
		if (!entity || !entity.TaxCodeFk || value === -1) {
			return this.validationService.createErrorObject('should not empty');
		}
		if (entity.TaxCodeFk !== value) {
			const data = await lastValueFrom(this.taxCodeLookupService.getItemByKey({ id: value }));

			if (data) {
				if (entity.VatPercent !== data.VatPercent) {
					// todo chi: where to set this value or need?
					// dataService.isTotalDirty = true;
				}
				entity.VatPercent = data.VatPercent;
				if (isInject === undefined) {
					entity.TaxCodeFk = value;
					// todo chi: common logic is not available
					// procurementCommonTaxCodeChangeService.taxCodeChanged(value, moduleName, dataService, entity);
				} else {
					this.packageService.entityProxy.apply(entity).TaxCodeFk = value;
				}
			}
		}
		return result;
	}

	public async validateCurrencyFk(info: ValidationInfo<IPrcPackageEntity>): Promise<ValidationResult> {
		return this.currencyExchangeRate.validateCurrencyFkNCheckBOQ(info, info.entity.ProjectFk);
	}

	protected asyncValidateDateEffective(info: ValidationInfo<IPrcPackageEntity>): Promise<ValidationResult> {
		return Promise.resolve(this.validationService.createSuccessObject());
		// todo chi: common logic is not available
		// let procurementCommonDateEffectiveValidateService = $injector.get('procurementCommonDateEffectiveValidateService');
		// let prcHeaderService = $injector.get('procurementContextService').getMainService();
		// let prcPackageBoqService = $injector.get('prcBoqMainService').getService(prcHeaderService);
		// // let package2HeaderService = $injector.get('procurementPackagePackage2HeaderService');
		// // let boqMainSrvc = prcBoqMainService.getService(package2HeaderService);
		// let selectHeader = prcHeaderService.getSelected();
		// return procurementCommonDateEffectiveValidateService.asyncModifyDateEffectiveAndUpdateBoq(entity, value, model, prcPackageBoqService, dataService, service, {
		// 	ProjectId: entity.ProjectFk,
		// 	Module: 'procurement.package',
		// 	BoqHeaderId: selectHeader ? selectHeader.PrcHeaderFk : -1,
		// 	HeaderId: entity.Id,
		// 	ExchangeRate: entity.ExchangeRate
		// });
	}

	protected async validateExchangeRate(info: ValidationInfo<IPrcPackageEntity>): Promise<ValidationResult> {
		return this.currencyExchangeRate.validateExchangeRateNCheckBOQ(info);
	}

	public async validateProjectFk(info: ValidationInfo<IPrcPackageEntity>, fromNewButton?: boolean): Promise<ValidationResult> {
		const entity = info.entity;
		let value = info.value as number;

		value = value || -1;
		if (entity && entity.ProjectFk !== value) {
			await this.setClerkPrcFkAndClerkReqFk(entity, entity.StructureFk, value, entity.CompanyFk);

			if (!fromNewButton) {
				this.packageService.entityProxy.apply(entity).ProjectFk = value;
			} else {
				entity.ProjectFk = value;
			}
			if (value > 0) {
				// copy certificates from other modules such as project and material.
				const package2headerService = ServiceLocator.injector.get(Package2HeaderDataService);
				const package2headerItem = package2headerService.getSelectedEntity();
				if (package2headerItem) {
					// todo chi: common logic is not available
					// var certificateDataService = $injector.get('procurementCommonCertificateNewDataService').getService(package2headerService);
					// var options = {
					// 	url: 'procurement/common/prccertificate/copycertificatesfromproject',
					// 	dataService: certificateDataService,
					// 	parameter: {PrcHeaderId: package2headerItem.PrcHeaderFk, PrjProjectId: value},
					// 	subModule: package2headerService.getItemName()
					// };
					// certificateDataService.copyCertificatesFromOtherModule(options);
				}

				const telephoneData = await this.httpService.get<IProjectTelephoneNumberResponse>('procurement/package/package/gettelephone?projectFk=' + value);
				entity.TelephoneNumber = telephoneData.TelephoneNumber;
				entity.TelephoneNumberTelefax = telephoneData.TelephoneNumberTelefax;
				entity.TelephoneMobil = telephoneData.TelephoneMobil;
				entity.TelephoneNumberFk = telephoneData.TelephoneNumberFk;
				entity.TelephoneTelefaxFk = telephoneData.TelephoneTelefaxFk;
				entity.TelephoneMobileFk = telephoneData.TelephoneMobileFk;
				entity.CountryFk = telephoneData.CountryFk;
				entity.RegionFk = telephoneData.RegionFk;
				entity.Email = telephoneData.Email;
				entity.AddressEntity = telephoneData.AddressEntity;
				entity.AddressFk = telephoneData.AddressFk;
				// todo chi: common logic is not available
				// const oldFk = entity.MdcControllingUnitFk;
				// $q.all([$injector.get('procurementCommonControllingUnitFactory').getControllingUnit(value, oldFk)]).then(function (res) {
				// 	if (res[0] !== '' && res[0] !== null) {
				// 		entity.MdcControllingUnitFk = res[0];
				// 		dataService.controllingUnitChanged.fire();
				// 		dataService.wantToUpdateCUToItemsAndBoq(entity, true);
				// 	} else {
				// 		service.validateCurrencyFk(entity, entity.CurrencyFk, 'CurrencyFk');
				// 	}
				// });
			}
		}
		if (value > 0) {
			return this.validationService.createSuccessObject();
			// platformDataValidationService.finishValidation(true, entity, entity.ProjectFk, 'ProjectFk', service, dataService);
			// return true;
		}
		// platformDataValidationService.finishValidation(false, entity, entity.ProjectFk, 'ProjectFk', service, dataService);
		return this.validationService.createErrorObject('cloud.common.required');
	}

	public async validateAssetMasterFk(info: ValidationInfo<IPrcPackageEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : null;
		if (value && value > 0) {
			if (entity && entity.AssetMasterFk !== value) {
				entity.AssetMasterFk = value;
				const assetMaster = await this.httpService.get<IBasicsAssetMasterEntity>('basics/assetmaster/get?id=' + value);
				if (assetMaster && assetMaster.AddressFk) {
					await this.packageService.updateAddress(entity, assetMaster.AddressFk);
				}

				// update package code and procurement BoQs reference No.
				if (entity.Code && entity.Version !== 0) {
					entity.Code = await this.httpService.post<string>('procurement/package/package/generatepackagecode', entity);
					const boqRootItem: IBoqItemEntity[] = [];
					const boqList: IPrcBoqExtendedEntity[] = []; // commonBoqService.getList(); // todo chi: common logic is not available

					// todo chi: uncomment it later
					if(isEmpty(boqList)){
						return Promise.resolve(this.validationService.createSuccessObject());
					}
					const prcPackage = await lastValueFrom(this.packageLookupService.getItemByKey({ id: entity.Id }));
					if (prcPackage) {
						prcPackage.Code = entity.Code; // update the prcpackage code
						forEach(boqList, (item) => {
							// update item.BoqRootItem.Reference
							if(item.BoqRootItem) {
								item.BoqRootItem.Reference = this.formatBoqReference(entity.Code ?? '', item.BoqRootItem.Reference ?? '', 42);
							}
							boqRootItem.push(item.BoqRootItem);
						});
						const boqRootItemsUpdated = await this.httpService.post<IBoqItemEntity[]>('procurement/common/boq/updateboqrootitem', boqRootItem);

						forEach(boqList, function (item) {
							const resItem = find(boqRootItemsUpdated, { Id: item.BoqRootItem?.Id });
							if(resItem && item.BoqRootItem) {
							extend(item.BoqRootItem, resItem);
							}
						});
						// update BoQ Structure
						const mainBoqList: IBoqItemEntity[] = []; // boqMainService.getTree(); // todo chi: common logic is not available
						const mainItem = find(boqRootItemsUpdated, { Id: mainBoqList[0].Id });
						if (mainItem) {
							mainBoqList[0].Reference = mainItem.Reference;
							// todo chi: these fields can't be updated.
							// mainBoqList[0].UpdatedAt = mainItem.UpdatedAt;
							// mainBoqList[0].UpdatedBy = mainItem.UpdatedBy;
							// mainBoqList[0].Version = mainItem.Version;
						}
					}
				}
			}
			return Promise.resolve(this.validationService.createSuccessObject());
		}

		// If value is empty we must check from system options(Show Asset Master in Procurement (Yes/No)) then determine whether field is required or not.
		const showAssetMaster = await this.httpService.get('basics/common/systemoption/showassetmasterinprocurement');
		if (showAssetMaster) {
			const result = this.validationService.createErrorObject('required');
			return Promise.resolve(result);
		}
		return Promise.resolve(this.validationService.createSuccessObject());
	}

	public async validatePrcPackageTemplateFk(info: ValidationInfo<IPrcPackageEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : null;
		const result = this.validationService.createSuccessObject();
		if (value === null || value <= 0) {
			result.valid = false;
			result.error = 'required';
		} else {
			let errorMessage = 'procurement.package.cannotgeneratecodefromtemplate';
			const data = await this.httpService.get<ICanGenerateCodeResult>('procurement/package/package/cangeneratecodefromtemplate' + '?templateFk=' + value);

			if (!data.Result) {
				if (data.TemplateItemCount <= 0) {
					errorMessage = 'procurement.package.hasnottemplateitem';
				}
				result.valid = false;
				result.error = errorMessage;
			}
		}

		if (result.valid) {
			this.packageService.removeInvalid(entity, { field: info.field, result: result });
		} else {
			this.packageService.addInvalid(entity, { field: info.field, result: result });
		}

		return Promise.resolve(result);
	}

	public async validateConfigurationFk(info: ValidationInfo<IPrcPackageEntity>, isFromWizard?: boolean): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : undefined;
		if (entity) {
			const newConfig = value ? await lastValueFrom(this.configurationLookupService.getItemByKey({ id: value })) : undefined;

			if (entity.Version === 0 && newConfig) {
				entity.Code = this.packageService.numberGenerator.provideNumberDefaultText(newConfig.RubricCategoryFk);

				if (!entity.Code) {
					const codeTr = this.translationService.instant('cloud.common.entityCode').text;
					const validateResult = this.validationService.createErrorObject({
						key: 'cloud.common.generatenNumberFailed',
						params: { fieldName: codeTr },
					});
					this.packageService.addInvalid(entity, { field: 'Code', result: validateResult });
				} else {
					this.packageService.removeInvalid(entity, {
						field: 'Code',
						result: this.validationService.createSuccessObject(),
					});
				}
			}
			const oldConfigurationFk = entity.ConfigurationFk;
			const oldConfig = oldConfigurationFk ? await lastValueFrom(this.configurationLookupService.getItemByKey({ id: oldConfigurationFk })) : null;

			// todo chi: clerk service is not available
			// procurementPackageClerkService.copyClerksFromConfiguration(oldConfigurationFk);
			if (newConfig) {
				entity.PrcContractTypeFk = newConfig.PrcContractTypeFk;
			}
			if (isFromWizard) {
				entity.ConfigurationFk = value;
				entity.AllConfigurationFk = undefined;
				this.packageService.entityProxy.apply(entity).AllConfigurationFk = value;
			} else {
				this.packageService.entityProxy.apply(entity).ConfigurationFk = value;
			}
			this.packageService.readonlyProcessor.process(entity);
			this.packageService.setModified(entity);
			if (oldConfig && newConfig && oldConfig.Id !== newConfig.Id && !isFromWizard) {
				// todo chi: common logic is not available
				// procurementCommonTotalDataService.copyTotalsFromConfiguration();
			}
		}

		// todo chi: common logic is not available.
		// var defaultListNotModified = null;
		// var sourceSectionId = 32;// 32 is  prcurement Configration
		// var targetSectionId = 18;// 18 is    package.
		// // var rfqMainService = $injector.get('procurementRfqMainService');
		// var charDataService = $injector.get('basicsCharacteristicDataServiceFactory').getService(dataService, targetSectionId);
		// defaultListNotModified = charDataService.getList();
		// var newItem = [];
		// angular.forEach(defaultListNotModified, function (item) {
		// 	newItem.push(item);
		// });
		// if (value) {
		// 	var sourceHeaderId = value;
		// 	var selectedEntity = dataService.getSelected();
		// 	if (selectedEntity !== null) {
		// 		var targetHeaderId = selectedEntity.Id;
		// 		$http.get(globals.webApiBaseUrl + 'basics/characteristic/data/getAndSetList' + '?sourceHeaderId=' + sourceHeaderId + '&targetHeaderId=' + targetHeaderId + '&sourceSectionId=' + sourceSectionId + '&targetSectionId=' + targetSectionId).then(function (response) {
		// 				var configData = response.data;
		// 				// var oldCharData = charDataService.getList();
		// 				// charDataService.clear(oldCharData);
		// 				angular.forEach(configData, function (item) {
		// 					var oldItem = _.find(defaultListNotModified, {CharacteristicFk: item.CharacteristicFk});
		// 					if (!oldItem) {
		// 						newItem.push(item);
		// 					}
		// 				});
		// 				charDataService.setList(newItem);
		// 				angular.forEach(newItem, function (item) {
		// 					charDataService.markItemAsModified(item);
		// 				});
		// 			}
		// 		);
		// 	}
		//
		// }
		// dataService.fireItemModified(entity);
		return Promise.resolve(this.validationService.createSuccessObject());
	}

	public async validateDialogConfigurationFk(info: ValidationInfo<IPrcPackageEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = info.value as number;
		entity.ConfigurationFk = value;
		if (entity) {
			const data = await lastValueFrom(
				this.configurationLookupService.getSearchList({
					searchText: '',
					searchFields: [],
					filterString: 'RubricFk=' + Rubric.Package,
				}),
			);
			const config = data.items.find((e) => e.Id === value); // todo chi: need to check
			if (config) {
				if (value) {
					entity.Code = this.packageService.numberGenerator.provideNumberDefaultText(config.RubricCategoryFk);

					if (!entity.Code) {
						const codeTr = this.translationService.instant('cloud.common.entityCode').text;
						const validateResult = this.validationService.createErrorObject({
							key: 'cloud.common.generatenNumberFailed',
							params: { fieldName: codeTr },
						});
						this.packageService.addInvalid(entity, { field: 'Code', result: validateResult });
					} else {
						this.packageService.removeInvalid(entity, {
							field: 'Code',
							result: this.validationService.createSuccessObject(),
						});
					}
				}
			}
		}

		this.packageService.readonlyProcessor.process(entity);
		this.packageService.setModified(entity);
		return Promise.resolve(this.validationService.createSuccessObject());
	}

	protected async validateActivityFk(info: ValidationInfo<IPrcPackageEntity>): Promise<ValidationResult> {
		if (info.value) {
			await this.packageService.showDateDecisionDialog(info.entity, info.value as number);
		}
		return Promise.resolve(this.validationService.createSuccessObject());
	}

	public async asyncSetPrcConfigFkAndBillingSchemaFkForWizard(entity: IPrcPackageEntity, prcConfigFk: number): Promise<ValidationResult> {
		if (entity.ConfigurationFk !== prcConfigFk) {
			// todo chi: common service is not available
			// await procurementCommonTotalDataService.asyncCopyTotalsFromConfiguration(prcConfigFk);
		}
		return await this.validateConfigurationFk({ entity: entity, value: prcConfigFk, field: 'ConfigurationFk' }, true);
	}

	protected validateBpdVatGroupFk(info: ValidationInfo<IPrcPackageEntity>): ValidationResult {
		info.entity.originVatGroupFk = info.entity.BpdVatGroupFk;
		return this.validationService.createSuccessObject();
	}

	protected validateMdcControllingUnitFk(info: ValidationInfo<IPrcPackageEntity>): ValidationResult {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : null;
		if (value && entity.MdcControllingUnitFk !== value) {
			this.packageService.entityProxy.apply(entity).MdcControllingUnitFk = value;
			this.packageService.wantToUpdateCUToItemsAndBoq(entity);
		}

		return this.validationService.createSuccessObject();
	}

	protected validateOverallDiscount(info: ValidationInfo<IPrcPackageEntity>) {
		return this.overallDiscountService.validateOverallDiscountFields(info);
	}

	protected validateOverallDiscountOc(info: ValidationInfo<IPrcPackageEntity>) {
		return this.overallDiscountService.validateOverallDiscountFields(info);
	}

	protected validateOverallDiscountPercent(info: ValidationInfo<IPrcPackageEntity>) {
		return this.overallDiscountService.validateOverallDiscountPercent(info);
	}

	public validateAddressEntity(info: ValidationInfo<IPrcPackageEntity>): ValidationResult {
		const entity = info.entity;
		const value = info.value ? (info.value as unknown as AddressEntity) : null; // todo chi: right?
		if (value && value.CountryFk && entity.CountryFk !== value.CountryFk) {
			entity.CountryFk = value.CountryFk;
		}
		return this.validationService.createSuccessObject();
	}

	private async setClerkPrcFkAndClerkReqFk(entity: IPrcPackageEntity, prcStructureFk: number | null | undefined, projectFk: number, companyFk: number) {
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

	private async getCurrentRate(entity: IPrcPackageEntity, value: number) {
		return await this.httpService.get<number>('procurement/common/exchangerate/rate', {
			params: {
				CompanyFk: this.companyContext.loginCompanyEntity.Id,
				CurrencyForeignFk: value,
				ProjectFk: entity.ProjectFk,
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
		return this.http.get(this.configService.webApiBaseUrl + 'procurement/common/boq/checkforversionboqs' + '?packageFk=' + packageFk);
	}

	private checkBoqWhenModifyRateMsgBox() {
		return this.messageBoxService.showMsgBox({
			headerText: 'procurement.common.changeCurrencyVersionBoqHeader',
			bodyText: 'procurement.common.changeCurrencyVersionBoqText',
			iconClass: 'ico-info',
		});
	}

	private formatBoqReference(packageCode: string, boqRef: string, num: number) {
		const pos = boqRef.indexOf('(');
		if (pos === -1) {
			boqRef = packageCode;
		} else {
			boqRef = packageCode + boqRef.substring(pos);
		}
		return boqRef.substring(0, num);
	}

	// todo chi: for complex type fields: validateMainEventDto$EndRelevant, validateMainEventDto$StartRelevant
}