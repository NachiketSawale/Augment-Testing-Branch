/*
 * Copyright(c) RIB Software GmbH
 */
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo,
	ValidationResult
} from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { ILogisticCardWorkEntity } from '@libs/logistic/interfaces';
import { LogisticCardWorkDataService } from './logistic-card-work-data.service';

@Injectable({
	providedIn: 'root'
})
export class LogisticCardWorkValidationService extends BaseValidationService<ILogisticCardWorkEntity>{
	private logisticCardWorkDataService = inject(LogisticCardWorkDataService);

	protected override getMissingTimeSpanInfo = (info: ValidationInfo<ILogisticCardWorkEntity>) : ValidationInfo<ILogisticCardWorkEntity> | undefined => {
		switch (info.field) {
			case 'WorkStart':
				return new ValidationInfo(info.entity, info.entity.WorkEnd ?? undefined, 'WorkEnd');
			case 'WorkEnd':
				return new ValidationInfo(info.entity, info.entity.WorkStart ?? undefined, 'WorkStart');
			default:
				return new ValidationInfo(info.entity, info.value, info.field);
		}
	};
	protected override getLoadedEntitiesForUniqueComparison = (info: ValidationInfo<ILogisticCardWorkEntity>): ILogisticCardWorkEntity[] => {
		const itemList = this.logisticCardWorkDataService.getList();
		const res = itemList.filter(item => {
			return (item as never)[info.field] === info.value && item.Id !== info.entity.Id;
		});

		return res;
	};

	protected generateValidationFunctions(): IValidationFunctions<ILogisticCardWorkEntity> {
		return {
			Code: [this.validateIsMandatory,this.validateIsUnique],

		};
	}

	private validateWorkStart(info: ValidationInfo<ILogisticCardWorkEntity> ): ValidationResult {
		// TODO:
	   // calendarUtilitiesService.assertSameDate(value, entity.WorkEnd);
		return this.validateIsValidTimeSpanFrom(info);
	}

	private validateWorkEnd(info: ValidationInfo<ILogisticCardWorkEntity>): ValidationResult {
		// TODO:
		// calendarUtilitiesService.assertSameDate(value, entity.WorkStart);
		return this.validateIsValidTimeSpanFrom(info);
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ILogisticCardWorkEntity> {
		return this.logisticCardWorkDataService;
	}
}