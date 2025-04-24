/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { ICostCodeEntity } from '../../model/models';
import { IEntityProcessor, IReadOnlyField } from '@libs/platform/data-access';
import { BasicsCostCodesDataService } from '../data-service/basics-cost-codes-data.service';

@Injectable({
	providedIn: 'root'
})
export class BasicsCostcodesHourfactorReadonlyProcessorService<T extends ICostCodeEntity> implements IEntityProcessor<T> {
	private DataService: BasicsCostCodesDataService = inject(BasicsCostCodesDataService);

	public process(item: T): void {
		this.setHourfactorReadonly(item, !item.IsLabour);
		this.processIsProjectChildAllowed(item);
	}
	public revertProcess(toProcess: T): void {} // TODO

	public setHourfactorReadonly(item: ICostCodeEntity, flag: boolean) {
		const fieldName = Object.prototype.hasOwnProperty.call(item, 'FactorHour') ? 'FactorHour' : 'HourFactor';
		const readonlyFields: IReadOnlyField<ICostCodeEntity>[] = [{ field: fieldName, readOnly: flag }];
		this.DataService.setEntityReadOnlyFields(item, readonlyFields);
	}

	public processIsEditable() {}

	public processIsProjectChildAllowed(item: ICostCodeEntity) {
		if (!item) {
			return;
		}

		const readOnly = item && !item.CostCodeParentFk;
		const readonlyFields: IReadOnlyField<ICostCodeEntity>[] = [{ field: 'IsProjectChildAllowed', readOnly: !readOnly }];
		this.DataService.setEntityReadOnlyFields(item, readonlyFields);
	}
}
