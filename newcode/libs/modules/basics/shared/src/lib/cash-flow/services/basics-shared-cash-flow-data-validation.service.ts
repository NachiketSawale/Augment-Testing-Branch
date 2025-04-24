import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { inject } from '@angular/core';
import { BasicsSharedDataValidationService } from './../../services/basics-shared-data-validation.service';
import { ICashProjectionDetailEntity } from '../models/entities/cash-projection-detail-entity.interface';
import { BasicsSharedCashFlowDataService } from './basics-shared-cash-flow-data.service';
import { ILookupConfig, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { firstValueFrom } from 'rxjs';
import { isObject } from 'lodash';

export class BasicsSharedCashFlowDataValidationService<T extends ICashProjectionDetailEntity, PT extends { CashProjectionFk?: number }> extends BaseValidationService<T> {
	protected readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly LookupService = inject(UiCommonLookupDataFactoryService).fromLookupType('CashProjection', { uuid: 'c808e5aa07d64fe58384a426eec83d67', valueMember: '', displayMember: '' } as ILookupConfig<{ TotalCost: number }>);

	public constructor(private readonly dataService: BasicsSharedCashFlowDataService<T, PT>) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<T> {
		return {
			CumCost: async (info) => {
				const result = await this.validateCumCost(info);
				return this.convertToValidationResult(result);
			},
			PeriodCost: async (info) => {
				const result = await this.validatePeriodCost(info);
				return this.convertToValidationResult(result);
			},
			CumCash: async (info) => {
				const result = await this.validateCumCash(info);
				return this.convertToValidationResult(result);
			},
			PeriodCash: async (info) => {
				const result = await this.validatePeriodCash(info);
				return this.convertToValidationResult(result);
			},
		};
	}
	// Checks if the result already has a valid property - converting it to a ValidationResult 
	private convertToValidationResult(result: object): ValidationResult {
		if ('valid' in result) {
			return result as ValidationResult;
		}
		return { valid: true, ...result };
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<T> {
		return this.dataService;
	}

	private async validateCumCost(info: ValidationInfo<T>) {
		let isAmong;
		const value = info.value as number;
		const list = this.dataService.getList().sort((a, b) => {
			return a.PercentOfTime - b.PercentOfTime;
		});

		const parentItem = this.dataService.parentService.getSelectedEntity();

		if (!parentItem || !parentItem.CashProjectionFk) {
			return this.validationUtils.createErrorObject('CashProjectionFk not found.');
		}

		const currentCashProjection = await firstValueFrom(this.LookupService.getItemByKey({ id: parentItem.CashProjectionFk }));
		const totalCost = currentCashProjection.TotalCost;

		if (value > totalCost) {
			return this.validationUtils.createErrorObject('basics.common.updateCashFlowProjection.overValueErrorMessage');
		}

		if (list.length === 1) {
			info.entity.CumCost = value;
			info.entity.PeriodCost = value;
			return this.validationUtils.createSuccessObject();
		}

		const index = list.indexOf(info.entity);
		if (index === 0) {
			isAmong = this.isAmong(info, 0, list[index + 1].CumCost);
			if (isObject(isAmong)) {
				return isAmong;
			}
			this.calculateNextRecords(list, info, value);
		}
		if (index > 0 && index < list.length - 1) {
			isAmong = this.isAmong(info, list[index - 1].CumCost, list[index + 1].CumCost);
			if (isObject(isAmong)) {
				return isAmong;
			}
			this.calculateNextRecords(list, info, value);
		}
		if (index === list.length - 1) {
			isAmong = this.isAmong(info, list[index - 1].CumCost, totalCost);
			if (isObject(isAmong)) {
				return isAmong;
			}
			info.entity.CumCost = value;
			info.entity.PeriodCost = value - list[index - 1].CumCost;
		}

		return this.validationUtils.createSuccessObject();
	}

	private async validatePeriodCost(info: ValidationInfo<T>) {
		let isAmong;
		const value = info.value as number;
		const list = this.dataService.getList().sort((a, b) => {
			return a.PercentOfTime - b.PercentOfTime;
		});

		const parentItem = this.dataService.parentService.getSelectedEntity();

		if (!parentItem || !parentItem.CashProjectionFk) {
			return this.validationUtils.createErrorObject('CashProjectionFk not found.');
		}

		const currentCashProjection = await firstValueFrom(this.LookupService.getItemByKey({ id: parentItem.CashProjectionFk }));
		const totalCost = currentCashProjection.TotalCost;

		if (value > totalCost) {
			return this.validationUtils.createErrorObject('basics.common.updateCashFlowProjection.overValueErrorMessage');
		}

		if (list.length === 1) {
			info.entity.CumCost = value;
			info.entity.PeriodCost = value;
			return this.validationUtils.createSuccessObject();
		}

		const index = list.indexOf(info.entity);
		if (index === 0) {
			isAmong = this.isAmong(info, 0, list[index + 1].CumCost);
			if (isObject(isAmong)) {
				return isAmong;
			}
			info.entity.CumCost = value;
			info.entity.PeriodCost = value;
			list[0].CumCost = list[0].PeriodCost = value;
			for (let i = index + 1; i < list.length; i++) {
				list[i].PeriodCost = list[i].CumCost - list[i - 1].CumCost;
				this.dataService.setModified(list[i]);
			}
		}
		if (index > 0 && index < list.length - 1) {
			const maxValueOfPeriod = list[index + 1].CumCost - list[index - 1].CumCost;
			isAmong = this.isAmong(info, 0, maxValueOfPeriod);
			if (isObject(isAmong)) {
				return isAmong;
			}
			info.entity.PeriodCost = value;
			info.entity.CumCost = list[index - 1].CumCost + value;
			for (let i = index; i < list.length; i++) {
				list[i].PeriodCost = list[i].CumCost - list[i - 1].CumCost;
				this.dataService.setModified(list[i]);
			}
		}
		if (index === list.length - 1) {
			isAmong = this.isAmong(info, 0, totalCost - list[index - 1].CumCost);
			if (isObject(isAmong)) {
				return isAmong;
			}
			info.entity.PeriodCost = value;
			info.entity.CumCost = list[index - 1].CumCost + value;
		}

		return this.validationUtils.createSuccessObject();
	}

	private async validateCumCash(info: ValidationInfo<T>) {
		let isAmong;
		const value = info.value as number;
		const list = this.dataService.getList().sort((a, b) => {
			return a.PercentOfTime - b.PercentOfTime;
		});

		const parentItem = this.dataService.parentService.getSelectedEntity();

		if (!parentItem || !parentItem.CashProjectionFk) {
			return this.validationUtils.createErrorObject('CashProjectionFk not found.');
		}

		const currentCashProjection = await firstValueFrom(this.LookupService.getItemByKey({ id: parentItem.CashProjectionFk }));
		const totalCost = currentCashProjection.TotalCost;

		if (value > totalCost) {
			return this.validationUtils.createErrorObject('basics.common.updateCashFlowProjection.overValueErrorMessage');
		}

		if (list.length === 1) {
			info.entity.CumCost = value;
			info.entity.PeriodCost = value;
			return this.validationUtils.createSuccessObject();
		}

		const index = list.indexOf(info.entity);
		if (index === 0) {
			isAmong = this.isAmong(info, 0, list[index + 1].CumCash);
			if (isObject(isAmong)) {
				return isAmong;
			}
			info.entity.CumCash = value;
			info.entity.PeriodCash = value;
			for (let i = index + 1; i < list.length; i++) {
				list[i].PeriodCash = list[i].CumCash - list[i - 1].CumCash;
				this.dataService.setModified(list[i]);
			}
		}
		if (index > 0 && index < list.length - 1) {
			isAmong = this.isAmong(info, list[index - 1].CumCash, list[index + 1].CumCash);
			if (isObject(isAmong)) {
				return isAmong;
			}
			info.entity.CumCash = value;
			info.entity.PeriodCash = list[index].CumCash - list[index - 1].CumCash;
			for (let i = index + 1; i < list.length; i++) {
				list[i].PeriodCost = list[i].CumCost - list[i - 1].CumCost;
				this.dataService.setModified(list[i]);
			}
		}
		if (index === list.length - 1) {
			isAmong = this.isAmong(info, list[index - 1].CumCost, totalCost);
			if (isObject(isAmong)) {
				return isAmong;
			}
			info.entity.CumCash = value;
			info.entity.PeriodCash = list[index].CumCash - list[index - 1].CumCash;
			this.dataService.setModified(info.entity);
		}

		return this.validationUtils.createSuccessObject();
	}

	private async validatePeriodCash(info: ValidationInfo<T>) {
		let isAmong;
		const value = info.value as number;
		const list = this.dataService.getList().sort((a, b) => {
			return a.PercentOfTime - b.PercentOfTime;
		});

		const parentItem = this.dataService.parentService.getSelectedEntity();

		if (!parentItem || !parentItem.CashProjectionFk) {
			return this.validationUtils.createErrorObject('CashProjectionFk not found.');
		}

		const currentCashProjection = await firstValueFrom(this.LookupService.getItemByKey({ id: parentItem.CashProjectionFk }));
		const totalCost = currentCashProjection.TotalCost;

		if (value > totalCost) {
			return this.validationUtils.createErrorObject('basics.common.updateCashFlowProjection.overValueErrorMessage');
		}

		if (list.length === 1) {
			info.entity.CumCash = value;
			info.entity.PeriodCash = value;
			return this.validationUtils.createSuccessObject();
		}

		const index = list.indexOf(info.entity);
		if (index === 0) {
			const firstCash = list.find((item) => {
				return item.CumCash > 0;
			}) as T;
			const cashIndex = list.indexOf(firstCash);
			const nextCash = cashIndex === 0 ? list[cashIndex + 1] : firstCash;
			isAmong = this.isAmong(info, 0, nextCash.CumCash);
			if (isObject(isAmong)) {
				return isAmong;
			}
			info.entity.CumCash = value;
			info.entity.PeriodCash = value;

			for (let i = index + 1; i < list.length; i++) {
				if (i < cashIndex) {
					list[i].PeriodCash = value;
					list[i].CumCash = value;
					this.dataService.setModified(list[i]);
					continue;
				}
				list[i].PeriodCash = list[i].CumCash - list[i - 1].CumCash;
				this.dataService.setModified(list[i]);
			}
		}

		if (index > 0 && index < list.length - 1) {
			const maxValueOfPeriod = list[index + 1].CumCash - list[index - 1].CumCash;
			isAmong = this.isAmong(info, 0, maxValueOfPeriod);
			if (isObject(isAmong)) {
				return isAmong;
			}
			info.entity.PeriodCash = value;
			info.entity.CumCash = list[index - 1].CumCash + value;
			for (let i = index + 1; i < list.length; i++) {
				list[i].PeriodCash = list[i].CumCash - list[i - 1].CumCash;
				this.dataService.setModified(list[i]);
			}
		}

		if (index === list.length - 1) {
			isAmong = this.isAmong(info, 0, totalCost - list[index - 1].CumCash);
			if (isObject(isAmong)) {
				return isAmong;
			}
			info.entity.PeriodCash = value;
			info.entity.CumCash = list[index - 1].CumCash + value;
		}
		return this.validationUtils.createSuccessObject();
	}

	private calculateNextRecords(dataList: T[], info: ValidationInfo<T>, currentCumCost: number) {
		const index = dataList.indexOf(info.entity);

		if (index === 0) {
			dataList[0].CumCost = dataList[0].PeriodCost = currentCumCost;
			for (let i = index + 1; i < dataList.length; i++) {
				dataList[i].PeriodCost = dataList[i].CumCost - dataList[i - 1].CumCost;
			}
		}

		if (index > 0 && index < dataList.length - 1) {
			dataList[index].CumCost = currentCumCost;
			for (let i = index; i < dataList.length; i++) {
				dataList[i].PeriodCost = dataList[i].CumCost - dataList[i - 1].CumCost;
				this.dataService.setModified(dataList[i]);
			}
		}
	}

	private isAmong(info: ValidationInfo<T>, start: number, end: number) {
		if (info.value && ((info.value as number) < start || (info.value as number) > end)) {
			return this.validationUtils.createErrorObject({
				key: 'cloud.common.amongValueErrorMessage',
				params: {
					object: info.field.toLowerCase(),
					rang: start + '-' + end,
				},
			});
		}
		return null;
	}
}
