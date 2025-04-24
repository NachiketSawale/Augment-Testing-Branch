/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityProcessor, IReadOnlyField } from '@libs/platform/data-access';
import { ICostCodeEntity, ICostCodesUsedCompanyEntity } from '../../model/models';
import { BasicsCostCodesDataService } from '../data-service/basics-cost-codes-data.service';

/**
 * Basics Cost Codes Comapny Process Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsCostcodesComapnyProcessService<T extends ICostCodesUsedCompanyEntity> implements IEntityProcessor<T> {
	private basicsCostCodesMainService = inject(BasicsCostCodesDataService);

	public process(item: ICostCodesUsedCompanyEntity): void {
    this.processItem(item);
  }

	public processItem(item: ICostCodesUsedCompanyEntity) {
		let contextFk: number | null = null;
		contextFk = contextFk ?? this.getContextId();

		if (item && item.MdcContextFk !== contextFk) {
			const readonlyFields: IReadOnlyField<ICostCodesUsedCompanyEntity>[] = [{ field: 'IsChecked', readOnly: true }];

			this.basicsCostCodesMainService.setEntityReadOnlyFields(item as ICostCodeEntity, readonlyFields);
		}
	}

	public revertProcess(toProcess: T): void {
		throw new Error('Method not implemented.');
	}

	public getContextId() {
		const ccItem = this.basicsCostCodesMainService.getSelection()[0];
		return ccItem ? ccItem.ContextFk : null;
	}
}
