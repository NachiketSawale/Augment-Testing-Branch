/*
 * Copyright(c) RIB Software GmbH
 */
import * as math from 'mathjs';
import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IReadOnlyField, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';

import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { firstValueFrom } from 'rxjs';
import {
	BasicsSharedCompanyContextService,
	BasicsSharedDataValidationService,
	BasicsSharedDecimalPlacesEnum,
	BasicsSharedPrcStockTransactionTypeLookupService,
	BasItemType,
	MainDataDto,
} from '@libs/basics/shared';
import { ProcurementShareContractLookupService, ProjectStockLookupService } from '@libs/procurement/shared';
import { numberNBigNumber, ProcurementStockTransactionType } from '@libs/procurement/common';
import { IInv2ContractEntity, IItemsResult } from '../model';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';
import { ProcurementInvoiceContractItemDataService } from './procurement-invoice-contract-item-data.service';
import { ControllingSharedControllingUnitLookupService } from '@libs/controlling/shared';
import { IPrcStructureTaxEntity } from '@libs/basics/interfaces';
import { ProcurementInvoiceCertificateDataService } from '../services/procurement-invoice-certificate-data.service';

@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceContractItemValidationService extends BaseValidationService<IInv2ContractEntity> {
	private http = inject(PlatformHttpService);
	private readonly translationService = inject(PlatformTranslateService);
	private readonly validationService = inject(BasicsSharedDataValidationService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	protected readonly companyContext = inject(BasicsSharedCompanyContextService);
	private readonly emptyMsgKey = 'cloud.common.emptyOrNullValueErrorMessage';

	private readonly ctrUnitLookupService = inject(ControllingSharedControllingUnitLookupService);
	private readonly transactionTypeService = inject(BasicsSharedPrcStockTransactionTypeLookupService);
	private readonly conHeaderLookupService = inject(ProcurementShareContractLookupService);
	private readonly projectStockLookupService = inject(ProjectStockLookupService);
	private readonly dataService = inject(ProcurementInvoiceContractItemDataService);
	private readonly parentService = inject(ProcurementInvoiceHeaderDataService);
	private readonly certificateService = inject(ProcurementInvoiceCertificateDataService);

	public constructor() {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<IInv2ContractEntity> {
		return {
			ConHeaderFk: this.asyncValidateConHeaderFk,
			Quantity: this.asyncValidateQuantity,
			Percentage: this.asyncValidatePercentage,
			PrcItemFk: this.asyncValidatePrcItemFk,
			PrcBoqFk: this.asyncValidatePrcBoqFk,
			TaxCodeFk: this.asyncValidateTaxCodeFk,
			PrjStockFk: this.asyncValidatePrjStockFk,
			LotNo: this.asyncValidateLotNo,
			ExpirationDate: this.asyncValidateExpirationDate,
			PrcStockTransactionFk: this.validatePrcStockTransactionFk,
			ControllingUnitFk: this.asyncValidateControllingUnitFk,
			PrjStockLocationFk: this.syncValidatePrjStockLocationFk,
			PrcStructureFk: this.asyncValidatePrcStructureFk,
			TotalValue: this.asyncValidateTotalValue,
			TotalValueGross: this.asyncValidateTotalValueGross,
			TotalValueOc: this.asyncValidateTotalValueOc,
			TotalValueGrossOc: this.asyncValidateTotalValueGrossOc,
			IsAssetManagement: this.validateIsAssetManagement,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IInv2ContractEntity> {
		return this.dataService;
	}

	protected get entityProxy() {
		return this.dataService.entityProxy;
	}

	private async asyncValidateConHeaderFk(info: ValidationInfo<IInv2ContractEntity>) {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : undefined;
		if (!value) {
			this.validationUtils.createErrorObject({ key: 'cloud.common.emptyOrNullValueErrorMessage' });
		} else {
			const conHeader = await firstValueFrom(this.conHeaderLookupService.getItemByKey({ id: value }));
			if (conHeader) {
				entity.PrcHeaderId = conHeader.PrcHeaderId;
				entity.TaxCodeFk = entity.TaxCodeFk ?? conHeader.TaxCodeFk;

				this.parentService.onCopyInvGenerals$.next({ PrcHeaderId: entity.PrcHeaderId, Code: conHeader.Code, Description: conHeader.Description });
				await this.certificateService.copyAndUpdateCertificates(conHeader, value);
				this.dataService.setModified(entity);
			}
		}
		return this.validationUtils.createSuccessObject();
	}

	private async asyncValidatePercentage(info: ValidationInfo<IInv2ContractEntity>) {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : undefined;
		if (value) {
			entity.Quantity = math.bignumber(value).div(100).mul(entity.OrderQuantity ?? 1).toNumber();
			if (!entity.PrcBoqFk) {
				entity.Quantity = this.roundQuantity(entity, math.bignumber(entity.Quantity), this.dataService.roundingType.Quantity);
			}
		}
		entity.Percentage = value?? 0;
		if (!value) {
			entity.Percentage = 0;
		}

		return this.asyncValidateQuantity({ entity: entity, value: entity.Quantity, field: 'Quantity' });
	}

	private async asyncValidatePrcItemFk(info: ValidationInfo<IInv2ContractEntity>) {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : undefined;
		entity.PrcItemFk = value;
		const res = await this.dataService.readBasItemTypeFk(entity);
		if (res) {
			if (res.BasItemTypeFk === BasItemType.TextElement) {
				this.dataService.canReadonlyByPrcItemBasItemType(entity, true);
			} else {
				this.validatePrcitemFk(entity, value);
			}
		} else {
			this.validatePrcitemFk(entity, value);
		}

		return this.validationUtils.createSuccessObject();
	}

	private validatePrcitemFk(entity: IInv2ContractEntity, value?: number) {
		return this.validationUtils.createSuccessObject();
		//todo:  wait lvy ticket: https://rib-40.atlassian.net/browse/DEV-21784
		// let defer = $q.defer();
		// let result = {apply: true, valid: true};
		// dataService.updateReadOnly(entity);
		// // updateprjstockReadOnly(entity);
		//
		// if (!value) {
		// 	entity.PrcItemDiscountSplit = 0;
		// 	entity.PrcItemDiscountSplitOc = 0;
		// 	entity.PrcItemQuantity = 0;
		// 	entity.Co2Project = null;
		// 	entity.Co2ProjectTotal = null;
		// 	entity.Co2Source = null;
		// 	entity.Co2SourceTotal = null;
		// 	clearExtraFields(entity);
		// 	setExtraFieldsReadonly(entity, true);
		// 	entity.OrderQuantity = 0;
		// 	entity.Percentage = 0;
		// 	defer.resolve(result);
		// 	return defer.promise;
		// }
		// setExtraFieldsReadonly(entity, false);
		// var prcItems = basicsLookupdataLookupDescriptorService.getData('PrcItemMergedLookup');
		// if (!prcItems) {
		// 	defer.resolve(result);
		// 	return defer.promise;
		// }
		//
		// let filter = {
		// 	InvHeaderId: entity.InvHeaderFk,
		// 	IsCanceled: false,
		// 	ContractId: entity.ConHeaderFk,
		// 	IncludeDeliveredCon: true
		// };
		// $http.post(globals.webApiBaseUrl + 'procurement/common/prcitem/getitems4create', filter).then(function (res) {
		// 	var foundPrcItems = res.data;
		// 	var response = _.find(foundPrcItems, {Id: value});
		// 	if (!angular.isObject(response)) {
		// 		return true;
		// 	}
		// 	var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(response.TaxCodeFk);
		// 	var isCalculateOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
		// 	var exchangeRate = getParentExchangeRate();
		// 	let constant = getContractRoundingMethod(entity);
		// 	entity.MaterialCode = response.MaterialCode;
		// 	entity.MdcMaterialFk= response.MdcMaterialFk;
		// 	entity.MaterialExternalCode = response.MaterialExternalCode;
		// 	entity.FurtherDescription = response.PrcItemDescription2;
		// 	/** @namespace response.PrcItemDescription */
		// 	entity.Description = response.PrcItemDescription;
		// 	entity.OrderQuantity = response.Quantity;
		// 	entity.Uom = response.Uom;
		// 	entity.PriceOc = itemCalculationHelper.getPriceByTotalPriceForInv(response.TotalPriceOc, response.PriceUnit, response.FactorPriceUnit, constant);
		// 	entity.Price = itemCalculationHelper.getPriceByTotalPriceForInv(response.TotalPrice, response.PriceUnit, response.FactorPriceUnit, constant);
		// 	entity.PriceGross = itemCalculationHelper.getPriceByTotalPriceForInv(response.TotalPriceGross, response.PriceUnit, response.FactorPriceUnit, constant);
		// 	entity.PriceOcGross = itemCalculationHelper.getPriceByTotalPriceForInv(response.TotalPriceGrossOc, response.PriceUnit, response.FactorPriceUnit, constant);
		//
		// 	entity.PrcItemDiscountSplit = response.DiscountSplit;
		// 	entity.PrcItemDiscountSplitOc = response.DiscountSplitOc;
		// 	entity.PrcItemQuantity = response.Quantity;
		//
		// 	entity.AlternativeQuantity = 0;
		// 	entity.AlternativeUomFk = response.AlternativeUomFk;
		// 	entity.MaterialStockFk = response.MaterialStockFk;
		// 	entity.Material2Uoms = response.Material2Uoms;
		// 	entity.PrcItemJobCode = response.JobCode;
		// 	entity.PrcItemJobDescription = response.JobDescription;
		// 	entity.Co2Project = response.Co2Project;
		// 	entity.Co2ProjectTotal = response.Co2ProjectTotal;
		// 	entity.Co2Source = response.Co2Source;
		// 	entity.Co2SourceTotal = response.Co2SourceTotal;
		//
		// 	entity.AlternativeQuantity = conversionQuantity(entity, entity.AlternativeUomFk, entity.Quantity, null);// entity.AlternativeQuantity
		//
		// 	resetDiscountSplit(entity);
		//
		// 	if (isCalculateOverGross) {
		// 		entity.TotalValueGrossOc = itemCalculationHelper.getTotalValueOcGrossForInv(entity, vatPercent, constant);
		// 		entity.TotalValueGross = itemCalculationHelper.getTotalValueGrossForInv(entity, vatPercent, exchangeRate, constant);
		// 		recalculateTotalValueAndContract(entity);
		// 	} else {
		// 		recalculateTotalValue(entity);
		// 		entity.TotalValueGrossOc = itemCalculationHelper.getTotalValueOcGrossForInv(entity, vatPercent, constant);
		// 		entity.TotalValueGross = itemCalculationHelper.getTotalValueGrossForInv(entity, vatPercent, exchangeRate, constant);
		// 		dataService.recalcuteContract();
		// 	}
		// 	entity.TotalPriceOc = round(entity, roundingType.Inv2Con_TotalPriceOc, response.TotalOc);// specific
		// 	entity.TotalPrice = round(entity, roundingType.Inv2Con_TotalPrice, response.Total);// specific
		// 	entity.PrcStructureFk = response.PrcStructureFk;
		// 	entity.ControllingUnitFk = response.ControllingUnitFk;
		// 	service.validateControllingUnitFk(entity, entity.ControllingUnitFk, 'ControllingUnitFk');
		// 	service.asyncValidateControllingUnitFk(entity, entity.ControllingUnitFk, 'ControllingUnitFk');
		// 	entity.PrcItemStatusFk = response.PrcItemStatusFk;
		// 	entity.TaxCodeFk = response.TaxCodeFk;
		//
		// 	entity.BasUomPriceUnit = response.BasUomPriceUnit;
		//
		// 	entity.FactorPriceUnit = response.FactorPriceUnit;
		// 	entity.OrderQuantityConverted = round(entity, roundingType.OrderQuantityConverted, math.bignumber(entity.OrderQuantity).mul(entity.FactorPriceUnit).toNumber());
		// 	entity.Percentage = 0;
		// 	if (entity.Quantity && entity.OrderQuantity) {
		// 		entity.Percentage = itemCalculationHelper.getPercentageForInv(entity.Quantity, entity.OrderQuantity);
		// 	}
		//
		// 	entity.PrcItemTotalGross = round(entity, roundingType.PrcItemTotalGross, response.TotalGross);
		// 	entity.PrcItemTotalGrossOc = round(entity, roundingType.PrcItemTotalGrossOc, response.TotalGrossOc);
		//
		// 	// procurementInvoiceCertificateDataService.copyCertificatesFromMaterial(entity.InvHeaderFk, response.MdcMaterialFk);
		// 	// copy certificate from material module.
		// 	if (response.MdcMaterialFk > 0) {
		// 		var options = {
		// 			url: 'procurement/invoice/certificate/copycertificatesfrommaterial',
		// 			dataService: procurementInvoiceCertificateDataService,
		// 			parameter: {InvHeaderId: entity.InvHeaderFk, MdcMaterialId: response.MdcMaterialFk}
		// 		};
		// 		procurementInvoiceCertificateDataService.copyCertificatesFromOtherModule(options);
		// 	}
		//
		// 	resetTaxCode(response.TaxCodeFk, entity);
		//
		// 	if (entity && entity.PrcItemFk) {
		// 		$http.get(globals.webApiBaseUrl + 'procurement/common/prcitem/creategrpset?mainItemId=' + entity.Id + '&prcItemFk=' + entity.PrcItemFk)
		// 			.then(function (response) {
		// 				var _entity = response.data;
		// 				if (_entity) {
		// 					var GrpSetDTLDataService = $injector.get('procurementInvGrpSetDTLByContractDataService');
		// 					GrpSetDTLDataService.roadData(entity, _entity);
		// 					GrpSetDTLDataService.gridRefresh();
		// 				}
		// 			});
		// 	}
		// 	dataService.fireItemModified(entity);
		// 	updateprjstockReadOnly(entity);
		// 	defer.resolve(result);
		// });
		// return defer.promise;
	}

	private async asyncValidatePrcBoqFk(info: ValidationInfo<IInv2ContractEntity>) {
		return this.validationUtils.createSuccessObject();
		//todo:  wait lvy ticket: https://rib-40.atlassian.net/browse/DEV-21784
		// entity.PrcBoqFk = value;
		// dataService.updateReadOnly(entity);
		// updateprjstockReadOnly(entity);
		//
		// checkIsAssetManagementReadonly(entity);
		// if (!value) {
		// 	clearExtraFields(entity);
		// 	return true;
		// }
		//
		// // eslint-disable-next-line no-unused-vars
		// var exchangeRate = parentService.getSelected().ExchangeRate;
		//
		// resetTaxCode(null, entity);
		//
		// entity.MaterialCode = null;
		// // TODO: it may be wrong
		//
		// var data = {
		// 	// BaseNChangeOrderPrcHeaderIds: dataService.getBaseNChangeOrderPrcHeaderIds(entity.ConHeaderFk),
		// 	ConHeaderId: entity.ConHeaderFk,
		// 	PrcBoqId: value
		// };
		// // $http.get(globals.webApiBaseUrl + 'procurement/common/boq/getboqrootitem?id=' + value).then(function (response) {
		// $http.post(globals.webApiBaseUrl + 'procurement/common/boq/getmergedboqrootitem', data).then(function (response) {
		// 	if (response && response.data && response.data.BoqItem) {
		// 		let boqItemInfo = response.data;
		// 		let boqItem = boqItemInfo.BoqItem;
		// 		entity.Description = boqItem.BriefInfo.Translated;
		// 		entity.OrderQuantity = 1;
		// 		var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(response.TaxCodeFk);
		// 		var isCalculateOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
		// 		var exchangeRate = getParentExchangeRate();
		// 		let finalPriceOc = boqItemInfo.MergedFinalPriceOc;
		// 		let constant = getContractRoundingMethod(entity);
		// 		entity.PriceOc = round(entity, roundingType.PriceOc, finalPriceOc);
		//
		// 		entity.Price = itemCalculationHelper.getUnitRateNonOcByOc(entity.PriceOc, exchangeRate, constant);
		// 		entity.PriceGross = itemCalculationHelper.getUnitRateAfterTaxByPreTax(entity.Price, vatPercent, constant);
		// 		entity.PriceOcGross = itemCalculationHelper.getUnitRateAfterTaxByPreTax(entity.PriceOc, vatPercent, constant);
		//
		// 		if (isCalculateOverGross) {
		// 			entity.TotalValueGrossOc = itemCalculationHelper.getTotalValueOcGrossForInv(entity, vatPercent, constant);
		// 			entity.TotalValueGross = itemCalculationHelper.getTotalValueGrossForInv(entity, vatPercent, exchangeRate, constant);
		// 			recalculateTotalValueAndContract(entity);
		// 		} else {
		// 			recalculateTotalValue(entity);
		// 			entity.TotalValueGrossOc = itemCalculationHelper.getTotalValueOcGrossForInv(entity, vatPercent, constant);
		// 			entity.TotalValueGross = itemCalculationHelper.getTotalValueGrossForInv(entity, vatPercent, exchangeRate, constant);
		// 			dataService.recalcuteContract();
		// 		}
		// 		entity.TotalPriceOc = round(entity, roundingType.Inv2Con_TotalPriceOc, finalPriceOc);// specific
		// 		entity.TotalPrice = itemCalculationHelper.getAmountNonOcByOc(entity.TotalPriceOc, exchangeRate, constant, roundingType.Inv2Con_TotalPrice);// specific
		//
		// 		entity.PrcItemTotalGrossOc = itemCalculationHelper.getTotalGrossOcForInv(entity.PriceOc, entity.OrderQuantity, 0, 0, vatPercent, 1, 1, 0, constant);
		// 		entity.PrcItemTotalGross = itemCalculationHelper.getTotalGrossForInv(entity.Price, entity.OrderQuantity, 0, 0, vatPercent, 1, 1, 0, entity.PrcItemTotalGrossOc, exchangeRate, constant);
		// 		entity.DiscountSplit = round(entity, roundingType.DiscountSplit, boqItem.Discount);
		// 		entity.DiscountSplitOc = round(entity, roundingType.DiscountSplitOc, boqItem.DiscountOc);
		//
		// 		dataService.fireItemModified(entity);
		// 	}
		// });
		//
		// /* $http.get(globals.webApiBaseUrl + 'procurement/common/boq/getboqitem?id=' + value).then(function (response) {
		//  if (response && response.data) {
		//
		//  dataService.fireItemModified(entity);
		//  }
		//  }); */
		//
		// $http.get(globals.webApiBaseUrl + 'procurement/package/package/getprcboqpackage?id=' + value).then(function (response) {
		// 	if (response && response.data) {
		// 		entity.PrcStructureFk = response.data.StructureFk;
		//
		// 		dataService.fireItemModified(entity);
		// 	}
		// });
		//
		// $http.get(globals.webApiBaseUrl + 'basics/unit/getuom').then(function (response) {
		// 	if (response && response.data) {
		// 		entity.Uom = response.data.UoM;
		// 		dataService.fireItemModified(entity);
		// 	}
		// });
		//
		// $http.get(globals.webApiBaseUrl + 'procurement/common/boq/getboq?id=' + value).then(function (response) {
		// 	if (response && response.data) {
		// 		entity.ControllingUnitFk = response.data.MdcControllingunitFk;
		// 		dataService.fireItemModified(entity);
		// 	}
		// });
		//
		// return true;
	}

	private async asyncValidateTaxCodeFk(info: ValidationInfo<IInv2ContractEntity>) {
		return this.validationUtils.createSuccessObject();
		//todo:  wait lvy ticket: https://rib-40.atlassian.net/browse/DEV-21784
		// entity.TaxCodeFk = value;
		// var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(value);
		// var isCalculateOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
		// var onEntityCreated = !!(options && options.onEntityCreated);
		// var exchangeRate = getParentExchangeRate();
		// let constant = getContractRoundingMethod(entity);
		// if (isCalculateOverGross && !onEntityCreated) {
		// 	entity.Price = itemCalculationHelper.getUnitRatePreTaxByAfterTax(entity.PriceGross, vatPercent, constant);
		// 	entity.PriceOc = itemCalculationHelper.getUnitRatePreTaxByAfterTax(entity.PriceOcGross, vatPercent, constant);
		// 	entity.TotalPrice = itemCalculationHelper.getAmountAfterTaxByPreTax(entity.PrcItemTotalGross, vatPercent, constant, roundingType.Inv2Con_TotalPrice);// specific
		// 	entity.TotalPriceOc = itemCalculationHelper.getAmountAfterTaxByPreTax(entity.PrcItemTotalGrossOc, vatPercent, constant, roundingType.Inv2Con_TotalPriceOc);// specific
		// 	recalculateTotalValueAndContract(entity);
		// } else {
		// 	entity.PriceGross = itemCalculationHelper.getUnitRateAfterTaxByPreTax(entity.Price, vatPercent, constant);
		// 	entity.PriceOcGross = itemCalculationHelper.getUnitRateAfterTaxByPreTax(entity.PriceOc, vatPercent, constant);
		// 	if (entity.PrcItemFk) {
		// 		var prcItem = dataService.getLookupValue(entity, 'PrcItemFk:PrcItemMergedLookup');
		// 		if (prcItem) {
		// 			entity.PriceGross = itemCalculationHelper.getPriceByTotalPriceForInv(prcItem.TotalPriceGross, prcItem.PriceUnit, prcItem.FactorPriceUnit, constant);
		// 			entity.PriceOcGross = itemCalculationHelper.getPriceByTotalPriceForInv(prcItem.TotalPriceGrossOc, prcItem.PriceUnit, prcItem.FactorPriceUnit, constant);
		// 		}
		// 		entity.PrcItemTotalGrossOc = itemCalculationHelper.getTotalGrossOcForInv(entity.PriceOc, entity.OrderQuantity, 0, 0, vatPercent, 1, 1, entity.PrcItemDiscountSplitOc, constant);
		// 		entity.PrcItemTotalGross = itemCalculationHelper.getTotalGrossForInv(entity.Price, entity.OrderQuantity, 0, 0, vatPercent, 1, 1, entity.PrcItemDiscountSplit, entity.PrcItemTotalGrossOc, exchangeRate, constant);
		// 	} else {
		// 		entity.PrcItemTotalGrossOc = itemCalculationHelper.getTotalGrossOcForInv(entity.PriceOc, entity.OrderQuantity, 0, 0, vatPercent, 1, 1, 0);
		// 		entity.PrcItemTotalGross = itemCalculationHelper.getTotalGrossForInv(entity.Price, entity.OrderQuantity, 0, 0, vatPercent, 1, 1, 0, entity.PrcItemTotalGrossOc, exchangeRate, constant);
		// 	}
		// 	entity.TotalValueGrossOc = itemCalculationHelper.getTotalValueOcGrossForInv(entity, vatPercent, constant);
		// 	entity.TotalValueGross = itemCalculationHelper.getTotalValueGrossForInv(entity, vatPercent, exchangeRate, constant);
		// 	dataService.recalcuteContract();
		// }
	}

	private async asyncValidatePrjStockFk(info: ValidationInfo<IInv2ContractEntity>, isUpdate?: boolean) {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : undefined;
		let isReadonly = true;
		const fields = ['ProvisionPercent', 'ProvisionTotal'];

		const prjStockEntity = await firstValueFrom(this.projectStockLookupService.getItemByKey({ id: value ?? 0 }));
		if (!prjStockEntity) {
			if (!value) {
				this.dataService.setEntityReadOnlyFields(entity, this.fieldsToReadonly(fields, true));
			} else {
				isReadonly = !(await this.getProvisionAllowed(value));
				this.dataService.setEntityReadOnlyFields(entity, this.fieldsToReadonly(fields, isReadonly));
			}
		} else {
			isReadonly = !prjStockEntity.IsProvisionAllowed;
			this.dataService.setEntityReadOnlyFields(entity, this.fieldsToReadonly(fields, isReadonly));
		}
		if (value && (entity.PrjStockFk !== value || isUpdate)) {
			const itemResult = await this.getMaterial2Stock(entity.Quantity, entity.PrcItemFk ?? 0, value);
			if (itemResult) {
				entity.PrjStockLocationFk = itemResult.PrjStockLocationFk;
				if (itemResult.IsInStock2Material) {
					entity.PrcStockTransactionTypeFk = ProcurementStockTransactionType.MaterialReceipt;
					await this.asyncValidatePrcStockTransactionTypeFk({ entity: entity, value: entity.PrcStockTransactionTypeFk, field: 'PrcStockTransactionTypeFk' }, false, true);
				}
				if (isReadonly) {
					entity.ProvisionPercent = 0;
					entity.ProvisionTotal = 0;
				} else {
					entity.ProvisionPercent = itemResult.ProvisionPercent?? 0;
					entity.ProvisionTotal = this.dataService.prcRoundingService.round(this.dataService.roundingType.ProvisionTotal, itemResult.ProvisionTotal?? 0);
				}
			}

			const isLotManagement = itemResult.IsLotManagement;
			if (isLotManagement && (entity.LotNo === null || entity.LotNo === '')) {
				this.addInvalidateResult(entity, 'LotNo', this.emptyMsgKey, 'procurement.common.entityLotNo');
			}

			if (!prjStockEntity) {
				const isMandatory = await this.getIsLocationMandatory(value);
				if (isMandatory && entity.PrjStockLocationFk === null) {
					this.addInvalidateResult(entity, 'PrjStockLocationFk', this.emptyMsgKey, 'procurement.common.entityPrjStockLocation');
				}
			} else {
				if (prjStockEntity.IsLocationMandatory && entity.PrjStockLocationFk === null) {
					this.addInvalidateResult(entity, 'PrjStockLocationFk', this.emptyMsgKey, 'procurement.common.entityPrjStockLocation');
				}
			}
			if (entity.PrcStockTransactionTypeFk === null) {
				this.addInvalidateResult(entity, 'PrcStockTransactionTypeFk', this.emptyMsgKey, 'procurement.common.entityPrcStockTransactionType');
			}
		} else {
			const contractItem = await this.dataService.getIsStockContractItem();
			if (contractItem) {
				if (contractItem.PrjStockFk != null && value == null) {
					this.addInvalidateResult(entity, 'PrjStock', this.emptyMsgKey, 'procurement.common.entityPrjStock');
					return this.validationUtils.createErrorObject({
						key: 'cloud.common.emptyOrNullValueErrorMessage',
						params: { fieldName: 'procurement.common.entityPrjStock' },
					});
				}
			}
		}

		return this.validationUtils.createSuccessObject();
	}

	private async asyncValidateLotNo(info: ValidationInfo<IInv2ContractEntity>) {
		return this.asyncValidateIsLotManagementField(info, 'procurement.common.entityLotNo');
	}

	private async asyncValidateExpirationDate(info: ValidationInfo<IInv2ContractEntity>) {
		return this.asyncValidateIsLotManagementField(info, 'procurement.common.ExpirationDate');
	}

	private async asyncValidateIsLotManagementField(info: ValidationInfo<IInv2ContractEntity>, fieldName: string) {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : undefined;
		if (entity.PrjStockFk && !value) {
			const itemResult = await this.getMaterial2Stock(entity.Quantity, entity.PrcItemFk?? undefined, entity.PrjStockFk?? undefined);
			if (itemResult?.IsLotManagement) {
				return this.validationUtils.createErrorObject({
					key: 'cloud.common.emptyOrNullValueErrorMessage',
					params: { object: fieldName },
				});
			}
		}

		return this.validationUtils.createSuccessObject();
	}

	private validatePrcStockTransactionFk(info: ValidationInfo<IInv2ContractEntity>) {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : undefined;
		if (!value && entity.PrcStockTransactionTypeFk == ProcurementStockTransactionType.IncidentalAcquisitionExpense) {
			return this.validationUtils.createErrorObject({
				key: 'cloud.common.emptyOrNullValueErrorMessage',
				params: { object: 'procurement.common.entityPrcStockTransaction' },
			});
		}
		return this.validationUtils.createSuccessObject();
	}

	private async asyncValidateControllingUnitFk(info: ValidationInfo<IInv2ContractEntity>) {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : undefined;
		entity.ControllingUnitFk = value;
		this.updatePrjStockReadOnly(entity);
		if (!value) {
			this.dataService.checkIsAssetManagementReadonly(entity, false);
			return this.validationUtils.createSuccessObject();
		}

		const ctrUnit = await firstValueFrom(this.ctrUnitLookupService.getItemByKey({ id: value }));
		if (ctrUnit?.Isassetmanagement) {
			this.dataService.setEntityReadOnlyFields(entity, this.fieldsToReadonly(['IsAssetManagement'], true));
		} else {
			this.dataService.checkIsAssetManagementReadonly(entity, false);
		}
		const isInvalid = await this.isInvalidControllingUnit(value);
		if (isInvalid) {
			return this.validationUtils.createErrorObject({
				key: 'basics.common.error.controllingUnitError',
				params: { object: 'procurement.common.entityPrcStockTransaction' },
			});
		}

		return this.validationUtils.createSuccessObject();
	}

	private async syncValidatePrjStockLocationFk(info: ValidationInfo<IInv2ContractEntity>) {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : undefined;
		if (!value && entity.PrjStockFk) {
			const prjStockEntity = await firstValueFrom(this.projectStockLookupService.getItemByKey({ id: entity.PrjStockFk }));
			if (prjStockEntity?.IsLocationMandatory) {
				return this.validationUtils.createErrorObject({
					key: 'cloud.common.emptyOrNullValueErrorMessage',
					params: { object: 'procurement.common.entityPrjStockLocation' },
				});
			}
		}

		return this.validationUtils.createSuccessObject();
	}

	private async asyncValidatePrcStructureFk(info: ValidationInfo<IInv2ContractEntity>) {
		const entity = info.entity;
		const value = info.value ? (info.value as number) : undefined;
		if (!value) {
			return this.validationUtils.createErrorObject({
				key: 'cloud.common.emptyOrNullValueErrorMessage',
				params: { object: 'cloud.common.entityStructureCode' },
			});
		}

		const company = this.dataService.companyContextService.loginCompanyEntity;
		if (company?.ContextFk) {
			const result = await this.http.get('basics/procurementstructure/taxcode/list', { params: { mainItemId: value } });
			const prcStructTaxEntities = new MainDataDto<IPrcStructureTaxEntity>(result).Main;
			const index = prcStructTaxEntities.findIndex((item) => item.MdcSalesTaxGroupFk === company?.ContextFk);
			if (index > 1) {
				entity.MdcSalesTaxGroupFk = prcStructTaxEntities[index].MdcSalesTaxGroupFk;
			}
		}

		return this.validationUtils.createSuccessObject();
	}

	private async asyncValidateTotalValue(info: ValidationInfo<IInv2ContractEntity>) {
		return this.validationUtils.createSuccessObject();
		//todo:  wait lvy ticket: https://rib-40.atlassian.net/browse/DEV-21784
		// var exchangeRate = parentService.getSelected().ExchangeRate;
		// var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(entity.TaxCodeFk);
		// let constant = getContractRoundingMethod(entity);
		// var vp = (100 + vatPercent) / 100;
		// entity.IsTotalEdited = true;
		// entity.TotalValue = value;
		// entity.TotalValueOc = itemCalculationHelper.getAmountOcByNonOc(entity.TotalValue, exchangeRate, constant);
		// entity.DiscountSplit = 0;
		// entity.DiscountSplitOc = 0;
		// if (entity.Price !== 0) {
		//   if (entity.PrcItemFk) {
		// 	  var isCalculateOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
		// 	  if (isCalculateOverGross) {
		// 		  entity.Quantity = roundQuantity(entity, math.bignumber(entity.DiscountSplit).div(vp).add(entity.TotalValue).div(entity.Price));
		// 	  } else {
		// 		  entity.Quantity = roundQuantity(entity, math.bignumber(entity.DiscountSplit).add(entity.TotalValue).div(entity.Price));
		// 	  }
		//   } else {
		// 	  entity.Quantity = roundQuantity(entity, math.bignumber(entity.TotalValue).div(entity.Price));
		//   }
		//   entity.AlternativeQuantity = conversionQuantity(entity, entity.AlternativeUomFk, entity.Quantity, null);
		// }
		//
		// entity.Percentage = 0;
		// if (entity.OrderQuantity && entity.Quantity) {
		//   entity.Percentage = itemCalculationHelper.getPercentageForInv(entity.Quantity, entity.OrderQuantity, constant);
		// }
		//
		// entity.TotalValueGross = itemCalculationHelper.getAmountAfterTaxByPreTax(entity.TotalValue, vatPercent, constant);
		// entity.TotalValueGrossOc = itemCalculationHelper.getAmountAfterTaxByPreTax(entity.TotalValueOc, vatPercent, constant);
		//
		// dataService.fireItemModified(entity);
		// dataService.recalcuteContract();
		//
		// getMaterial2Stock(entity.PrcItemFk, entity.PrjStockFk, entity.Quantity).then(function (invoiceItem) {
		//   if (invoiceItem) {
		// 	  entity.ProvisionTotal = round(entity, roundingType.ProvisionTotal, invoiceItem.ProvisionTotal);
		// 	  dataService.gridRefresh();
		//   }
		// });
	}

	private async asyncValidateTotalValueGross(info: ValidationInfo<IInv2ContractEntity>) {
		return this.validationUtils.createSuccessObject();
		//todo:  wait lvy ticket: https://rib-40.atlassian.net/browse/DEV-21784
		// var exchangeRate = parentService.getSelected().ExchangeRate;
		// var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(entity.TaxCodeFk);
		// let constant = getContractRoundingMethod(entity);
		// var vp = (100 + vatPercent) / 100;
		// entity.IsTotalEdited = true;
		// entity.TotalValueGross = value;
		// entity.TotalValueGrossOc = itemCalculationHelper.getAmountOcByNonOc(entity.TotalValueGross, exchangeRate, constant);
		// entity.DiscountSplit = 0;
		// entity.DiscountSplitOc = 0;
		// if (entity.PriceGross !== 0) {
		// 	if (entity.PrcItemFk) {
		// 		var isCalculateOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
		// 		if (isCalculateOverGross) {
		// 			entity.Quantity = roundQuantity(entity, math.bignumber(entity.DiscountSplit).add(entity.TotalValueGross).div(entity.PriceGross));
		// 		} else {
		// 			entity.Quantity = roundQuantity(entity, math.bignumber(entity.DiscountSplit).mul(vp).add(entity.TotalValueGross).div(entity.PriceGross));
		// 		}
		// 	} else {
		// 		entity.Quantity = roundQuantity(entity, math.bignumber(entity.TotalValueGross).div(entity.PriceGross));
		// 	}
		// 	entity.AlternativeQuantity = conversionQuantity(entity, entity.AlternativeUomFk, entity.Quantity, null);
		// }
		//
		// entity.Percentage = 0;
		// if (entity.OrderQuantity && entity.Quantity) {
		// 	entity.Percentage = itemCalculationHelper.getPercentageForInv(entity.Quantity, entity.OrderQuantity, constant);
		// }
		//
		// entity.TotalValue = itemCalculationHelper.getTotalValueForInv(entity, vatPercent, constant);
		// entity.TotalValueOc = itemCalculationHelper.getTotalValueOcForInv(entity, vatPercent, constant);
		//
		// dataService.fireItemModified(entity);
		// dataService.recalcuteContract();
		//
		// getMaterial2Stock(entity.PrcItemFk, entity.PrjStockFk, entity.Quantity).then(function (invoiceItem) {
		// 	if (invoiceItem) {
		// 		entity.ProvisionTotal = round(entity, roundingType.ProvisionTotal, invoiceItem.ProvisionTotal);
		// 		dataService.gridRefresh();
		// 	}
		// });
	}

	private async asyncValidateTotalValueOc(info: ValidationInfo<IInv2ContractEntity>) {
		return this.validationUtils.createSuccessObject();
		//todo:  wait lvy ticket: https://rib-40.atlassian.net/browse/DEV-21784
		// var exchangeRate = parentService.getSelected().ExchangeRate;
		// var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(entity.TaxCodeFk);
		// let constant = getContractRoundingMethod(entity);
		// var vp = (100 + vatPercent) / 100;
		// entity.IsTotalEdited = true;
		// entity.TotalValueGross = value;
		// entity.TotalValueGrossOc = itemCalculationHelper.getAmountOcByNonOc(entity.TotalValueGross, exchangeRate, constant);
		// entity.DiscountSplit = 0;
		// entity.DiscountSplitOc = 0;
		// if (entity.PriceGross !== 0) {
		// 	if (entity.PrcItemFk) {
		// 		var isCalculateOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
		// 		if (isCalculateOverGross) {
		// 			entity.Quantity = roundQuantity(entity, math.bignumber(entity.DiscountSplit).add(entity.TotalValueGross).div(entity.PriceGross));
		// 		} else {
		// 			entity.Quantity = roundQuantity(entity, math.bignumber(entity.DiscountSplit).mul(vp).add(entity.TotalValueGross).div(entity.PriceGross));
		// 		}
		// 	} else {
		// 		entity.Quantity = roundQuantity(entity, math.bignumber(entity.TotalValueGross).div(entity.PriceGross));
		// 	}
		// 	entity.AlternativeQuantity = conversionQuantity(entity, entity.AlternativeUomFk, entity.Quantity, null);
		// }
		//
		// entity.Percentage = 0;
		// if (entity.OrderQuantity && entity.Quantity) {
		// 	entity.Percentage = itemCalculationHelper.getPercentageForInv(entity.Quantity, entity.OrderQuantity, constant);
		// }
		//
		// entity.TotalValue = itemCalculationHelper.getTotalValueForInv(entity, vatPercent, constant);
		// entity.TotalValueOc = itemCalculationHelper.getTotalValueOcForInv(entity, vatPercent, constant);
		//
		// dataService.fireItemModified(entity);
		// dataService.recalcuteContract();
		//
		// getMaterial2Stock(entity.PrcItemFk, entity.PrjStockFk, entity.Quantity).then(function (invoiceItem) {
		// 	if (invoiceItem) {
		// 		entity.ProvisionTotal = round(entity, roundingType.ProvisionTotal, invoiceItem.ProvisionTotal);
		// 		dataService.gridRefresh();
		// 	}
		// });
	}

	private async asyncValidateTotalValueGrossOc(info: ValidationInfo<IInv2ContractEntity>) {
		return this.validationUtils.createSuccessObject();
		//todo:  wait lvy ticket: https://rib-40.atlassian.net/browse/DEV-21784
		// var exchangeRate = parentService.getSelected().ExchangeRate;
		// var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(entity.TaxCodeFk);
		// let constant = getContractRoundingMethod(entity);
		// var vp = (100 + vatPercent) / 100;
		// entity.IsTotalEdited = true;
		// entity.TotalValueGross = value;
		// entity.TotalValueGrossOc = itemCalculationHelper.getAmountOcByNonOc(entity.TotalValueGross, exchangeRate, constant);
		// entity.DiscountSplit = 0;
		// entity.DiscountSplitOc = 0;
		// if (entity.PriceGross !== 0) {
		// 	if (entity.PrcItemFk) {
		// 		var isCalculateOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
		// 		if (isCalculateOverGross) {
		// 			entity.Quantity = roundQuantity(entity, math.bignumber(entity.DiscountSplit).add(entity.TotalValueGross).div(entity.PriceGross));
		// 		} else {
		// 			entity.Quantity = roundQuantity(entity, math.bignumber(entity.DiscountSplit).mul(vp).add(entity.TotalValueGross).div(entity.PriceGross));
		// 		}
		// 	} else {
		// 		entity.Quantity = roundQuantity(entity, math.bignumber(entity.TotalValueGross).div(entity.PriceGross));
		// 	}
		// 	entity.AlternativeQuantity = conversionQuantity(entity, entity.AlternativeUomFk, entity.Quantity, null);
		// }
		//
		// entity.Percentage = 0;
		// if (entity.OrderQuantity && entity.Quantity) {
		// 	entity.Percentage = itemCalculationHelper.getPercentageForInv(entity.Quantity, entity.OrderQuantity, constant);
		// }
		//
		// entity.TotalValue = itemCalculationHelper.getTotalValueForInv(entity, vatPercent, constant);
		// entity.TotalValueOc = itemCalculationHelper.getTotalValueOcForInv(entity, vatPercent, constant);
		//
		// dataService.fireItemModified(entity);
		// dataService.recalcuteContract();
		//
		// getMaterial2Stock(entity.PrcItemFk, entity.PrjStockFk, entity.Quantity).then(function (invoiceItem) {
		// 	if (invoiceItem) {
		// 		entity.ProvisionTotal = round(entity, roundingType.ProvisionTotal, invoiceItem.ProvisionTotal);
		// 		dataService.gridRefresh();
		// 	}
		// });
	}

	private validateIsAssetManagement(info: ValidationInfo<IInv2ContractEntity>) {
		const entity = info.entity;
		const value = info.value ? (info.value as boolean) : undefined;
		const fields = ['FixedAssetFk'];
		if (!value) {
			entity.FixedAssetFk = null;
			this.setFieldReadOnly(entity, fields, true);
		}
		this.setFieldReadOnly(entity, fields, false);

		return this.validationUtils.createSuccessObject();
	}

	private async isInvalidControllingUnit(controllingUnitFk: number) {
		const projectfk = this.parentService.getSelectedEntity()?.ProjectFk;
		const params = {
			ControllingUnitFk: controllingUnitFk,
			ProjectFk: projectfk ?? -1,
		};
		return await this.http.get<boolean>('controlling/structure/validationControllingUnit', { params });
	}

	private addInvalidateResult(entity: IInv2ContractEntity, field: string, errMsgKey: string, translationNameKey: string) {
		const validationResult = this.validationService.createSuccessObject();
		const modelTr = this.translationService.instant(translationNameKey).text;
		validationResult.error = this.translationService.instant(errMsgKey, { object: modelTr }).text;
		this.dataService.addInvalid(entity, { field: field, result: validationResult });
	}

	private async asyncValidateQuantity(info: ValidationInfo<IInv2ContractEntity>) {
		return this.validationUtils.createSuccessObject();
		//todo:  wait lvy ticket: https://rib-40.atlassian.net/browse/DEV-21784
		// var defer = $q.defer();
		// var result = {apply: true, valid: true};
		// var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(entity.TaxCodeFk);
		// var isCalculateOverGross = prcGetIsCalculateOverGrossService.getIsCalculateOverGross();
		// var exchangeRate = getParentExchangeRate();
		// let constant = getContractRoundingMethod(entity);
		// entity.Quantity = roundQuantity(entity, value);
		// resetDiscountSplit(entity);
		// if (isCalculateOverGross) {
		// 	entity.TotalValueGrossOc = itemCalculationHelper.getTotalValueOcGrossForInv(entity, vatPercent, constant);
		// 	entity.TotalValueGross = itemCalculationHelper.getTotalValueGrossForInv(entity, vatPercent, exchangeRate, constant);
		// 	recalculateTotalValueAndContract(entity);
		// } else {
		// 	recalculateTotalValue(entity);
		// 	entity.TotalValueGrossOc = itemCalculationHelper.getTotalValueOcGrossForInv(entity, vatPercent, constant);
		// 	entity.TotalValueGross = itemCalculationHelper.getTotalValueGrossForInv(entity, vatPercent, exchangeRate, constant);
		// 	dataService.recalcuteContract();
		// }
		// dataService.fireItemModified(entity);
		//
		// getMaterial2Stock(entity.PrcItemFk, entity.PrjStockFk, value).then(function (invoiceItem) {
		// 	if (invoiceItem) {
		// 		entity.ProvisionTotal = round(entity, roundingType.ProvisionTotal, invoiceItem.ProvisionTotal);
		// 		dataService.gridRefresh();
		// 	}
		// });
		// entity.Percentage = 0;
		// if (entity.OrderQuantity && value) {
		// 	entity.Percentage = itemCalculationHelper.getPercentageForInv(value, entity.OrderQuantity);
		// }
		//
		// entity.AlternativeQuantity = conversionQuantity(entity, entity.AlternativeUomFk, value, null);
		// defer.resolve(result);
		// return defer.promise;
	}

	private async asyncValidatePrcStockTransactionTypeFk(info: ValidationInfo<IInv2ContractEntity>, isStock?: boolean, isstock2material?: boolean) {
		let validationResult = this.validationService.createSuccessObject();
		const entity = info.entity;
		const value = info.value ? (info.value as number) : undefined;
		const fields = ['PrcStockTransactionFk'];
		this.dataService.setEntityReadOnlyFields(entity, this.fieldsToReadonly(fields, true));
		if (!value) {
			switch (value) {
				case ProcurementStockTransactionType.MaterialReceipt:
					if (isstock2material) {
						this.dataService.setEntityReadOnlyFields(entity, this.fieldsToReadonly(fields, false));
					} else {
						const itemResult = await this.getMaterial2Stock(entity.Quantity, entity.PrcItemFk?? undefined, entity.PrjStockFk?? undefined);
						if (itemResult) {
							this.dataService.setEntityReadOnlyFields(entity, this.fieldsToReadonly(fields, false));
						}
					}
					entity.PrcStockTransactionFk = null;
					break;
				case ProcurementStockTransactionType.IncidentalAcquisitionExpense:
					this.dataService.setEntityReadOnlyFields(entity, this.fieldsToReadonly(fields, false));
					validationResult = this.creatEmptyStockTranMsg(entity);
					break;
				default: {
					//already load the transaction type when init the module
					const tranType = this.transactionTypeService.cache.getItem({ id: value ?? 0  });
					if (tranType?.IsDelta) {
						this.dataService.setEntityReadOnlyFields(entity, this.fieldsToReadonly(fields, false));
						validationResult = this.creatEmptyStockTranMsg(entity);
						entity.PrcStockTransactionFk = null;
					}

					break;
				}
			}
		} else if (isStock) {
			return validationResult;
		} else {
			const contractItem = await this.dataService.getIsStockContractItem();
			if (contractItem) {
				if (contractItem.PrcStockTransactionTypeFk && contractItem.PrjStockFk) {
					const modelTr = this.translationService.instant('procurement.common.entityPrcStockTransactionType').text;
					validationResult.valid = false;
					validationResult.error = this.translationService.instant('cloud.common.emptyOrNullValueErrorMessage', { object: modelTr }).text;
				}
			}
		}
		return validationResult;
	}

	private creatEmptyStockTranMsg(entity: IInv2ContractEntity) {
		const validationResult = this.validationService.createSuccessObject();
		const modelTr = this.translationService.instant('procurement.common.entityPrcStockTransaction').text;
		if (!entity.PrcStockTransactionFk) {
			validationResult.valid = false;
			validationResult.error = this.translationService.instant('cloud.common.emptyOrNullValueErrorMessage', { object: modelTr }).text;
		}
		return validationResult;
	}

	private recalculateTotalValueAndContract(entity: IInv2ContractEntity) {
		//todo: lvy wait ticket: https://rib-40.atlassian.net/browse/DEV-21784
		// var vatPercent = this.dataService.getVatPercentWithTaxCodeMatrix(entity.TaxCodeFk);
		// let constant = this.dataService.getContractRoundingMethod(entity);
		// entity.TotalValue = itemCalculationHelper.getTotalValueForInv(entity, vatPercent, constant);
		// entity.TotalValueOc = itemCalculationHelper.getTotalValueOcForInv(entity, vatPercent, constant);
		// dataService.recalcuteContract();
	}

	private recalculateTotalValue(entity: IInv2ContractEntity) {
		//todo: lvy wait ticket: https://rib-40.atlassian.net/browse/DEV-21784
		// var vatPercent = dataService.getVatPercentWithTaxCodeMatrix(entity.TaxCodeFk);
		// let constant = getContractRoundingMethod(entity);
		// entity.TotalValue = itemCalculationHelper.getTotalValueForInv(entity, vatPercent, constant);
		// entity.TotalValueOc = itemCalculationHelper.getTotalValueOcForInv(entity, vatPercent, constant);
	}

	private clearExtraFields(entity: IInv2ContractEntity) {
		entity.MaterialCode = null;
		entity.MaterialExternalCode = null;
		entity.FurtherDescription = null;
		entity.Description = null;
		entity.OrderQuantity = null;
		entity.PrcItemJobCode = null;
		entity.PrcItemJobDescription = null;
		entity.Uom = null;
		entity.Price = 0;
		entity.PriceOc = 0;

		entity.PriceGross = 0;
		entity.PriceOcGross = 0;
		entity.PrcItemTotalGross = 0;
		entity.PrcItemTotalGrossOc = 0;
		entity.TotalValueGross = 0;
		entity.TotalValueGrossOc = 0;
		entity.DiscountSplit = 0;
		entity.DiscountSplitOc = 0;

		entity.ProvisionPercent = 0;
		entity.ProvisionTotal = 0;
		entity.LotNo = null;
		entity.ExpirationDate = null;
		entity.PrcStockTransactionTypeFk = null;
		entity.PrjStockFk = null;
		entity.PrjStockLocationFk = null;
		entity.PrcStockTransactionFk = null;

		entity.MaterialStockFk = null;
		entity.AlternativeQuantity = null;
		entity.AlternativeUomFk = null;

		this.recalculateTotalValueAndContract(entity);
		entity.TotalPrice = 0;
		entity.TotalPriceOc = 0;

		this.dataService.setModified(entity);
	}

	private setExtraFieldsReadonly(entity: IInv2ContractEntity, isReadOnly: boolean) {
		const fields = ['IsAssetManagement', 'ProvisionTotal', 'LotNo', 'ExpirationDate', 'PrcStockTransactionTypeFk', 'PrjStockFk', 'PrjStockLocationFk', 'PrcStockTransactionFk'];
		this.dataService.setEntityReadOnlyFields(entity, this.fieldsToReadonly(fields, isReadOnly));
	}

	private conversionQuantity(entity: IInv2ContractEntity, uomFk: number, quantity?: number, alterAtiveQuantity?: number) {
		const uomItem = entity.Material2Uoms?.find((m) => m.UomFk === uomFk);
		const value = uomItem?.Quantity ?? 1;
		if (quantity) {
			return this.roundQuantity(entity, math.bignumber(quantity).mul(value), this.dataService.roundingType.Quantity);
		}
		if (alterAtiveQuantity) {
			return this.roundQuantity(entity, math.bignumber(alterAtiveQuantity).mul(value), this.dataService.roundingType.AlternativeQuantity);
		}

		return 0;
	}

	private roundQuantity(entity: IInv2ContractEntity, value: numberNBigNumber, roundingField: number) {
		if (entity?.PrcBoqFk) {
			return this.dataService.prcRoundingService.roundTo(value, BasicsSharedDecimalPlacesEnum.decimalPlaces5);
		}
		if (entity?.PrcItemFk) {
			return this.dataService.prcRoundingService.round(roundingField, value);
		}
		return this.dataService.prcRoundingService.roundTo(value, BasicsSharedDecimalPlacesEnum.decimalPlaces3);
	}

	private async resetTaxCode(entity: IInv2ContractEntity, taxCodeId?: number) {
		if (!taxCodeId) {
			const conHeader = await firstValueFrom(this.conHeaderLookupService.getItemByKey({ id: entity.ConHeaderFk }));
			entity.TaxCodeFk = conHeader?.TaxCodeFk ?? this.parentService.getSelectedEntity()?.TaxCodeFk;
		} else {
			this.dataService.recalcuteContract();
		}
	}

	private async getProvisionAllowed(projectStockId: number) {
		return await this.http.get<boolean>('project/stock/material/getprovisionallowed', {
			params: {
				projectStockId: projectStockId,
			},
		});
	}

	private async getMaterial2Stock(quantity: number, prcItemId?: number, projectStockId?: number) {
		if (!prcItemId || !projectStockId) {
			return {
				IsInStock2Material: false,
				IsLotManagement: false,
				PrjStockLocationFk: null,
				ProvisionPercent: 0,
				ProvisionTotal: 0,
			} as IItemsResult;
		}
		return await this.http.get<IItemsResult>('procurement/invoice/contract/getmaterial2projectstock', {
			params: {
				prcItemId: prcItemId,
				projectStockId: projectStockId,
				quantity: quantity,
			},
		});
	}

	private async getIsLocationMandatory(projectStockId: number) {
		return this.http.get<boolean>('project/stock/material/getislocationmandatory', { params: { projectStockId: projectStockId } });
	}

	private async updatePrjStockReadOnly(entity: IInv2ContractEntity) {
		const item = await this.dataService.getIsStockContractItem();
		if (!item) {
			return null;
		}
		if (item) {
			let isStock = true;
			if (item.PrjStockFk !== null) {
				if (item.PrjStockFk === 0) {
					item.PrjStockFk = null;
				} else {
					entity.PrjStockFk = item.PrjStockFk;
				}
				entity.PrcStockTransactionTypeFk = item.PrcStockTransactionTypeFk;
				isStock = false;
			} else {
				entity.PrjStockFk = null;
				entity.PrcStockTransactionTypeFk = null;
				entity.PrcStockTransactionFk = null;
				entity.PrjStockLocationFk = null;
				entity.ProvisionPercent = 0;
				entity.ProvisionTotal = 0;
				entity.LotNo = null;
				entity.ExpirationDate = null;
			}

			this.dataService.setPrjStockReadOnly(entity, isStock);
			
			this.asyncValidatePrjStockFk({ entity: entity, value: entity.PrjStockFk ?? 0, field: 'PrjStockFk' }, true).then((result) => {
				if (!result.valid) {
					this.dataService.addInvalid(entity, { field: 'PrjStockFk', result: result });
				}
			});

			this.asyncValidateLotNo({ entity: entity, value: entity.LotNo?? '', field: 'LotNo' }).then((result) => {
				if (!result.valid) {
					this.dataService.addInvalid(entity, { field: 'LotNo', result: result });
				}
			});

			this.asyncValidateExpirationDate({ entity: entity, value: entity.ExpirationDate?? '', field: 'ExpirationDate' }).then((result) => {
				if (!result.valid) {
					this.dataService.addInvalid(entity, { field: 'ExpirationDate', result: result });
				}
			});

			this.asyncValidatePrcStockTransactionTypeFk({ entity: entity, value: entity.PrcStockTransactionTypeFk?? 0, field: 'PrcStockTransactionTypeFk' }, true).then((result) => {
				if (!result.valid) {
					this.dataService.addInvalid(entity, { field: 'ExpirationDate', result: result });
				}
			});
		}
		return;
	}

	private resetDiscountSplit(entity: IInv2ContractEntity) {
		if (entity.PrcItemFk) {
			if (entity.PrcItemQuantity !== 0 && entity.Quantity !== 0 && entity.PrcItemDiscountSplit !== 0) {
				entity.DiscountSplit = this.dataService.prcRoundingService.round(this.dataService.roundingType.DiscountSplit, math.bignumber(entity.PrcItemDiscountSplit).div(entity.PrcItemQuantity?? 0).mul(entity.Quantity));
				entity.DiscountSplitOc = this.dataService.prcRoundingService.round(this.dataService.roundingType.DiscountSplitOc, math.bignumber(entity.PrcItemDiscountSplitOc).div(entity.PrcItemQuantity?? 0).mul(entity.Quantity));
			} else {
				entity.DiscountSplit = 0;
				entity.DiscountSplitOc = 0;
			}
		}
	}

	private getParentExchangeRate() {
		let exchangeRate = 1;
		const invoiceHeader = this.parentService.getSelectedEntity();
		if (invoiceHeader?.ExchangeRate) {
			exchangeRate = invoiceHeader.ExchangeRate;
		}
		return exchangeRate;
	}

	private setFieldReadOnly(entity: IInv2ContractEntity, fields: string[], readOnly: boolean) {
		this.dataService.setEntityReadOnlyFields(entity, this.fieldsToReadonly(fields, readOnly));
	}

	private fieldsToReadonly(fields: string[], isRead: boolean): IReadOnlyField<IInv2ContractEntity>[] {
		return this.dataService.fieldsToReadonly(fields, isRead);
	}
}
