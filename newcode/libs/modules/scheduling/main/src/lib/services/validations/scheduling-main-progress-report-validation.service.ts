/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry,
	IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IActivityEntity, IActivityProgressReportEntity, ICalculationActivityEntity, ILineItemEntity } from '@libs/scheduling/interfaces';
import { SchedulingProgressReportDataService } from '../scheduling-progress-report-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { PlatformHttpService, PlatformDateService, PlatformLazyInjectorService } from '@libs/platform/common';
import { SchedulingMainLineItemProgressDataService } from '../scheduling-main-line-item-progress-data.service';
import { ActivityComplete } from '../../model/activity-complete.class';
import { SchedulingMainDataService } from '../scheduling-main-data.service';
import { ESTIMATE_LINE_ITEM_LOOKUP_PROVIDER_TOKEN } from '@libs/basics/interfaces';

/**
 * Scheduling Main Progress Report Validation Service
 */

@Injectable({
	providedIn: 'root'
})

export class SchedulingMainProgressReportValidationService extends BaseValidationService<IActivityProgressReportEntity> {

	private readonly basicsSharedDataValidationService = inject(BasicsSharedDataValidationService);
	private readonly http = inject(PlatformHttpService);
	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	private readonly schedulingMainService = inject(SchedulingMainDataService);
	private readonly schedulingMainProgressReportService = inject(SchedulingProgressReportDataService);
	private readonly platformDateService = inject(PlatformDateService);
	private readonly schedulingMainLineItemProgressService = inject(SchedulingMainLineItemProgressDataService);

	/**
	 * constructor
	 * @param dataService progressReportDataService
	 * @protected
	 */
	public constructor(protected dataService: SchedulingProgressReportDataService) {
		super();
	}

	/**
	 * generateValidationFunctions
	 * @protected
	 */
	protected generateValidationFunctions(): IValidationFunctions<IActivityProgressReportEntity> {
		return {
			PerformanceDate: [this.validatePerformanceDate],
			EstLineItemFk: [this.validateEstLineItemFk],
			Quantity: [this.asyncValidateQuantity],
			RemainingQuantity: [this.asyncValidateRemainingQuantity],
			PCo: [this.asyncValidatePCo],
			RemainingPCo: [this.asyncValidateRemainingPCo],
			Work: [this.asyncValidateWork],
			RemainingWork: [this.asyncValidateRemainingWork]
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IActivityProgressReportEntity> {
		return this.dataService;
	}

	private validatePerformanceDate (info: ValidationInfo<IActivityProgressReportEntity>) : ValidationResult {
		if (!info.value) {
			return this.validateIsMandatory(info);
		}

		const entities = this.dataService.getList();

		const isUnique = this.basicsSharedDataValidationService.isUniqueAndMandatory(info, entities);
		const date = info.value as Date !== null ? info.value : this.platformDateService.getUTC(info.value?.toString());

		if (date === null) {
			return new ValidationResult('scheduling.main.errors.noValidDate');
		}

		if (info.entity.EstLineItemFk === null || isUnique) {
			return isUnique;
		} else {
			entities.forEach(item => {
				if (item.EstLineItemFk === info.entity.EstLineItemFk && date === this.platformDateService.getUTC(
					item.PerformanceDate !== null ? item.PerformanceDate : '')) {
					return new ValidationResult('scheduling.main.errors.dueDateMustBeUnique');
				}
				return new ValidationResult();
			});
		}
		return new ValidationResult();
	}

	private async validateEstLineItemFk (info: ValidationInfo<IActivityProgressReportEntity>) : Promise<ValidationResult> {
		if (!info.value) {
			return this.validateIsMandatory(info);
		}

		const entities = this.dataService.getList();
		const valueDate = info.entity.PerformanceDate != null ? info.entity.PerformanceDate : '';
		const isUnique = this.basicsSharedDataValidationService.isUniqueAndMandatory(info, entities);
		const date = this.platformDateService.getUTC(valueDate);
		if (info.value === null || isUnique) {
			return isUnique;
		} else {
			const entity =  entities.find(item => item.EstLineItemFk === info.value &&
				date === this.platformDateService.getUTC(item.PerformanceDate?.toString()));
			if (entity !== null) {
				return new ValidationResult('scheduling.main.errors.dueDateMustBeUnique');
			}

			const estimateLineItemProvider = await this.lazyInjector.inject(ESTIMATE_LINE_ITEM_LOOKUP_PROVIDER_TOKEN);

			const item = estimateLineItemProvider.GetItemByKey({id: info.value as number}) as ILineItemEntity;

			if (item && item.QuantityTotal) {
				info.entity.PlannedQuantity = item.QuantityTotal;
			}
			const lineItems = this.schedulingMainLineItemProgressService.getList();
			const lineItem = lineItems.find(i => i.LineItemFk === info.value);
			if ( lineItem && lineItem.PCo){
				info.entity.PCo = lineItem.PCo;
				info.entity.RemainingPCo = 100 - lineItem.PCo;
			}
			return new ValidationResult();
		}
	}

	private asyncValidateQuantity (info: ValidationInfo<IActivityProgressReportEntity>) : Promise<ValidationResult>{
		return new Promise<ValidationResult>(resolve => {
			resolve(this.doValidateProgressReportChangeAsynchronously(info, {
				ProgressReportQuantity: info.value as number,
				RemainingActivityQuantity: info.entity.RemainingQuantity as number
			}));
		});
	}

	private asyncValidateRemainingQuantity (info: ValidationInfo<IActivityProgressReportEntity>) : Promise<ValidationResult>{
		return new Promise<ValidationResult>(resolve => {
			resolve(this.doValidateProgressReportChangeAsynchronously(info, {RemainingActivityQuantity: info.value as number}));
		});
	}

	private asyncValidatePCo (info: ValidationInfo<IActivityProgressReportEntity>) : Promise<ValidationResult>{
		return new Promise<ValidationResult>(resolve => {
			resolve(this.doValidateProgressReportChangeAsynchronously(info, {PercentageCompletion: info.value as number}));
		});
	}

	private asyncValidateRemainingPCo (info: ValidationInfo<IActivityProgressReportEntity>) : Promise<ValidationResult>{
		return new Promise<ValidationResult>(resolve => {
			resolve(this.doValidateProgressReportChangeAsynchronously(info, {PercentageRemaining: info.value as number}));
		});
	}

	private asyncValidateWork (info: ValidationInfo<IActivityProgressReportEntity>) : Promise<ValidationResult>{
		return new Promise<ValidationResult>(resolve => {
			resolve(this.doValidateProgressReportChangeAsynchronously(info, {DueDateWorkPerformance: info.value as number}));
		});
	}

	private asyncValidateRemainingWork (info: ValidationInfo<IActivityProgressReportEntity>) : Promise<ValidationResult>{
		return new Promise<ValidationResult>(resolve => {
			resolve(this.doValidateProgressReportChangeAsynchronously(info, {RemainingActivityWork: info.value as number}));
		});
	}

	private doValidateProgressReportChangeAsynchronously (info: ValidationInfo<IActivityProgressReportEntity>,  purpose: ICalculationActivityEntity) : ValidationResult {
		const entity = this.schedulingMainService.getSelectedEntity();

		const parameter = purpose;
      parameter.Id = entity?.Id;
		parameter.DueDate = info.entity.PerformanceDate;
		parameter.ProgressDescription = info.entity.Description;

		const completeActivity = {
			MainItemId: entity?.Id,
			Activities: [entity],
			ActivityPlanningChange: parameter,
			ProgressReportsToSave: this.schedulingMainProgressReportService.getList().filter((cand) => {
				return cand.EstLineItemFk === info.entity.EstLineItemFk && cand.PerformanceDate !== null && cand.PerformanceDate !== undefined &&
					cand.PerformanceDate.localeCompare(info.entity.PerformanceDate ? info.entity.PerformanceDate.toString() : '', 'seconds') >= 0;
			}),
			lineItemProgress: {}
		};

		if (info.entity.EstLineItemFk) {
			completeActivity.lineItemProgress = {
				LineItemFk: info.entity.EstLineItemFk,
				EstimationHeaderFk: info.entity.EstHeaderFk,
				Quantity: info.entity.PlannedQuantity,
				Work: info.entity.PlannedWork,
				UoMFk: info.entity.BasUomFk
			};
		}

		this.http.post$('scheduling/main/progressreport/validate', completeActivity
		).subscribe((response) => {
			this.schedulingMainService.calculateActivities(null, response as object);
			if ((response as ActivityComplete)?.LineItemProgress) {
				this.schedulingMainLineItemProgressService.takeOverNewValues((response as ActivityComplete)?.LineItemProgress);
			}
			this.schedulingMainProgressReportService.takeOverNewReports((response as ActivityComplete)?.ProgressReportsToSave);
			let activities: IActivityEntity[] | null = [];
			if (Array.isArray((response as ActivityComplete)?.Activities)) {
				activities = (response as ActivityComplete)?.Activities;
			} else if (!!(response as ActivityComplete)?.Activities && response) {
				activities = [response as IActivityEntity];
			}
			activities?.forEach((act) => {
				//TODO
				// schedulingMainService.markItemAsModified(act);
			});
			}
		);

		return new ValidationResult();
	}
}