import { ProcurementCommonItemValidationService } from '@libs/procurement/common';
import { IReqItemEntity } from '../../model/entities/req-item-entity.interface';
import { ReqItemComplete } from '../../model/req-item-complete.class';
import { IReqHeaderEntity } from '../../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../../model/entities/requisition-complete-entity.class';
import { Injectable } from '@angular/core';
import { RequisitionItemsDataService } from '../requisition-items-data.service';

@Injectable({
	providedIn: 'root',
})
export class RequisitionItemValidationService extends ProcurementCommonItemValidationService<IReqItemEntity, ReqItemComplete, IReqHeaderEntity, ReqHeaderCompleteEntity> {
	public constructor(protected reqItemsDataService: RequisitionItemsDataService) {
		super(reqItemsDataService);
	}
}
