/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions } from '@libs/platform/data-access';
import { ProjectCostcodesPriceListForJobDataService } from './project-costcodes-price-list-for-job-data.service';
import { IEntity } from '../../model/interfaces/project-cost-codes-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class ProjectCostcodesPriceListRecordValidationService<T extends object> extends BaseValidationService<T> {
	protected override generateValidationFunctions(): IValidationFunctions<T> {
		throw new Error('Method not implemented.');
	}
	protected override getEntityRuntimeData(): IEntityRuntimeDataRegistry<T> {
		throw new Error('Method not implemented.');
	}

	private parentService = inject(ProjectCostcodesPriceListForJobDataService);

	public validateSelected(entity: IEntity, value: boolean) {
		entity.Selected = value;
		if (value === true) {
			if (entity.Weighting === 0) {
				entity.Weighting = 1; // if weighting is 0. set it to 1.
			}
		}
		//messengerService.PriceListRecordSelectedChanged.fire(null, {prjCostCodes: parentService.getSelected()});
	}

	public validateWeighting(entity: IEntity, value: boolean) {
		entity.Weighting = value ? 0 : 1;

		// messengerService.PriceListRecordWeightingChanged.fire(null, {prjCostCodes: parentService.getSelected()});
	}
}
