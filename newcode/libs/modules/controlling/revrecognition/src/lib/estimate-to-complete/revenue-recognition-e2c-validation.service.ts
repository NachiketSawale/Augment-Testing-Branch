/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { ControllingRevenueRecognitionItemE2cDataService } from './revenue-recognition-e2c-data.service';
import { IPrrItemE2cEntity } from '../model/entities/prr-item-e2c-entity.interface';
import { sumBy } from 'lodash';

/**
 * ControllingRevenueRecognition Item E2c validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ControllingRevenueRecognitionItemE2cValidationService extends BaseValidationService<IPrrItemE2cEntity> {
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly dataService = inject(ControllingRevenueRecognitionItemE2cDataService);

	protected generateValidationFunctions(): IValidationFunctions<IPrrItemE2cEntity> {
		return {
			TotalCost: this.validateTotalCost
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPrrItemE2cEntity> {
		return this.dataService;
	}

	protected validateTotalCost(info: ValidationInfo<IPrrItemE2cEntity>): ValidationResult {
		const totalCost = info.value as number;
		const entity = info.entity;
		entity.TotalCost = totalCost;
		this.calculateItem(entity);
		if (entity.ParentId) {
			this.updateParentChain(entity);
		}
		return this.validationUtils.createSuccessObject();
	}

	private calculateTotalCost(parentItem: IPrrItemE2cEntity): number {
		return sumBy(parentItem.PrrItemE2cChildren, child => child.TotalCost);
	}

	private updateParentChain(item: IPrrItemE2cEntity) {
		const parentItem = this.dataService.getList().find(e => e.Id == item.ParentId);
		if (parentItem) {
			parentItem.TotalCost = this.calculateTotalCost(parentItem);
			this.calculateItem(parentItem);
			if (parentItem.ParentId) {
				this.updateParentChain(parentItem);
			}
		}
	}

	private calculateItem(item: IPrrItemE2cEntity) {
		if (item.TotalCost > 0) {
			item.ActualCostPercent = item.ActualCost / item.TotalCost * 100;
		}
		item.CalculatedRevenue = (item.ActualCost / item.TotalCost) * item.ContractedValue;
		item.RevenueAccrual = item.CalculatedRevenue - item.ActualRevenue;
		if (item.ContractedValue > 0) {
			item.RevenueAccrualPercent = item.RevenueAccrual / item.ContractedValue * 100;
		}
		item.RevenueToComplete = item.TotalCost - item.ActualCost;
		item.CalculatedRevenuePercent = item.ActualCostPercent;
	}

}
