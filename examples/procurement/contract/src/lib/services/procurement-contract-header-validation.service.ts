/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import {
	BaseValidationService,
	IValidationFunctions,
	ValidationResult,
	ValidationInfo, IEntityRuntimeDataRegistry
} from '@libs/platform/data-access';

import { inject, Injectable } from '@angular/core';
import { IConHeaderEntity, IConItemEntity } from '../model/entities';
import { ProcurementContractHeaderDataService } from './procurement-contract-header-data.service';
import { PlatformConfigurationService, PlatformHttpService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import {
	BasicsShareControllingUnitLookupService,
	BasicsSharedDataValidationService, BasicsSharedMaterialCatalogLookupService,
	BasicsSharedNumberGenerationService,
	BasicsSharedProcurementConfigurationLookupService, BasicsSharedTaxCodeLookupService, BasicsSharedConStatusLookupService,
	AddressEntity,
} from '@libs/basics/shared';
import { ProcurementContractGeneralsDataService } from './procurement-contract-generals-data.service';
import { IBasisContractChangeEvent, IPrcGeneralsReloadData, ProcurementCopyMode, ProcurementPurchaseOrderType } from '@libs/procurement/common';
import { BusinessPartnerLogicalValidatorFactoryService, BusinessPartnerLookupService } from '@libs/businesspartner/shared';
import { IBusinessPartner2ValidatorOptions } from '@libs/businesspartner/interfaces';
import { ProcurementContractItemDataService } from './procurement-contract-item-data.service';
import { map, orderBy, uniq } from 'lodash';
import { IYesNoDialogOptions, StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { ProcurementContractCertificateDataService } from './procurement-contract-certificate-data.service';
import { ProcurementContractBillingSchemaDataService } from './procurement-contract-billing-schema-data.service';
import { ProcurementConHeader2BoqWicCatBoqLookupService } from '../lookups/con-header-to-boq-wic-cat-boq-lookup.service';
import { BasicsCurrencyRateType, IMaterialCatalogLookupEntity } from '@libs/basics/interfaces';
import { ProcurementContractCurrencyExchangeRateService } from './procurement-contract-currency-exchange-rate.service';
import { ProcurementContractOverallDiscountService } from './procurement-contract-overall-discount.service';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { firstValueFrom } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ProcurementContractHeaderValidationService extends BaseValidationService<IConHeaderEntity> {

	private readonly dataService: ProcurementContractHeaderDataService = inject(ProcurementContractHeaderDataService);
	private readonly http = inject(PlatformHttpService);
	private readonly configurationService = inject(PlatformConfigurationService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);

	private readonly generalsDataService = inject(ProcurementContractGeneralsDataService);
	private readonly prcItemDataService = inject(ProcurementContractItemDataService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly billingSchemaService = inject(ProcurementContractBillingSchemaDataService);
	private readonly conItemService = inject(ProcurementContractItemDataService);
	private readonly genNumberSvc = inject(BasicsSharedNumberGenerationService);
	private readonly certificateDataService = inject(ProcurementContractCertificateDataService);

	private readonly taxCodeLookupService = inject(BasicsSharedTaxCodeLookupService);
	private readonly conStatusLookupService = inject(BasicsSharedConStatusLookupService);
	private readonly con2BoqWicCatLookupService = inject(ProcurementConHeader2BoqWicCatBoqLookupService);
	private readonly materialCatalogLookupService = inject(BasicsSharedMaterialCatalogLookupService);
	private readonly projectLookupService = inject(ProjectSharedLookupService);
	private readonly prcConfigurationLookupService = inject(BasicsSharedProcurementConfigurationLookupService);
	private readonly controllingUnitLookupService = inject(BasicsShareControllingUnitLookupService);
	private readonly businessPartnerValidatorService = inject(BusinessPartnerLogicalValidatorFactoryService).create({
		dataService: this.dataService,
		vatGroupField: 'BpdVatGroupFk',
		paymentTermFiField: 'PaymentTermFiFk',
		paymentTermPaField: 'PaymentTermPaFk',
		supplierField: 'SupplierFk',
		subsidiaryField: 'SubsidiaryFk',
		contactField: 'ContactFk',
		bankField: 'BankFk',
		subsidiaryFromBpDialog: true,
		needLoadDefaultSupplier: true
	});
	private readonly currencyExchangeRateService =  inject(ProcurementContractCurrencyExchangeRateService);
	private readonly overallDiscountService = inject(ProcurementContractOverallDiscountService);

	private argumentsToValidate: IBusinessPartner2ValidatorOptions<IConHeaderEntity> = {
		businessPartnerField: 'BusinessPartner2Fk' ,
		subsidiaryField: 'Subsidiary2Fk',
		supplierField: 'Supplier2Fk',
		contactField: 'Contact2Fk'
	};

	protected generateValidationFunctions(): IValidationFunctions<IConHeaderEntity> {
		return {
			BusinessPartnerFk: this.validateBusinessPartnerFk,
			BusinessPartner2Fk: this.validateBusinessPartner2Fk,
			SupplierFk: this.validateSupplierFk,
			Supplier2Fk: this.validateSupplier2Fk,
			SubsidiaryFk: this.validateSubsidiaryFk,
			Subsidiary2Fk: this.validateSubsidiary2Fk,
			ProjectFk: this.validateProjectFk,
			IncotermFk: this.validateIncotermFk,
			Code: this.validateCode,
			DateDelivery: this.validateDateDelivery,
			PackageFk: this.validatePackageFk,
			TaxCodeFk: this.validateTaxCodeFk,
			ConStatusFk: this.validateConStatusFk,
			PaymentTermPaFk: this.validatePaymentTermPaFk,
			BasAccassignConTypeFk: this.validateBasAccassignConTypeFk,
			BasCurrencyFk: this.validateBasCurrencyFk,
			MaterialCatalogFk: this.validateMaterialCatalogFk,
			ControllingUnitFk: this.validateControllingUnitFk,
			DateCallofffrom: this.validateDateCallofffrom,
			DateCalloffto: this.validateDateCalloffto,
			DateOrdered: this.validateDateOrdered,
			ContractHeaderFk: this.validateContractHeaderFk,
			ProjectChangeFk: this.validateProjectChangeFk,
			BillingSchemaFk: this.validateBillingSchemaFk,
			BpdVatGroupFk: this.validateBpdVatGroupFk,
			ExecutionStart: this.validateExecutionStart,
			ExecutionEnd: this.validateExecutionEnd,
			ValidFrom: this.validateValidFrom,
			ValidTo: this.validateValidTo,
			ContracttypeFk: this.validateContracttypeFk,
			AwardmethodFk: this.validateAwardmethodFk,
			PrcCopyModeFk: this.validatePrcCopyModeFk,
			BoqWicCatFk: this.validateBoqWicCatFk,
			ExchangeRate: this.validateExchangeRate,
			OverallDiscount: this.validateOverallDiscount,
			OverallDiscountOc: this.validateOverallDiscountOc,
			OverallDiscountPercent: this.validateOverallDiscountPercent
		};
	}

	protected get entityProxy() {
		return this.dataService.entityProxy;
	}

	protected validateProjectFk(info: ValidationInfo<IConHeaderEntity>): Promise<ValidationResult> | ValidationResult {
		const entity = info.entity;
		const newValue = info.value as number;

		if (!entity || entity.ProjectFk === newValue) {
			return this.validationUtils.createSuccessObject();
		}
		entity.ProjectFk = newValue;

		this.updateClerkByProject(entity, newValue);
		this.dataService.projectFkChanged$.next(newValue);
		this.dataService.readonlyProcessor.process(entity);
		this.updateProjectStatus(entity, newValue);

		if (!info.value) {
			entity.ControllingUnitFk = undefined;
			entity.ProjectFk = newValue;
			this.dataService.projectFkChanged$.next(newValue);
			return this.validationUtils.createSuccessObject();
		}

		if (entity.PrcHeaderFk !== 0) {
			//todo: pel, should reload the header text after the header text container ready
			// dataService.reloadHeaderText(entity, {
			// 	isOverride: true
			// });
		}

		this.updateAddressByProject(entity, newValue);

		//todo: pel, should update controlling unit after procurementCommonControllingUnitFactory service ready
		// const oldControllingUnitFk = entity.ControllingUnitFk;
		// $q.all([$injector.get('procurementCommonControllingUnitFactory').getControllingUnit(value, oldControllingUnitFk), getAddressByProject(value, entity)]).then(function (res) {
		// 	if (res[0] !== '' && res[0] !== null) {
		// 		entity.ControllingUnitFk = res[0];
		// 		dataService.controllingUnitChanged.fire();
		// 		dataService.wantToUpdateCUToItemsAndBoq(entity.ControllingUnitFk);
		// 	}
		// 	// entity.AddressFk = res[1].AddressFk;
		// 	// entity.AddressEntity = res[1].AddressEntity;
		//
		// 	validateBasCurrencyFk(entity, entity.BasCurrencyFk);
		// 	dataService.gridRefresh();
		// });

		this.copyCertificatesFromProject(entity, newValue);

		return this.validationUtils.createSuccessObject();
	}

	protected async validateBusinessPartnerFk(info: ValidationInfo<IConHeaderEntity>, isFromBasic?: boolean, pointedSupplierFk?: number, pointedSubsidiaryFk?: number) {
		const entity = info.entity;
		const validateRes = this.validateIsMandatory(info);
		if (!validateRes.valid) {
			return validateRes;
		}
		const value = info.value as number;

		this.businessPartnerValidatorService.resetArgumentsToValidate();
        await this.businessPartnerValidatorService.businessPartnerValidator({entity, value, needAttach: true, notNeedLoadDefaultSubsidiary: false, pointedSupplierFk, pointedSubsidiaryFk});
		if (value !== entity.BusinessPartnerFk) {
			if (entity.PrcHeaderFk > 0) {
				const params: IPrcGeneralsReloadData = {
					MainItemId: entity.PrcHeaderFk,
					BusinessPartnerFk: value,
					OriginalBusinessPartnerFk: entity.BusinessPartnerFk
				};
				await this.generalsDataService.reloadGeneralsByBusinessPartnerFk(params);
			}
			const businessPartner = await firstValueFrom(ServiceLocator.injector.get(BusinessPartnerLookupService).getItemByKey({id: value}));
			if (businessPartner && businessPartner.PrcIncotermFk) {
				await this.validateIncotermFk(new ValidationInfo(entity, businessPartner.PrcIncotermFk, 'PrcIncotermFk'));
				//set the PrcIncotermFk to contract which from bp
				entity.IncotermFk = businessPartner.PrcIncotermFk;
			} else {
				info.entity.SubsidiaryFk = undefined;
			}
			this.reloadActualCertificate(info.entity);
		}
		return this.validationUtils.createSuccessObject();
	}

	protected async validateBusinessPartner2Fk(info: ValidationInfo<IConHeaderEntity>) {

		await this.businessPartnerValidatorService.setDefaultContact(info.entity, info.value as number, 'Contact2Fk');
		await this.reloadActualCertificate(info.entity);
		return this.validationUtils.createSuccessObject();
	}

	protected async validateSupplierFk(info: ValidationInfo<IConHeaderEntity>, dontSetPaymentTerm?: boolean) {

		this.businessPartnerValidatorService.resetArgumentsToValidate();
		await this.businessPartnerValidatorService.supplierValidator(info.entity, info.value as number, dontSetPaymentTerm);
		await this.getBankFkBySupplierFk(info.entity, info.value as number);
		return this.validationUtils.createSuccessObject();
	}

	protected async validateSupplier2Fk(info: ValidationInfo<IConHeaderEntity>) {

		this.businessPartnerValidatorService.resetArgumentsToValidate(this.argumentsToValidate);
		await this.businessPartnerValidatorService.supplierValidator(info.entity, info.value as number);
		return this.validationUtils.createSuccessObject();
	}

	protected async validateSubsidiaryFk(info: ValidationInfo<IConHeaderEntity>) {

		this.businessPartnerValidatorService.resetArgumentsToValidate();
		await this.businessPartnerValidatorService.subsidiaryValidator(info.entity, info.value as number);
		return this.validationUtils.createSuccessObject();
	}

	protected async validateSubsidiary2Fk(info: ValidationInfo<IConHeaderEntity>) {

		this.businessPartnerValidatorService.resetArgumentsToValidate(this.argumentsToValidate);
		await this.businessPartnerValidatorService.subsidiaryValidator(info.entity, info.value as number);
		return this.validationUtils.createSuccessObject();
	}

	private async getBankFkBySupplierFk(entity: IConHeaderEntity, supplierId: number) {
		return this.http.get('businesspartner/main/supplier/getbankfkbysupplier', {params: {id: supplierId}}).then(res => {
			if (res) {
				const bankfk = res as number;
				if (entity.BankFk !== bankfk) {
					entity.BankFk = bankfk;
				}
			}
		});
	}

	private reloadGeneralsAndCertificates(entity: IConHeaderEntity, oldConfigurationFk?: number, oldStructureFk?: number) {
		//todo: lincoin, need to provide reloadData method in GeneralsDataService and CertificateDataService
		if (oldConfigurationFk && oldStructureFk) {
			// procurementCommonGeneralsDataService.reloadData(originalEntity);
			// procurementCommonCertificateDataService.reloadData(originalEntity);

		} else if (entity && entity.PrcHeaderEntity && entity.PrcHeaderEntity.ConfigurationFk && entity.PrcHeaderEntity.StructureFk) {
			// procurementCommonGeneralsDataService.reloadData();
			// procurementCommonCertificateDataService.reloadData();
		}
	}

	private overWriteGeneralsAndCertificates(entity: IConHeaderEntity, originalEntity: IConHeaderEntity) {
		//todo: lincoin, need to provide overWriteData method in GeneralsDataService and CertificateDataService
		// procurementCommonGeneralsDataService.overWriteData(entity, originalEntity);
		// procurementCommonCertificateDataService.overWriteData(entity, originalEntity);
	}

	private async reloadActualCertificate(entity: IConHeaderEntity) {
		//this.certificateDataService.loadSubEntities();
		this.certificateDataService.load({id: entity.Id});
	}

	protected async validateIncotermFk(info: ValidationInfo<IConHeaderEntity>) {
		const entity = info.entity;
		const value = info.value as number;
		if (!entity) {
			return this.validationUtils.createSuccessObject();
		}
		if (entity.IncotermFk !== value) {
			const prcItems = this.prcItemDataService.getList();
			if (prcItems.length > 0) {
				const itemIncoterms = uniq(map(prcItems, 'PrcIncotermFk'));
				if (itemIncoterms.length !== 1 || !itemIncoterms.includes(value)) {
					const dialogResult = await this.showUpdateIncotermDialog();
					if (dialogResult) {
						this.updatePrcIncotermFk(prcItems, value);
					}
				}
			}
		}
		entity.IncotermFk = value;
		this.dataService.setModified(entity);
		return this.validationUtils.createSuccessObject();
	}

	private async showUpdateIncotermDialog(): Promise<boolean> {
		const options: IYesNoDialogOptions = {
			headerText: '',
			bodyText: this.translateService.instant('procurement.common.updateIncotermToItem').text,
			defaultButtonId: 'yes',
			showCancelButton: false,
			id: 'updateIncotermDialog',
			dontShowAgain: true
		};
		const result = await this.messageBoxService.showYesNoDialog(options);
		return result?.closingButtonId === StandardDialogButtonId.Yes;
	}

	private updatePrcIncotermFk(prcItems: IConItemEntity[], value: number) {
		prcItems.forEach(item => {
			item.PrcIncotermFk = value;
		});
		this.prcItemDataService.setModified(prcItems);
	}

	private async reloadBillingSchema(entity: IConHeaderEntity, prcConfigFk: number) {
		if (!entity || !(entity.PrcHeaderEntity!.ConfigurationFk || prcConfigFk)) {
			return;
		}
		const configurationFk = prcConfigFk || entity.PrcHeaderEntity!.ConfigurationFk;
		const billingSchemas = await this.billingSchemaService.getBillingSchemas(configurationFk);
		const targetSchema = billingSchemas.find(e => e.Id === entity.BillingSchemaFk);
		// if current billing schema is not exist in current procurement configuration context then get the default schema
		if (!targetSchema) {
			const defaultSchema = await this.billingSchemaService.getDefaultBillingSchema(configurationFk);
			if (defaultSchema) {
				entity.BillingSchemaFk = defaultSchema.Id;
			} else {
				//not sure why the BillingSchemaFk can be 0
				entity.BillingSchemaFk = 0;
				this.dataService.setModified(entity);
			}

			this.billingSchemaService.onBillingSchemaChanged(entity);
		}
	}

	//to-do: need framework to support the reference object's attribute validation
	protected validatePrcHeaderEntity$StructureFk() {

	}

	protected async validateCode(info: ValidationInfo<IConHeaderEntity>) {
		const entity = info.entity;
		const rubricIndex = this.dataService.getRubricIndex(entity);
		let rubricCategoryFk = entity.RubricCategoryFk;
		let configurateFk = entity.ConfigurationFk || 0;

		if (configurateFk === 0 && entity.PrcHeaderEntity) {
			configurateFk = entity.PrcHeaderEntity.ConfigurationFk;
		}
		const config = await firstValueFrom(this.prcConfigurationLookupService.getItemByKey({id: configurateFk}));
		if (config) {
			rubricCategoryFk = config.RubricCategoryFk;
		}
		const hasToGenerateCode = entity.Version === 0 && this.genNumberSvc.hasNumberGenerateConfig(rubricCategoryFk, rubricIndex);
		if (hasToGenerateCode) {
			entity.Code = this.genNumberSvc.provideNumberDefaultText(rubricCategoryFk, rubricIndex);
			return this.validationUtils.createSuccessObject();
		}
		const isUniqueSync = this.validationUtils.isUnique(this.dataService, info, this.dataService.getList());
		if (!isUniqueSync.valid) {
			return isUniqueSync;
		}
		return this.validationUtils.isAsyncUnique(info, 'procurement/contract/header/isunique');
	}

	protected async validateDateDelivery(info: ValidationInfo<IConHeaderEntity>) {
		const entity = info.entity;
		const newValue = info.value as string;
		if (entity.DateDelivery !== newValue) {
			entity.DateDelivery = newValue;
			this.dataService.setModified(entity);
			const options: IYesNoDialogOptions = {
				headerText: '',
				bodyText: this.translateService.instant('procurement.common.deliverDateUpdateToItemInfo').text,
				defaultButtonId: 'yes',
				showCancelButton: false,
				id: 'deliverDateUpdateToItemInfoDialog',
				dontShowAgain: true
			};
			const result = await this.messageBoxService.showYesNoDialog(options);
			if (result?.closingButtonId === StandardDialogButtonId.Yes) {
				this.entityProxy.apply(info.entity);
			}
		}
		return this.validationUtils.createSuccessObject();
	}

	protected async validatePackageFk(info: ValidationInfo<IConHeaderEntity>) {
		//todo: pel, this validation depend on package module, wait the package module ready
		return this.validationUtils.createSuccessObject();
	}

	protected async validateTaxCodeFk(info: ValidationInfo<IConHeaderEntity>, isInject?: boolean) {
		const entity = this.entityProxy.apply(info.entity);
		const newValue = info.value as number;
		if (newValue === 0 || newValue === null) {
			return this.validationUtils.isMandatory(info);
		}
		if (entity.TaxCodeFk !== newValue) {
			const taxCodeEntity = await firstValueFrom(this.taxCodeLookupService.getItemByKey({id: newValue}));
			if (taxCodeEntity) {
				entity.TaxCodeFk = newValue;
				entity.VatPercent = taxCodeEntity.VatPercent;
				if (isInject === undefined) {
					//todo: lvy, this function depend on boq service, need wait the boq service ready.
					// ProcurementCommonTaxCodeChangeService.taxCodeChanged();
				} else {
					this.dataService.updateTaxCodeToItemsAndBoq();
				}
			}
		}
		return this.validationUtils.createSuccessObject();
	}

	protected async validateConStatusFk(info: ValidationInfo<IConHeaderEntity>) {
		const entity = info.entity;
		const newValue = info.value as number;

		if (!entity || !entity.ConStatusFk) {
			return this.validationUtils.createSuccessObject();
		}

		if (entity.ConStatusFk === newValue) {
			return this.validationUtils.createSuccessObject();
		}

		const conStatusEntity = await firstValueFrom(this.conStatusLookupService.getItemByKey({id: newValue}));
		if (!conStatusEntity) {
			return this.validationUtils.createSuccessObject();
		}

		let cancelDate: string = '';
		if (conStatusEntity.Iscanceled) {
			cancelDate = new Date().toDateString();
		}
		entity.DateCanceled = cancelDate;

		if (conStatusEntity.IsReadOnly) {
			entity.IsStatusReadonly = true;
		}

		this.dataService.setModified(entity);

		return this.validationUtils.createSuccessObject();
	}

	protected validatePaymentTermPaFk(info: ValidationInfo<IConHeaderEntity>) {
		const entity = info.entity;
		const newValue = info.value as number;
		if (!entity || entity.PaymentTermPaFk === newValue) {
			return this.validationUtils.createSuccessObject();
		}
		entity.PaymentTermPaFk = newValue;
		this.dataService.setModified(entity);
		this.dataService.paymentTermChanged$.next({paymentTermPaFk: entity.PaymentTermPaFk, paymentTermFiFk: entity.PaymentTermFiFk});
		return this.validationUtils.createSuccessObject();
	}

	//the old name: validatePaymentTermPaFkandPaymentTermFiFk
	protected validateBothPaymentTerms(entity: IConHeaderEntity, paymentTermPaFk: number, paymentTermFiFk: number, isFromSupplierFk: boolean) {
		if (!entity || (entity.SupplierFk && !isFromSupplierFk)) {
			return true;
		}
		entity.PaymentTermPaFk = paymentTermPaFk;
		entity.PaymentTermFiFk = paymentTermFiFk;
		this.dataService.setModified(entity);
		this.dataService.paymentTermChanged$.next({paymentTermPaFk: paymentTermPaFk, paymentTermFiFk: paymentTermFiFk});
		return true;
	}

	protected validateBasAccassignConTypeFk(info: ValidationInfo<IConHeaderEntity>) {
		//todo: pel, wait the invoice module ready, should fire a message to invoice to update the invoice header
		// var invHeaderService = $injector.get('procurementInvoiceHeaderDataService');
		// if (invHeaderService) {
		// 	var accassignConTypeEntity = _.find(basicsLookupdataLookupDescriptorService.getData('BasAccassignConType'), {Id: value});
		// 	entity.IsInvAccountChangeable = accassignConTypeEntity && accassignConTypeEntity.IsCreateInvAccount;
		// 	var invHeaderEntity = invHeaderService.getSelected();
		// 	if (invHeaderEntity && invHeaderEntity.ConHeaderFk === entity.Id) {
		// 		invHeaderEntity.BasAccassignConTypeFk = value;
		// 		invHeaderEntity.IsInvAccountChangeable = entity.IsInvAccountChangeable;
		// 		invHeaderService.SetAccountAssignReadOnlyByIsInvAccountChangeable(invHeaderEntity);
		// 	}
		// }
		// return true;
		return this.validationUtils.createSuccessObject();
	}

	protected validateBasCurrencyFk(info: ValidationInfo<IConHeaderEntity>) {
		return this.currencyExchangeRateService.validateCurrencyFk(info, info.entity.ProjectFk);
	}

	protected async validateExchangeRate(info: ValidationInfo<IConHeaderEntity>) {
		return this.currencyExchangeRateService.validateExchangeRate(info);
	}

	protected async validateMaterialCatalogFk(info: ValidationInfo<IConHeaderEntity>) {
		const entity = this.entityProxy.apply(info.entity);
		const newValue = info.value as number;

		if (!entity || entity.MaterialCatalogFk === newValue) {
			return this.validationUtils.createSuccessObject();
		}

		if (!newValue) {
			//todo: lvy, need to subscribe this change after the restriction container ready, in serivce: prc-contract-master-restriction-data-service
			this.dataService.frameworkMdcCatalogChanged$.next({headerId: entity.Id, newValue: undefined, oldValue: entity.MaterialCatalogFk});
			entity.MaterialCatalogFk = newValue;
			this.updatePurchaseOrders(entity);
			entity.FrameworkConHeaderFk = undefined;

			if (entity.BoqWicCatBoqFk) {
				const con2BoqWicCatBoq = await this.getConHeader2BoqWicCatBoq(entity.BoqWicCatBoqFk);
				if (con2BoqWicCatBoq && con2BoqWicCatBoq.ConHeaderFk) {
					entity.FrameworkConHeaderFk = con2BoqWicCatBoq.ConHeaderFk;
					//get framework contract
					const fwContract = await firstValueFrom(this.dataService.getContractById(con2BoqWicCatBoq.ConHeaderFk)) as IConHeaderEntity;
					if (fwContract && entity.PrcHeaderEntity && fwContract.PrcHeaderEntity!.StructureFk) {
						entity.PrcHeaderEntity.StructureFk = fwContract.PrcHeaderEntity!.StructureFk;
					}
				}
				return this.validationUtils.createSuccessObject();
			}
		}
		if (entity.MaterialCatalogFk !== newValue) {
			const prcItems = this.prcItemDataService.getList();
			if (prcItems && prcItems.length) {
				const options: IYesNoDialogOptions = {
					headerText: this.translateService.instant('procurement.contract.conFrameworkMaterialCatalog').text,
					bodyText: this.translateService.instant('procurement.contract.willClearAllItems').text,
					defaultButtonId: 'yes',
					showCancelButton: false,
					id: 'f5a93caba5004ac8b4142124daefeb5a',
					dontShowAgain: true
				};
				const result = await this.messageBoxService.showYesNoDialog(options);
				if (result?.closingButtonId === StandardDialogButtonId.Yes) {
					await this.changeMaterialCatalogFk(entity, newValue);
					this.prcItemDataService.select(prcItems);
					this.prcItemDataService.delete(prcItems);
				}
			} else {
				this.changeMaterialCatalogFk(entity, newValue);
			}
		}

		return this.validationUtils.createSuccessObject();
	}

	protected async validateControllingUnitFk(info: ValidationInfo<IConHeaderEntity>) {
		const entity = info.entity;
		const newValue = info.value as number;
		if (!entity.ProjectFk) {
			const ctrUnit = await firstValueFrom(this.controllingUnitLookupService.getItemByKey({id: newValue}));
			if (ctrUnit && ctrUnit.PrjProjectFk) {
				const projectFk = ctrUnit.PrjProjectFk;
				if (entity.ProjectFk !== projectFk) {
					this.updateProjectStatus(entity, projectFk);
				}
				entity.ProjectFk = projectFk;

				this.dataService.readonlyProcessor.process(entity);
				this.dataService.projectFkChanged$.next(projectFk);

				await this.updateClerkByProject(entity, projectFk);
				await this.updateAddressByProject(entity, projectFk);
				await this.copyCertificatesFromProject(entity, projectFk);

				this.dataService.setModified(entity);

				entity.ControllingUnitFk = newValue;
				this.dataService.controllingUnitChanged$.next(newValue);
				this.dataService.updateControllingUnitToItemsAndBoq(newValue);
			}
		}
		return this.validationUtils.createSuccessObject();
	}

	protected validateDateCallofffrom(info: ValidationInfo<IConHeaderEntity>) {
		if(info.entity.DateCallofffrom){
			return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, <string>info.value, info.entity.DateCallofffrom, 'DateCalloffto');
		}
		return this.validationUtils.createSuccessObject();
	}

	protected validateDateCalloffto(info: ValidationInfo<IConHeaderEntity>) {
		if(info.entity.DateCalloffto){
			return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, <string>info.value, info.entity.DateCalloffto, 'DateCallofffrom');
		}
		return this.validationUtils.createSuccessObject();
	}

	//todo: need framework to support this case
	protected validatePrcHeaderEntity$ConfigurationFk() {

	}

	protected validateDateOrdered(info: ValidationInfo<IConHeaderEntity>) {
		const entity = info.entity;
		if (info.value) {
			entity.DateEffective = info.value as string || entity.DateEffective;
		}
		return this.validationUtils.isMandatory(info);
	}

	protected async validateContractHeaderFk(info: ValidationInfo<IConHeaderEntity>) {
		const entity = info.entity;
		if (info.value) {
			const newValue = info.value as number;
			entity.ConHeaderFk = newValue;
			entity.ContractHeaderFk = newValue;
			const baseContractEntity = await firstValueFrom(this.dataService.getContractById(newValue)) as IConHeaderEntity;
			if (entity.ProjectFk !== baseContractEntity.ProjectFk && baseContractEntity.ProjectFk) {
				this.updateProjectStatus(entity, baseContractEntity.ProjectFk);
			}
			entity.ProjectFk = baseContractEntity.ProjectFk;
			entity.PackageFk = baseContractEntity.PackageFk;

			if (baseContractEntity.packagePlannedStart) {
				entity.ExecutionStart = baseContractEntity.packagePlannedStart.toDateString();
			}
			if (baseContractEntity.packagePlannedEnd) {
				entity.ExecutionEnd = baseContractEntity.packagePlannedEnd.toDateString();
			}
			if (baseContractEntity.ValidFrom) {
				entity.ValidFrom = baseContractEntity.ValidFrom;
			}
			if (baseContractEntity.ValidTo) {
				entity.ValidTo = baseContractEntity.ValidTo;
			}
			if (baseContractEntity.Description && !entity.Description) {
				entity.Description = baseContractEntity.Description;
			}
			// begin of defect #102225 - Tax Code Issue in CO & CALL OFF
			const validateResult = await this.validateTaxCodeFk(new ValidationInfo(entity, baseContractEntity.TaxCodeFk, 'TaxCodeFk'));
			if (validateResult.valid) {
				entity.TaxCodeFk = baseContractEntity.TaxCodeFk;
			}

			// end of defect #102225
			entity.ClerkPrcFk = baseContractEntity.ClerkPrcFk;
			//entity.ClerkPrcItem = baseContractEntity.ClerkPrcItem;
			entity.ClerkReqFk = baseContractEntity.ClerkReqFk;
			//entity.ClerkReqItem = baseContractEntity.ClerkReqItem;
			entity.BasCurrencyFk = baseContractEntity.BasCurrencyFk;
			entity.ExchangeRate = baseContractEntity.ExchangeRate;
			entity.MaterialCatalogFk = baseContractEntity.MaterialCatalogFk;
			entity.PaymentTermFiFk = baseContractEntity.PaymentTermFiFk;
			entity.PaymentTermPaFk = baseContractEntity.PaymentTermPaFk;
			entity.PaymentTermAdFk = baseContractEntity.PaymentTermAdFk;
			entity.SalesTaxMethodFk = baseContractEntity.SalesTaxMethodFk;

			if (entity.MaterialCatalogFk) {
				const param: IBasisContractChangeEvent = {
					paymentTermFI: entity.PaymentTermFiFk,
					paymentTermPA: entity.PaymentTermPaFk,
					paymentTermAD: entity.PaymentTermAdFk
				};
				this.dataService.basisChanged$.next(param);
			}

			entity.ConTypeFk = baseContractEntity.ConTypeFk;
			entity.AwardmethodFk = baseContractEntity.AwardmethodFk;
			entity.ContracttypeFk = baseContractEntity.ContracttypeFk;
			entity.ControllingUnitFk = baseContractEntity.ControllingUnitFk;
			entity.BusinessPartnerFk = baseContractEntity.BusinessPartnerFk;

			if (baseContractEntity.BankFk === null) {
				//todo: pel, check why need to set the invoice filter?
				//procurementInvoiceHeaderFilterService.getBusinessPartnerBankFk(entity, entity.BusinessPartnerFk);
			} else {
				entity.BankFk = baseContractEntity.BankFk;
			}

			entity.SubsidiaryFk = baseContractEntity.SubsidiaryFk;
			entity.SupplierFk = baseContractEntity.SupplierFk;
			entity.IncotermFk = baseContractEntity.IncotermFk;
			entity.CompanyInvoiceFk = baseContractEntity.CompanyInvoiceFk;
			entity.BillingSchemaFk = baseContractEntity.BillingSchemaFk;
			entity.BillingSchemaFk = baseContractEntity.BillingSchemaFk;
			entity.PrcCopyModeFk = baseContractEntity.PrcCopyModeFk;

			const oldConfiguration = entity.PrcHeaderEntity!.ConfigurationFk;
			if (oldConfiguration !== baseContractEntity.PrcHeaderEntity!.ConfigurationFk) {
				entity.PrcHeaderEntity!.ConfigurationFk = baseContractEntity.PrcHeaderEntity!.ConfigurationFk;
				//todo: pel, need implement copyTotalsFromConfiguration function in CommonTotalDataService
				// if (!_.isNil(entity.Id)) {
				// 	procurementCommonTotalDataService.copyTotalsFromConfiguration();
				// }
			}
			entity.PrcHeaderEntity!.StructureFk = baseContractEntity.PrcHeaderEntity!.StructureFk;
			//todo: wait validatePrcHeaderEntity$ConfigurationFk function ready
			// if (entity.Version === 0) {
			// 	service.validatePrcHeaderEntity$ConfigurationFk(entity, entity.PrcHeaderEntity.ConfigurationFk, 'ConfigurationFk', false);
			// }
			this.updatePurchaseOrders(entity);
			this.dataService.readonlyProcessor.process(entity);
			this.validateBusinessPartnerFk(new ValidationInfo(entity, baseContractEntity.BusinessPartnerFk, 'BusinessPartnerFk'), true);

			// contact should come from baseContractEntity
			entity.ContactFk = baseContractEntity.ContactFk;
			// general certificate
			if (entity.PrcHeaderEntity!.Id > 0) {
				this.overWriteGeneralsAndCertificates(baseContractEntity, entity);
			}

			const oldAddressEntityId = entity.AddressFk;
			if (baseContractEntity.AddressEntity) {
				if (oldAddressEntityId) {
					entity.AddressEntity!.Id = oldAddressEntityId;
					entity.AddressEntity!.Address = baseContractEntity.AddressEntity!.Address;
					entity.AddressEntity!.AddressLine = baseContractEntity.AddressEntity!.AddressLine;
					entity.AddressEntity!.City = baseContractEntity.AddressEntity!.City;
					entity.AddressEntity!.County = baseContractEntity.AddressEntity!.County;
					entity.AddressEntity!.Street = baseContractEntity.AddressEntity!.Street;
				} else {
					const resAddress = await this.http.get<AddressEntity>('basics/common/address/create');
					if (resAddress) {
						entity.AddressEntity = {
							...resAddress,
							Address: baseContractEntity.AddressEntity?.Address ?? undefined,
							AddressLine: baseContractEntity.AddressEntity?.AddressLine ?? undefined,
							City: baseContractEntity.AddressEntity?.City ?? undefined,
							County: baseContractEntity.AddressEntity?.County ?? undefined,
							Street: baseContractEntity.AddressEntity?.Street ?? undefined
						};
						this.dataService.setModified(entity);
					}
				}
			} else {
				entity.AddressEntity = undefined;
				entity.AddressFk = undefined;
			}
			//todo: wait the CommonCharacteristicDataService ready
			// if (!_.isNil(entity.Id)) {
			// 	// characteristic
			// 	var targetSectionId = 8;// 8 is  Contract.
			// 	var target2SectionId = 46;// 46 is  Contract.
			// 	procurementCommonCharacteristicDataService.takeCharacteristicByBasics(dataService, targetSectionId, baseContractEntity.Characteristic, entity.Id);
			// 	procurementCommonCharacteristicDataService.takeCharacteristicByBasics(dataService, target2SectionId, baseContractEntity.Characteristic2, entity.Id);
			// }

			this.dataService.setModified(entity);
		} else {
			// if has basicContract will set general items as readOnly
			// if remove the basicContract, Should revert readOnly status
			//todo:pel, to check how to handle readonly for this case
			//procurementCommonGeneralsDataService.setGeneralItemsReadOnly(false);
			// revert certificate readOnly status
			//procurementCommonCertificateDataService.setCertificateItemsReadOnly(false);
			this.updatePurchaseOrders(entity);
			//dataService.setEntityReadOnly(entity);
			this.dataService.setModified(entity);
		}
		//todo:pel, to check how to handle readonly for tool bar items?
		//procurementCommonPrcItemDataService.updateCopyMainCallOffItemsTool(entity.ProjectChangeFk !== null || entity.ConHeaderFk === null);

		return this.validationUtils.createSuccessObject();
	}

	protected validateProjectChangeFk(info: ValidationInfo<IConHeaderEntity>) {
		const entity = info.entity;
		const newValue = info.value;

		if (entity.ConHeaderFk !== null) {
			// procurementCommonGeneralsDataService.setGeneralItemsReadOnly(newValue !== null);
			// procurementCommonCertificateDataService.setCertificateItemsReadOnly(newValue !== null);
			this.dataService.readonlyProcessor.process(entity);
			this.dataService.setModified(entity);
		}

		entity.ProjectChangeFk = newValue ? newValue as number : undefined;

		return this.validationUtils.createSuccessObject();
	}

	protected validateBillingSchemaFk(info: ValidationInfo<IConHeaderEntity>) {
		const entity = info.entity;
		if (info.value) {
			const newValue = info.value as number;
			if (entity.BillingSchemaFk !== newValue) {
				entity.BillingSchemaFk = newValue;
				this.dataService.billingSchemaChanged$.next(newValue);
			}
		}
		return this.validationUtils.createSuccessObject();
	}

	protected validateBpdVatGroupFk(info: ValidationInfo<IConHeaderEntity>) {
		//why need this atrribute: originVatGroupFk
		//info.entity.originVatGroupFk = info.entity.BpdVatGroupFk;
		return this.validationUtils.createSuccessObject();
	}

	//todo: pel,validatePrcHeaderEntity$ConfigurationFk, wait framework ready
	// service.asyncSetPrcConfigFkAndBillingSchemaFkForWizard = function (entity, prcConfigFk, billingSchemaFk) {
	// 	var arrPromise = [];
	// 	entity.BillingSchemaFk = billingSchemaFk;
	// 	dataService.markCurrentItemAsModified();
	//
	// 	if (entity && entity.PrcHeaderEntity && entity.PrcHeaderEntity.ConfigurationFk !== prcConfigFk) {
	// 		var promise1 = procurementCommonTotalDataService.asyncCopyTotalsFromConfiguration(prcConfigFk);
	// 		arrPromise.push(promise1);
	// 	}
	// 	if (prcConfigFk && !_.isNil(entity.Id)) {
	// 		var promise2 = reloadBillingSchema(entity, prcConfigFk);
	// 		arrPromise.push(promise2);
	// 	}
	// 	var promise3 = service.validatePrcHeaderEntity$ConfigurationFk(entity, prcConfigFk, 'ConfigurationFk', true);
	// 	arrPromise.push(promise3);
	// 	return $q.all(arrPromise);
	// };

	protected validateExecutionStart(info: ValidationInfo<IConHeaderEntity>) {
		if(info.entity.ExecutionStart){
			return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, <string>info.value, info.entity.ExecutionStart, 'ExecutionEnd');
		}
		return this.validationUtils.createSuccessObject();
	}

	protected validateExecutionEnd(info: ValidationInfo<IConHeaderEntity>) {
		if(info.entity.ExecutionEnd){
			return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, <string>info.value, info.entity.ExecutionEnd, 'ExecutionStart');
		}
		return this.validationUtils.createSuccessObject();
	}

	protected validateValidFrom(info: ValidationInfo<IConHeaderEntity>) {
		if(info.entity.ValidFrom){
			return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, <string>info.value, info.entity.ValidFrom, 'ValidTo');
		}
		return this.validationUtils.createSuccessObject();
	}

	protected validateValidTo(info: ValidationInfo<IConHeaderEntity>) {
		if(info.entity.ValidTo){
			return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, <string>info.value, info.entity.ValidTo, 'ValidFrom');
		}
		return this.validationUtils.createSuccessObject();
	}

	//to-do: need framework to support the reference object's attribute validation
	// service.validatePrcHeaderEntity$StrategyFk = function validateStrategyFk(entity, value, model) {
	// 	var result = {apply: true, valid: true};
	// 	if ((_.isNil(value) || value < 1) &&
	// 		(_.isNil(entity.PrcHeaderEntity.StrategyFk) || entity.PrcHeaderEntity.StrategyFk < 1)
	// 	) {
	// 		result.valid = false;
	// 		result.error$tr$ = 'cloud.common.ValidationRule_ForeignKeyRequired';
	// 		result.error$tr$param$ = {'p_0': $translate.instant('cloud.common.EntityStrategy')};
	// 	}
	// 	platformRuntimeDataService.applyValidationResult(result, entity, model);
	// 	return platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
	// };

	protected validateContracttypeFk(info: ValidationInfo<IConHeaderEntity>) {
		const value = info.value as number;
		if (!value || value < 1) {
			return this.validationUtils.createErrorObject({
				key: 'cloud.common.ValidationRule_ForeignKeyRequired',
				params: {'p_0': this.translateService.instant('cloud.common.entityType').text}
			});
		}
		return this.validationUtils.createSuccessObject();
	}

	protected validateAwardmethodFk(info: ValidationInfo<IConHeaderEntity>) {
		const value = info.value as number;
		if (!value || value < 1) {
			return this.validationUtils.createErrorObject({
				key: 'cloud.common.ValidationRule_ForeignKeyRequired',
				params: {'p_0': this.translateService.instant('cloud.common.entityAwardMethod').text}
			});
		}
		return this.validationUtils.createSuccessObject();
	}

	protected validatePrcCopyModeFk(info: ValidationInfo<IConHeaderEntity>) {
		const value = info.value as number;
		if (!value || value < 1) {
			return this.validationUtils.createErrorObject({
				key: 'cloud.common.ValidationRule_ForeignKeyRequired',
				params: {'p_0': this.translateService.instant('procurement.contract.entityPrcCopyModeFk').text}

			});
		}
		return this.validationUtils.createSuccessObject();
	}

	protected validateOverallDiscount(info: ValidationInfo<IConHeaderEntity>) {
		return this.overallDiscountService.validateOverallDiscountFields(info);
	}

	protected validateOverallDiscountOc(info: ValidationInfo<IConHeaderEntity>) {
		return this.overallDiscountService.validateOverallDiscountFields(info);
	}

	protected validateOverallDiscountPercent(info: ValidationInfo<IConHeaderEntity>) {
		return this.overallDiscountService.validateOverallDiscountPercent(info);
	}

	protected validateBoqWicCatFk(info: ValidationInfo<IConHeaderEntity>) {
		const entity = info.entity;
		const newValue = info.value as number;
		const originalBoqWicCatFk = entity.BoqWicCatFk;

		entity.BoqWicCatFk = newValue;
		if (!entity.BoqWicCatBoqFk) {
			entity.BoqWicCatBoqFk = undefined;
			if (!entity.MaterialCatalogFk) {
				entity.FrameworkConHeaderFk = undefined;
			}
		}

		if (originalBoqWicCatFk !== newValue) {
			this.dataService.readonlyProcessor.process(entity);
		}

		this.updatePurchaseOrders(entity);

		return this.validationUtils.createSuccessObject();
	}

	//todo: lvy, this validate function need the boq service ready
	//service.asyncValidateBoqWicCatBoqFk = function asyncValidateBoqWicCatBoqFk
	//todo: lvy
	//function changeBoqWicCatBoqFk(entity, value, model)


	protected async validateDateEffective(info: ValidationInfo<IConHeaderEntity>) {
		//todo: lvy, related to boq, need the boq service ready

		// let procurementCommonDateEffectiveValidateService = $injector.get('procurementCommonDateEffectiveValidateService');
		// let prcHeaderService = $injector.get('procurementContextService').getMainService();
		// let prcContractBoqService = $injector.get('prcBoqMainService').getService(prcHeaderService);
		// // let boqMainSrvc = $injector.get('prcBoqMainService').getService(dataService);
		// let selectHeader = prcHeaderService.getSelected();
		// return procurementCommonDateEffectiveValidateService.asyncModifyDateEffectiveAndUpdateBoq(entity, value, model, prcContractBoqService, dataService, service, {
		// 	ProjectId: selectHeader.ProjectFk,
		// 	Module: 'procurement.contract',
		// 	BoqHeaderId: selectHeader ? selectHeader.PrcHeaderFk : -1,
		// 	HeaderId: entity.Id,
		// 	ExchangeRate: entity.ExchangeRate
		// });
		return this.validationUtils.createSuccessObject();
	}


	private async changeMaterialCatalogFk(entity: IConHeaderEntity, newValue: number): Promise<ValidationResult> {
		if (!entity || entity.MaterialCatalogFk === newValue) {
			return this.validationUtils.createSuccessObject();
		}

		const originalMdcCatalogFk = entity.MaterialCatalogFk;
		entity.MaterialCatalogFk = newValue;
		this.updatePurchaseOrders(entity);

		if (entity.PurchaseOrders === ProcurementPurchaseOrderType.FrameworkContractCallOff) {
			entity.PrcCopyModeFk = ProcurementCopyMode.OnlyAllowedCatalogs;
			if (!entity.Id) {
				this.dataService.frameworkMdcCatalogChanged$.next({
					headerId: entity.Id,
					newValue: newValue,
					oldValue: originalMdcCatalogFk,
				});
			}
		}

		const mdcCatalog = await firstValueFrom(this.materialCatalogLookupService.getItemByKey({id: newValue}));
		if (mdcCatalog) {
			this.updateEntityWithMdcCatalogData(entity, mdcCatalog);

			const hasMdcCatPaymentTermFks = !!(mdcCatalog.PaymentTermAdFk || mdcCatalog.PaymentTermFiFk || mdcCatalog.PaymentTermFk);
			this.validateBusinessPartnerFk(
				new ValidationInfo(entity, mdcCatalog.BusinessPartnerFk, 'BusinessPartnerFk'),
				undefined,
				mdcCatalog.SupplierFk,
				mdcCatalog.SubsidiaryFk
			);
			this.validateSupplierFk(new ValidationInfo(entity, mdcCatalog!.SupplierFk, 'SupplierFk'), !hasMdcCatPaymentTermFks);

			if (hasMdcCatPaymentTermFks) {
				this.updateEntityPaymentTerms(entity, mdcCatalog);
			}

			this.dataService.readonlyProcessor.process(entity);

			if (mdcCatalog.ConHeaderFk) {
				await this.updateEntityWithFrameworkContractData(entity, mdcCatalog.ConHeaderFk);
			}

			this.dataService.setModified(entity);
		}

		return this.validationUtils.createSuccessObject();
	}

	private updateEntityWithMdcCatalogData(entity: IConHeaderEntity, mdcCatalog: IMaterialCatalogLookupEntity) {
		entity.SubsidiaryFk = mdcCatalog.SubsidiaryFk;
		entity.IncotermFk = mdcCatalog.IncotermFk;
		entity.FrameworkConHeaderFk = mdcCatalog.ConHeaderFk || entity.FrameworkConHeaderFk;
		entity.BusinessPartnerFk = mdcCatalog.BusinessPartnerFk as number;
		this.dataService.setModified(entity);
	}

	private updateEntityPaymentTerms(entity: IConHeaderEntity, mdcCatalog: IMaterialCatalogLookupEntity) {
		entity.PaymentTermFiFk = mdcCatalog.PaymentTermFiFk;
		entity.PaymentTermPaFk = mdcCatalog.PaymentTermFk;
		entity.PaymentTermAdFk = mdcCatalog.PaymentTermAdFk;
		this.dataService.setModified(entity);
	}

	private async updateEntityWithFrameworkContractData(entity: IConHeaderEntity, conHeaderFk: number) {
		const frameworkContract = await firstValueFrom(this.dataService.getContractById(conHeaderFk)) as IConHeaderEntity;
		if (frameworkContract && frameworkContract.PrcHeaderEntity && frameworkContract.PrcHeaderEntity.StructureFk) {
			entity.PrcHeaderEntity!.StructureFk = frameworkContract.PrcHeaderEntity!.StructureFk;
			this.dataService.setModified(entity);
		}
	}



	private async getDefaultCurrentRate(entity: IConHeaderEntity, currencyFk: number) {
		const params = {
			CompanyFk: this.dataService.loginCompanyEntity.CompanyFk as number,
			CurrencyForeignFk: currencyFk as number,
			ProjectFk: entity.ProjectFk as number,
			currencyRateTypeFk: BasicsCurrencyRateType.ExchangeRate
		};
		return this.http.get( 'procurement/common/exchangerate/defaultrate', {params: params});
	}

	public getEntityRuntimeData(): IEntityRuntimeDataRegistry<IConHeaderEntity> {
		return this.dataService;
	}

	/**
	 *If "Is Framework" is true  => "Framework Contract"
	 *If "Is Framework" is false and ("Framework Wic Group" is not null or "Framework Material Catalog" is not null)  => "Framework Contract Call Off"
	 *If "Basis Contract" and "Change Request" is null                  => "Purchase Order"
	 *If "Basis Contract" is not null and "Change Request'" is null     => "Call Off"
	 *If "basis Contract" is not null and "Change Request" is not null  => "Change Order"
	 *If "basis Contract" is null and "Change Request" is not null      => "Change Order"
	 */
	private updatePurchaseOrders(entity: IConHeaderEntity) {
		if (entity.IsFramework) {
			entity.PurchaseOrders = ProcurementPurchaseOrderType.FrameworkContract;
		} else if (!entity.IsFramework && (entity.BoqWicCatFk || entity.MaterialCatalogFk)) {
			entity.PurchaseOrders = ProcurementPurchaseOrderType.FrameworkContractCallOff;
		} else if (!entity.ContractHeaderFk) {
			entity.PurchaseOrders = ProcurementPurchaseOrderType.PurchaseOrder;
		} else if (entity.ContractHeaderFk && !entity.ProjectChangeFk) {
			entity.PurchaseOrders = ProcurementPurchaseOrderType.CallOff;
			this.conItemService.updatePrcItemsByConHeaderFk(entity.ContractHeaderFk);
		} else {
			entity.PurchaseOrders = ProcurementPurchaseOrderType.ChangeOrder;
		}
		//todo: lvy, need to subscribe this event after the restriction container ready, in serivce: prc-contract-master-restriction-data-service
		this.dataService.purchaseUpdatedMessage$.next(entity);
	}

	private async getConHeader2BoqWicCatBoq(boqWicCatBoqFk: number) {
		const con2icCatBoqs = await firstValueFrom(this.con2BoqWicCatLookupService.getList());
		if (con2icCatBoqs) {
			const sortedCon2icCatBoqs = orderBy(con2icCatBoqs, ['Id'], ['desc']);
			return sortedCon2icCatBoqs.find(e => e.BoqWicCatBoqFk === boqWicCatBoqFk) || null;
		}
		return null;
	}

	private async updateClerkByProject(entity: IConHeaderEntity, newProjectId: number) {
		const params = {
			prcStructureFk: entity.PrcHeaderEntity!.StructureFk,
			projectFk: newProjectId,
			companyFk: entity.CompanyFk
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

	private async updateProjectStatus(entity: IConHeaderEntity, projectId: number) {
		const project = await firstValueFrom(this.projectLookupService.getItemByKey({id: projectId}));
		entity.ProjectStatusFk = project?.StatusFk ?? null;
		this.dataService.setModified(entity);
	}

	private async updateAddressByProject(entity: IConHeaderEntity, projectId: number) {
		if (!entity.AddressFk) {
			const address = await this.http.get<AddressEntity>('procurement/package/package/getdeliveryaddress', {params: {projectId: projectId}});
			if (address) {
				entity.AddressFk = address.Id;
				entity.AddressEntity = address;
				this.dataService.setModified(entity);
			}
		}
	}

	private async copyCertificatesFromProject(entity: IConHeaderEntity, projectId: number) {
		if (entity.ProjectFk !== projectId) {
			this.certificateDataService.copyCertificatesFromOtherModule(projectId, {PrcHeaderId: entity.PrcHeaderFk, PrjProjectId: projectId});
		}
	}

	private async getDefaultBillingSchemas(prcConfigurationFk: number) {
		const params = {
			configurationFk: prcConfigurationFk
		};
		return this.http.get('procurement/common/configuration/defaultbillingschemas', {params});
	}

}