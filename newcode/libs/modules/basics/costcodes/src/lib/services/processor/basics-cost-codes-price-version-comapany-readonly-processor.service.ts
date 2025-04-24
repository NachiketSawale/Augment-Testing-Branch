/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEntityProcessor, IReadOnlyField } from '@libs/platform/data-access';
import { ICostCodeCompanyEntity } from '../../model/models';

import { BasicsCostCodesPriceVersionDataService } from '../data-service/basics-cost-codes-price-version-data.service';

@Injectable({
	providedIn: 'root'
})
export class BasicsCostCodesPriceVersionComapanyReadonlyProcessorService<T extends ICostCodeCompanyEntity> implements IEntityProcessor<T> {
	private headerDataService: BasicsCostCodesPriceVersionDataService = inject(BasicsCostCodesPriceVersionDataService);
	public process(item: T): void {
		this.handlerItemReadOnlyStatus(item);
		this.getCellEditable(item, item.IsChecked ?? false); 
	}
	public revertProcess(toProcess: T): void {}

	public handlerItemReadOnlyStatus(item: ICostCodeCompanyEntity): boolean {
		let readOnyStatus = false;
		const header = this.headerDataService.getSelection()[0];

		if (header) {
			readOnyStatus = header.ContextFk !== item.MdcContextFk;
		}

		const readonlyFields: IReadOnlyField<ICostCodeCompanyEntity>[] = [{ field: 'ContextFk', readOnly: readOnyStatus }];
		this.headerDataService.setEntityReadOnlyFields(item, readonlyFields);
		return readOnyStatus;
	}

	public getCellEditable(item: ICostCodeCompanyEntity, model: string | boolean): boolean {
		let editable = true;
		if (item !== undefined) {
			if (model === 'IsChecked') {
				const header = this.headerDataService.getSelection()[0];
				if (header) {
					editable = header.ContextFk === item.MdcContextFk;
				}
			}
		}
		return editable;
	}
}
