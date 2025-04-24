import { ProcurementCommonItemBehavior } from '@libs/procurement/common';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';
import { Injectable } from '@angular/core';
import { RequisitionItemsDataService } from '../services/requisition-items-data.service';
import { IReqItemEntity } from '../model/entities/req-item-entity.interface';
import { ReqItemComplete } from '../model/req-item-complete.class';

@Injectable({
	providedIn: 'root',
})
export class RequisitionItemBehaviorsService extends ProcurementCommonItemBehavior<IReqItemEntity, ReqItemComplete, IReqHeaderEntity, ReqHeaderCompleteEntity> {
	public constructor(protected reqItemsDataService: RequisitionItemsDataService) {
		super(reqItemsDataService);
	}
}
