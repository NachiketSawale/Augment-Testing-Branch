/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IInvOtherEntity } from '../model';
import { ProcurementBaseValidationService } from '@libs/procurement/shared';
import { IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { BasicsShareControllingUnitLookupService, BasicsSharedCompanyContextService, BasicsSharedProcurementStructureLookupService, IProcurementStructureLookupEntity } from '@libs/basics/shared';
import { ProcurementInvoiceOtherDataService } from './procurement-invoice-other-data.service';
import { firstValueFrom } from 'rxjs';
import { IPrcStructureTaxEntity } from '@libs/basics/interfaces';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';
import { ProcurementCommonCalculationService } from '@libs/procurement/common';
import { bignumber } from 'mathjs';



@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceOtherValidationService extends ProcurementBaseValidationService<IInvOtherEntity> {
	private readonly companyContext = inject(BasicsSharedCompanyContextService);
	private readonly itemCalculationHelper = inject(ProcurementCommonCalculationService);
	private readonly basicsSharedProcurementStructureLookupService = inject(BasicsSharedProcurementStructureLookupService);
	private readonly basicsShareControllingUnitLookupService = inject(BasicsShareControllingUnitLookupService);

	protected constructor(protected dataService: ProcurementInvoiceOtherDataService, protected headDataService: ProcurementInvoiceHeaderDataService) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<IInvOtherEntity> {
		return {
			Quantity: this.validateQuantity,
			ControllingUnitFk: this.validateControllingUnitFk,
			PrcStructureFk: this.validatePrcStructureFk,
			AmountNet: this.validateAmountNet,
			AmountNetOc: this.validateAmountNetOc,
			AmountGross: this.validateAmountGross,
			AmountGrossOc: this.validateAmountGrossOc,
			AmountTotal: this.validateAmountTotal,
			AmountTotalOc: this.validateAmountTotalOc,
			AmountTotalGross: this.validateAmountTotalGross,
			AmountTotalGrossOc: this.validateAmountTotalGrossOc,
			TaxCodeFk: this.validateTaxCodeFk,
			IsAssetManagement: this.validateIsAssetManagement,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IInvOtherEntity> {
		return this.dataService;
	}

	protected async validateQuantity(info: ValidationInfo<IInvOtherEntity>) {
		this.dataService.calculateGrossAndTotalValues(info.entity);
		this.dataService.recalculateOther();
		return this.validationUtils.createSuccessObject();
	}

	protected async validateControllingUnitFk(info: ValidationInfo<IInvOtherEntity>) {
		if (!info.value) {
			return this.validationUtils.createErrorObject({
				key: 'cloud.common.emptyOrNullValueErrorMessage',
				params: {fieldName: 'procurement.invoice.EntityMdcControllingUnitFk'}
			});
		}
		const controllingUnit = await firstValueFrom(this.basicsShareControllingUnitLookupService.getItemByKey({id: info.value as number}));
		if (controllingUnit) {
			if (!controllingUnit.Isaccountingelement) {
				this.dataService.dataProcessor.processItem(info.entity, 'IsAssetManagement', !controllingUnit.Isaccountingelement);
			}
		}
		const isValidationControllingUnit = await this.http.get<boolean>('controlling/structure/validationControllingUnit?ControllingUnitFk', {
			params: {
				ControllingUnitFk: info.value as number,
				ProjectFk: (this.headDataService.getSelectedEntity()?.ProjectFk as number || 0),
			}
		});
		if (isValidationControllingUnit) {
			return this.validationUtils.createErrorObject({
				key: 'cloud.common.controllingUnitError'
			});
		}
		await this.dataService.refreshAccountInfo([info.entity]);
		return this.validationUtils.createSuccessObject();
	}

	protected async validateAmountNet(info: ValidationInfo<IInvOtherEntity>) {
		return this.validatePriceField(info);
	}

	protected async validateAmountNetOc(info: ValidationInfo<IInvOtherEntity>) {
		return this.validatePriceField(info);
	}

	protected async validateAmountGross(info: ValidationInfo<IInvOtherEntity>) {
		return this.validatePriceField(info);
	}

	protected async validateAmountGrossOc(info: ValidationInfo<IInvOtherEntity>) {
		return this.validatePriceField(info);
	}


	protected async validateAmountTotal(info: ValidationInfo<IInvOtherEntity>) {
		return this.validateAndCalculateEntityValues(info, info.value as number, false, 'AmountTotalOc');
	}

	protected async validateAmountTotalOc(info: ValidationInfo<IInvOtherEntity>) {
		return this.validateAndCalculateEntityValues(info, info.value as number, false, 'AmountTotal');
	}

	protected async validateAmountTotalGross(info: ValidationInfo<IInvOtherEntity>) {
		return this.validateAndCalculateEntityValues(info, info.value as number, true, 'AmountTotalGrossOc');
	}

	protected async validateAmountTotalGrossOc(info: ValidationInfo<IInvOtherEntity>) {
		return this.validateAndCalculateEntityValues(info, info.value as number, true, 'AmountTotalGross');
	}

	protected async validateTaxCodeFk(info: ValidationInfo<IInvOtherEntity>) {
		this.dataService.calculateItemValuesAfterTaxChange(info.entity);
		this.dataService.recalculateOther();
		await this.dataService.refreshAccountInfo([info.entity]);
		return this.validationUtils.createSuccessObject();
	}

	protected async validateIsAssetManagement(info: ValidationInfo<IInvOtherEntity>) {
		if (info.value as boolean === false) {
			info.entity.FixedAssetFk = null;
		}
		this.dataService.dataProcessor.processItem(info.entity, 'FixedAssetFk', !info.value);
		await this.dataService.refreshAccountInfo([info.entity]);
		return this.validationUtils.createSuccessObject();
	}

	protected async validatePrcStructureFk(info: ValidationInfo<IInvOtherEntity>) {
		if (!info.value) {
			return this.validationUtils.createErrorObject({
				key: 'cloud.common.emptyOrNullValueErrorMessage',
				params: {fieldName: 'cloud.common.entityStructure'}
			});
		}

		const isPostingNarrativeEnabled = await this.http.get<boolean>('basics/common/systemoption/ispostingnarrativefrominvHeader');
		const structureList = await firstValueFrom(this.basicsSharedProcurementStructureLookupService.getList());
		const taxCodeFk = await this.http.get<number | null | undefined>('basics/procurementstructure/taxcode/getTaxCodeByStructure', {params: {structureId: info.value as number}});
		const prcStructureTaxData = await this.http.get<IPrcStructureTaxEntity[]>('basics/procurementstructure/taxcode/getPrcStructureTax', {params: {structureId: info.value as number}});
		if ((info.entity?.Version || 0) > 0 && taxCodeFk && structureList) {
			info.entity.TaxCodeFk = taxCodeFk;
			await this.validateTaxCodeFk(info);
			const foundStructure: IProcurementStructureLookupEntity[] = [];
			this.findInStructureDataHierarchy(structureList, info.value as number, foundStructure);

			if (foundStructure.length > 0) {
				info.entity.Description = isPostingNarrativeEnabled ? this.headDataService.getSelectedEntity()?.Description : foundStructure [0].DescriptionInfo.Translated || info.entity.Description;
			}
			this.dataService.setModified(info.entity);
		}
		await this.dataService.refreshAccountInfo();

		if (prcStructureTaxData?.length > 0) {
			const applicableTax = prcStructureTaxData.find(e => e.MdcLedgerContextFk === this.companyContext.loginCompanyEntity.LedgerContextFk);
			if (applicableTax) {
				info.entity.MdcSalesTaxGroupFk = applicableTax.MdcSalesTaxGroupFk;
			}
		}
		return this.validationUtils.createSuccessObject();
	}

	private async validateAndCalculateEntityValues(info: ValidationInfo<IInvOtherEntity>, value: number, isGross: boolean, amountTotalKey: string) {
		if (value > 0 && info.entity.Quantity <= 0) {
			return this.validationUtils.createErrorObject({
				key: 'procurement.invoice.quantityMorThanZero'
			});
		}

		this.dataService.calculateBaseValues(info.entity);
		const vatPercent = this.dataService.cachedVatPercent;
		//const exchangeRate = this.dataService.cachedExchangeRate;
		if (amountTotalKey in info.entity) {
			//info.entity[amountTotalKey] = this.itemCalculationHelper.getHomeValueByOcValue(value, exchangeRate);
		}

		if (isGross) {
			this.recalculateAmountUnitGrossByTotalGross(info.entity);
			this.recalculateAmountUnitByUnitGross(info.entity, vatPercent);
			this.recalculateAmountTotalByAmountTotalGross(info.entity, vatPercent);
		} else {
			this.recalculateAmountUnitByAmountTotal(info.entity);
			this.recalculateAmountUnitGrossByAmountUnit(info.entity, vatPercent);
			this.recalculateAmountUnitTotalGrossByAmountTotal(info.entity, vatPercent);
		}

		this.dataService.recalculateOther();
		return this.validationUtils.createSuccessObject();
	}

	//  doGetStructureData rename findInStructureDataHierarchy
	private findInStructureDataHierarchy(structureData: IProcurementStructureLookupEntity[], Id: number, structureTemp: IProcurementStructureLookupEntity[]): void {
		const item = structureData.find(item => item.Id === Id);
		if (item) {
			structureTemp.push(item);
		}
		if (structureData && structureData.length > 0) {
			for (const item of structureData) {
				if (item.ChildItems) {
					this.findInStructureDataHierarchy(item.ChildItems, Id, structureTemp);
				}
			}
		}
	}

	//setAmountNetAmountNetOcAndItsGross  rename calculateAndSetItemPrices
	private calculateAndSetItemPrices(entity: IInvOtherEntity, value: number, model: string): void {
		this.dataService.calculateBaseValues(entity);
		const vatPercent = this.dataService.cachedVatPercent;
		const exchangeRate = this.dataService.cachedExchangeRate;
		switch (model) {
			case 'AmountNet': {
				entity.AmountNet = value;
				entity.AmountNetOc = this.itemCalculationHelper.getHomeValueByOcValue(value, exchangeRate);
				entity.AmountGross = this.itemCalculationHelper.getAfterTaxValueByPreTaxValue(value, vatPercent);
				entity.AmountGrossOc = this.itemCalculationHelper.getAfterTaxValueByPreTaxValue(entity.AmountNetOc, vatPercent);
				break;
			}
			case 'AmountNetOc': {
				entity.AmountNetOc = value;
				entity.AmountNet = this.itemCalculationHelper.getHomeValueByOcValue(value, exchangeRate);
				entity.AmountGrossOc = this.itemCalculationHelper.getAfterTaxValueByPreTaxValue(value, vatPercent);
				entity.AmountGross = this.itemCalculationHelper.getAfterTaxValueByPreTaxValue(entity.AmountNet, vatPercent);
				break;
			}
			case 'AmountGross': {
				entity.AmountGross = value;
				entity.AmountGrossOc = this.itemCalculationHelper.getHomeValueByOcValue(value, exchangeRate);
				entity.AmountNet = this.itemCalculationHelper.getAfterTaxValueByPreTaxValue(value, vatPercent);
				entity.AmountNetOc = this.itemCalculationHelper.getAfterTaxValueByPreTaxValue(entity.AmountGrossOc, vatPercent);
				break;
			}
			case 'AmountGrossOc': {
				entity.AmountGrossOc = value;
				entity.AmountGross = this.itemCalculationHelper.getHomeValueByOcValue(value, exchangeRate);
				entity.AmountNetOc = this.itemCalculationHelper.getAfterTaxValueByPreTaxValue(value, vatPercent);
				entity.AmountNet = this.itemCalculationHelper.getAfterTaxValueByPreTaxValue(entity.AmountGross, vatPercent);
				break;
			}
			default: {
				break;
			}
		}
	}

	private recalculateAmountUnitByAmountTotal(entity: IInvOtherEntity) {
		entity.AmountNet = this.itemCalculationHelper.roundTo(bignumber(entity.AmountTotal).div(entity.Quantity));
		entity.AmountNetOc = this.itemCalculationHelper.roundTo(bignumber(entity.AmountTotalOc).div(entity.Quantity));
	}

	private recalculateAmountUnitGrossByTotalGross(entity: IInvOtherEntity) {
		entity.AmountGross = this.itemCalculationHelper.roundTo(bignumber(entity.AmountTotalGross).div(entity.Quantity));
		entity.AmountGrossOc = this.itemCalculationHelper.roundTo(bignumber(entity.AmountTotalGrossOc).div(entity.Quantity));
	}

	private recalculateAmountUnitGrossByAmountUnit(entity: IInvOtherEntity, vatPercent: number) {
		entity.AmountGross = this.itemCalculationHelper.getAfterTaxValueByPreTaxValue(entity.AmountNet, vatPercent);
		entity.AmountGrossOc = this.itemCalculationHelper.getAfterTaxValueByPreTaxValue(entity.AmountGross, vatPercent);
	}

	private recalculateAmountUnitByUnitGross(entity: IInvOtherEntity, vatPercent: number) {
		entity.AmountNet = this.itemCalculationHelper.getAfterTaxValueByPreTaxValue(entity.AmountGross, vatPercent);
		entity.AmountNetOc = this.itemCalculationHelper.getAfterTaxValueByPreTaxValue(entity.AmountNet, vatPercent);
	}

	private recalculateAmountUnitTotalGrossByAmountTotal(entity: IInvOtherEntity, vatPercent: number) {
		entity.AmountTotalGross = this.itemCalculationHelper.getAfterTaxValueByPreTaxValue(entity.AmountTotal, vatPercent);
		entity.AmountTotalGrossOc = this.itemCalculationHelper.getAfterTaxValueByPreTaxValue(entity.AmountTotalOc, vatPercent);
	}

	private recalculateAmountTotalByAmountTotalGross(entity: IInvOtherEntity, vatPercent: number) {
		entity.AmountTotal = this.itemCalculationHelper.getAfterTaxValueByPreTaxValue(entity.AmountTotalGross, vatPercent);
		entity.AmountTotalOc = this.itemCalculationHelper.getAfterTaxValueByPreTaxValue(entity.AmountTotalGrossOc, vatPercent);
	}

	private validatePriceField(info: ValidationInfo<IInvOtherEntity>) {
		this.calculateAndSetItemPrices(info.entity, info.value as number, info.field);
		this.dataService.calculateGrossAndTotalValues(info.entity);
		this.dataService.recalculateOther();
		return this.validationUtils.createSuccessObject();
	}

}
