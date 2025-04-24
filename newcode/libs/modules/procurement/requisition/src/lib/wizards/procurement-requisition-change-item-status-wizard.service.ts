/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable} from '@angular/core';
import { ProcurementCommonChangeItemStatusWizardService } from '@libs/procurement/common';
import { IReqItemEntity } from '../model/entities/req-item-entity.interface';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';
import { ProcurementRequisitionHeaderDataService } from '../services/requisition-header-data.service';
import { RequisitionItemsDataService } from '../services/requisition-items-data.service';

@Injectable({
	providedIn: 'root',
})
/**
 * Procurement Requisition Change Status for Item wizard service
 */
export class ProcurementRequisitionChangeItemStatusWizardService extends ProcurementCommonChangeItemStatusWizardService<IReqItemEntity, IReqHeaderEntity, ReqHeaderCompleteEntity> {
		
	public constructor( mainService:ProcurementRequisitionHeaderDataService , dataService: RequisitionItemsDataService){
		super(mainService, dataService);
	}
	protected getModuleName(): string {
        return 'procurement.requisition';
    }
}