import { PrcItemScopeEntitySeriesService } from '@libs/procurement/common';
import { IReqItemEntity } from '../model/entities/req-item-entity.interface';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';
import { inject, Injectable } from '@angular/core';
import { RequisitionItemsDataService } from './requisition-items-data.service';
import { ReqItemComplete } from '../model/req-item-complete.class';

@Injectable({
	providedIn: 'root',
})
export class RequisitionItemScopeSeriesService extends PrcItemScopeEntitySeriesService<IReqItemEntity, ReqItemComplete, IReqHeaderEntity, ReqHeaderCompleteEntity> {
	public constructor() {
		super({
			prcItemDataService: inject(RequisitionItemsDataService),
		});
	}
}
