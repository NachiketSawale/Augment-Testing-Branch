/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { ControllingRevenueRecognitionItemDataService } from './revenue-recognition-item-data.service';
import { IPrrItemEntity } from '../model/entities/prr-item-entity.interface';
import { sumBy } from 'lodash';
import { ControllingRevenueRecognitionItemStaticType, ControllingRevenueRecognitionItemType } from '../model/enums/revenue-recognition-item.enum';

/**
 * ControllingRevenueRecognition Item validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ControllingRevenueRecognitionItemValidationService extends BaseValidationService<IPrrItemEntity> {
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly dataService = inject(ControllingRevenueRecognitionItemDataService);

	protected generateValidationFunctions(): IValidationFunctions<IPrrItemEntity> {
		return {
			AmountInc: this.validateAmountInc,
			AmountTotal: this.validateAmountTotal,
			Percentage: this.validatePercentage,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPrrItemEntity> {
		return this.dataService;
	}

	protected validateAmountInc(info: ValidationInfo<IPrrItemEntity>): ValidationResult {
		const amountInc = info.value as number;
		const entity = info.entity;
		entity.AmountInc = amountInc;
		this.updateAmountAndPercentage(entity);
		this.updateParentChain(entity);
		return this.validationUtils.createSuccessObject();
	}

	protected validateAmountTotal(info: ValidationInfo<IPrrItemEntity>): ValidationResult {
		const amountTotal = info.value as number;
		const entity = info.entity;
		entity.AmountTotal = amountTotal;
		entity.AmountInc = amountTotal - entity.AmountPervious;
		this.updatePercentage(entity);
		this.updateParentChain(entity);
		return this.validationUtils.createSuccessObject();
	}

	protected validatePercentage(info: ValidationInfo<IPrrItemEntity>) {
		const percentage = info.value as number;
		const entity = info.entity;
		entity.Percentage = percentage;
		entity.AmountInc = (percentage / 100) * (entity.AmountContract + entity.AmountContractCo) - entity.AmountPervious;
		this.updateParentChain(entity);
		return this.validationUtils.createSuccessObject();
	}

	private updateAmountAndPercentage(entity: IPrrItemEntity) {
		entity.AmountTotal = entity.AmountPervious + entity.AmountInc;
		this.updatePercentage(entity);
	}

	private updatePercentage(entity: IPrrItemEntity): void {
		entity.Percentage = entity.AmountContractTotal !== 0
			? (entity.AmountTotal / entity.AmountContractTotal) * 100
			: null;
	}

	private updateParentChain(entity: IPrrItemEntity, fromAccrual?: boolean) {
		const parentItem = this.dataService.getList().find(e => e.Id == entity.PrrItemParentId);
		if (parentItem) {
			if (parentItem.PrrItems && parentItem.PrrItems.length > 0) {
				parentItem.AmountInc = sumBy(parentItem.PrrItems, child => child.AmountInc);
				parentItem.AmountTotal = parentItem.AmountInc + parentItem.AmountPervious;
				parentItem.Percentage = (0 !== parentItem.AmountContractTotal) ? (parentItem.AmountTotal / parentItem.AmountContractTotal) * 100 : null;
				if (parentItem.ItemType === ControllingRevenueRecognitionItemType.GroupType && parentItem.StaticItemType === ControllingRevenueRecognitionItemStaticType.GroupType) {
					this.updateParentChain(parentItem);
				}
			}
			//change header recode,also recalculate child accrual too
			if (parentItem.ItemType === ControllingRevenueRecognitionItemType.HeaderType && !fromAccrual) {
				this.recalculateAccrual(entity);
			}
			//change accrual item,also recalculate parent too
			if (parentItem.ItemType === ControllingRevenueRecognitionItemType.Accruals) {
				this.updateParentChain(parentItem, true);
			}
		}
	}

	private recalculateAccrual(entity: IPrrItemEntity) {
		if (entity.PrrItems) {
			const excludeAccrualItem = entity.PrrItems.filter(item => {
				return item.StaticItemType !== ControllingRevenueRecognitionItemStaticType.PerformanceAccrual;
			});
			const subRecordExcludeAccrualTotal = sumBy(excludeAccrualItem, function (item) {
				return item.AmountInc;
			});
			const variant = entity.AmountInc - subRecordExcludeAccrualTotal;
			const accrual = entity.PrrItems.find(item => {
				return item.StaticItemType === ControllingRevenueRecognitionItemStaticType.PerformanceAccrual;
			});
			if (accrual && accrual.PrrItems?.length) {
				const findAccruals = accrual.PrrItems.filter(item => {
					return item.ItemType === ControllingRevenueRecognitionItemType.PerformanceAccrual;
				});
				this.setAccrualWeight(accrual, findAccruals);
				findAccruals.forEach(accrualItem => {
					accrualItem.AmountInc = variant * accrualItem.Weight;
					this.updateAmountAndPercentage(accrualItem);
				});
			}
		}
	}

	private setAccrualWeight(performanceAccrual: IPrrItemEntity, accruals: IPrrItemEntity[]) {
		const totalAccrual = performanceAccrual.AmountInc;
		if (totalAccrual > 0) {
			accruals.forEach(accrualItem => {
				accrualItem.Weight = accrualItem.AmountInc / totalAccrual;
			});
		} else {
			const count = accruals.length;
			accruals.forEach(accrualItem => {
				accrualItem.Weight = 1 / count;
			});
		}
	}

}
