/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { PrjCostCodesEntity } from '@libs/project/interfaces';
import { IEntityProcessor } from '@libs/platform/data-access';
//import { ProjectCostcodesPriceListForJobDataService } from './project-costcodes-price-list-for-job-data.service';

@Injectable({
	providedIn: 'root',
})
export class ProjectCostcodePriceListForJobProcessorService<T extends PrjCostCodesEntity> implements IEntityProcessor<T> {
	//private dataservice =inject(ProjectCostcodesPriceListForJobDataService)
	public process(resource: PrjCostCodesEntity): void {
		if (!resource.LgmJobFk) {
			//resource.cssClass ='row-readonly-background';
		}
	}
	public revertProcess(toProcess: T): void {}

	public readonly(items: PrjCostCodesEntity[], isReadOnly: boolean) {
		//const fields= any:[];
		const item = Array.isArray(items) ? items[0] : null;
		for (const key in item) {
			if (Object.prototype.hasOwnProperty.call(item, key)) {
				//const field = { field: key, readonly: isReadOnly};
				//fields.push(field);
			}
		}

		items.forEach((resItem) => {
			if (resItem && resItem.Id) {
				//platformRuntimeDataService.readonly(resItem, fields);
				//this.dataservice.setEntityReadOnlyFields(resItem, fields);
			}
		});
	}
}
