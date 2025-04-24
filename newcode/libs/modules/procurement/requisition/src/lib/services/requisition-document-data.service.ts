import { inject, Injectable } from '@angular/core';

import { IPrcDocumentEntity, ProcurementCommonDocumentDataService } from '@libs/procurement/common';

import { ProcurementRequisitionHeaderDataService } from './requisition-header-data.service';

import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';

/**
 * Procurement Requisition Document Data Service
 */

@Injectable({
	providedIn: 'root',
})
export class ProcurementRequisitionDocumentDataService extends ProcurementCommonDocumentDataService<IPrcDocumentEntity, IReqHeaderEntity, ReqHeaderCompleteEntity> {
    /**
     * Procurement requisition Header Data Service
     */
	private readonly requisitionDataService: ProcurementRequisitionHeaderDataService;

    public constructor() {
		const requisitionDataService = inject(ProcurementRequisitionHeaderDataService);
		super(requisitionDataService, {});
		this.requisitionDataService = requisitionDataService;
	}

	 /**
     * overrided the provideLoadPayload method to returns a payload object
     */
	 protected override provideLoadPayload(): object {
        return {
            filter: '',
            PKey1:this.requisitionDataService.getHeaderEntity()!.Id
        };
    }

	public override isParentFn(parentKey: IReqHeaderEntity, entity: IPrcDocumentEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}
}
