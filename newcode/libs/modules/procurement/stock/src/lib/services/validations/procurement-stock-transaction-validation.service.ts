/*
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { IStockTransactionEntity } from '../../model/entities/stock-transaction-entity.interface';
import { ProcurementStockTransactionDataService } from '../procurement-stock-transaction-data.service';
import { LookupSearchRequest } from '@libs/ui/common';
import { firstValueFrom } from 'rxjs';
import { ProcurementProjectStockMaterialLookupService } from '../lookups/project-stock-material-lookup.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { ProcurementStockTransactionType } from '@libs/procurement/common';
import { PlatformTranslateService } from '@libs/platform/common';
import { ProjectStockLookupService } from '@libs/procurement/shared';

/**
 * procurement stock transaction validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementStockTransactionValidationService extends BaseValidationService<IStockTransactionEntity> {
	private readonly dataService = inject(ProcurementStockTransactionDataService);
	private readonly prjStokMaterialLookup = inject(ProcurementProjectStockMaterialLookupService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly translationService = inject(PlatformTranslateService);
	private readonly projectStockLookupService = inject(ProjectStockLookupService);

	protected generateValidationFunctions(): IValidationFunctions<IStockTransactionEntity> {
		return {
			ExpirationDate: this.validateExpirationDate,
			PrcStocktransactionFk: this.validatePrcStockTransactionFk,
			ProvisionPercent: this.validateProvisionPercent,
			Total: this.validateTotal,
			Quantity: this.validateQuantity,
			PrcStocktransactiontypeFk: this.validatePrcStockTransactiontypeFk,
			Lotno: this.validateLotno,
			PrjStocklocationFk: this.validatePrjStockLocationFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IStockTransactionEntity> {
		return this.dataService;
	}

	protected async validatePrjStockLocationFk(info: ValidationInfo<IStockTransactionEntity>){
		const entity = info.entity;
		const prjStockEntity = await firstValueFrom(this.projectStockLookupService.getItemByKey({ id: entity.PrjStockFk }));
		if (prjStockEntity?.IsLocationMandatory) {
			return this.validateIsMandatory(info);
		}
		return this.validationUtils.createSuccessObject();
	}

	protected async validateLotno(info: ValidationInfo<IStockTransactionEntity>){
		const entity = info.entity;
		const isLotManagement = await this.isLotManagement(entity);
		if(isLotManagement){
			return this.validateIsMandatory(info);
		}
		return this.validationUtils.createSuccessObject();
	}

	protected async validatePrcStockTransactiontypeFk(info: ValidationInfo<IStockTransactionEntity>){
		const entity = info.entity;
		const value = info.value as number;
		const transType = this.dataService.transactionTypeLookupService.cache.getItem({ id: entity.PrcStocktransactiontypeFk });
		if(transType){
			this.dataService.readonlyProcessor.process(entity);
			if(transType.IsReceipt){
				await this.setProvisionPercent(entity);
			}
			if (transType.IsConsumed) {
				entity.PrjStocklocationFk = null;

			} else {
				const validationInfo = new ValidationInfo(entity, entity.PrjStocklocationFk?? undefined, 'PrjStocklocationFk');
				const resultInfo = await this.validatePrjStockLocationFk(validationInfo);
				this.applyValidationResult(resultInfo, entity, 'PrjStocklocationFk');
			}
		}
		if(value !== 0){
			entity.PrcStocktransactiontypeFk = value;
		}

		const validationInfo = new ValidationInfo(entity, entity.PrcStocktransactionFk?? undefined, 'PrcStocktransactionFk');
		const validateResult  = await this.validatePrcStockTransactionFk(validationInfo);
		this.applyValidationResult(validateResult, entity, 'PrcStocktransactionFk');

		return this.validateIsMandatory(info);
	}

	protected async validateQuantity(info: ValidationInfo<IStockTransactionEntity>) {
		return this.processTransaction(info, 'Quantity');
	}

	protected async validateTotal(info: ValidationInfo<IStockTransactionEntity>) {
		return this.processTransaction(info, 'Total');
	}

	protected async validateProvisionPercent(info: ValidationInfo<IStockTransactionEntity>) {
		return this.processTransaction(info, 'ProvisionPercent');
	}

	protected validatePrcStockTransactionFk(info: ValidationInfo<IStockTransactionEntity>){
		const entity = info.entity;
		const result = { apply: true, valid: true, error: '' };
		const value = info.value as number;
		if(!value){
			const transType = this.dataService.transactionTypeLookupService.cache.getItem({id:entity.PrcStocktransactiontypeFk});
			if(entity.PrcStocktransactiontypeFk === ProcurementStockTransactionType.IncidentalAcquisitionExpense || (transType?.IsDelta)){
				result.valid = false;
				const modelTr = this.translationService.instant('procurement.common.entityPrcStockTransaction').text;
				result.error = this.translationService.instant('cloud.common.emptyOrNullValueErrorMessage', { object: modelTr }).text;
			}
		}
		return result;
	}


	protected async validateExpirationDate(info: ValidationInfo<IStockTransactionEntity>) {
		const entity = info.entity;
		const isLotManagement = await this.isLotManagement(entity);
		if(isLotManagement){
			const validateRes = this.validateIsMandatory(info);
			if (!validateRes.valid) {
				return validateRes;
			}
		}
		return this.validationUtils.createSuccessObject();
	}

	private async processTransaction(info: ValidationInfo<IStockTransactionEntity>, field: 'Total' | 'ProvisionPercent' | 'Quantity') {
		const { entity, value } = info;
		const transType = this.dataService.transactionTypeLookupService.cache.getItem({ id: entity.PrcStocktransactiontypeFk });

		if (transType?.IsReceipt) {
			entity[field] = value as number;
			await this.setProvisionPercent(entity);
			return this.validationUtils.createSuccessObject();
		}

		return this.validateIsMandatory(info);
	}

	private async setProvisionPercent(entity: IStockTransactionEntity) {
		const result = await this.getPrjStockMaterial(entity);
		const stockMaterial = result?.items?.[0];
		if (stockMaterial) {
			entity.ProvisionPercent = stockMaterial.ProvisionPercent;
			entity.ProvisionTotal = entity.Quantity * stockMaterial.ProvisionPeruom + (entity.ProvisionPercent / 100) * entity.Total;
		}
	}

	private async isLotManagement(entity: IStockTransactionEntity) {
		const result = await this.getPrjStockMaterial(entity);
		return result?.items?.[0]?.IsLotManagement ?? false;
	}

	private async getPrjStockMaterial(entity: IStockTransactionEntity) {
		const searchRequest = new LookupSearchRequest('', []);
		searchRequest.additionalParameters = { ProjectStockFk: entity.PrjStockFk, MaterialFk: entity.MdcMaterialFk };

		const result = await firstValueFrom(this.prjStokMaterialLookup.getSearchList(searchRequest));
		return result;
	}

	private applyValidationResult(result: ValidationResult, entity: IStockTransactionEntity, field: string) {
		if (result.valid) {
			this.dataService.removeInvalid(entity, { result, field });
		} else {
			this.dataService.addInvalid(entity, { result, field });
		}
	}
}
