/*
 * Copyright(c) RIB Software GmbH
 */

import { Subject } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { ConstructionSystemCommonOutputDataService } from '@libs/constructionsystem/common';
import { ConstructionSystemMainJobDataService } from './construction-system-main-job-data.service';
import { ConstructionSystemMainInstanceDataService } from './construction-system-main-instance-data.service';
import { ICosInsErrorEntity } from '../model/entities/cos-ins-error-entity.interfae';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainOutputDataService extends ConstructionSystemCommonOutputDataService<ICosInsErrorEntity> {
	private readonly constructionSystemMainInstanceDataService = inject(ConstructionSystemMainInstanceDataService);

	public constructor() {
		super(ConstructionSystemMainJobDataService);
		(this.parentService as ConstructionSystemMainJobDataService).selectedJobCompleted.subscribe(async (value) => {
			this.resetLastSelectedParentId();
			await this.load({ id: 0 });
		});
	}

	protected override filter(data: ICosInsErrorEntity[]) {
		if (!this.isFilterByInstance) {
			return data;
		}

		const instance = this.constructionSystemMainInstanceDataService.getSelectedEntity();
		if (instance) {
			// todo-allen: wait for the constructionsystemMainLoggingSource
			// data = data.filter(function (item) {
			// 	return item.Instance === instance.Code ||
			// 		item.LoggingSource === constructionsystemMainLoggingSource.scheduler ||
			// 		item.LoggingSource === constructionsystemMainLoggingSource.TwoQ;
			// });
		}
		return data;
	}

	protected override async loadData() {
		if (this.parentService.hasSelection()) {
			const selectedItem = this.parentService.getSelectedEntity();
			if (selectedItem && this.lastSelectedParentId !== selectedItem.Id) {
				const errorList = await (this.parentService as ConstructionSystemMainJobDataService).getScriptJobLog(selectedItem.Id);
				this.lastSelectedParentId = selectedItem.Id;
				return errorList as ICosInsErrorEntity[];
			} else {
				return this.dataItems;
			}
		}
		return [];
	}

	protected override getOnScriptResultUpdatedSubject() {
		const onScriptResultUpdated = (this.parentService as ConstructionSystemMainJobDataService).onScriptResultUpdated;
		return onScriptResultUpdated as Subject<ICosInsErrorEntity[] | null>;
	}
}
