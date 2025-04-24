/*
* Copyright(c) RIB Software GmbH
*/

import { IProcurementCommonExtBidderEntity, PrcCommonExtBidderComplete, ProcurementCommonExtBidderDataService } from '@libs/procurement/common';
import { Injectable } from '@angular/core';
import { ProcurementRequisitionHeaderDataService } from './requisition-header-data.service';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
@Injectable({
   providedIn: 'root'
})

/**
* The Data service for the procurement requisition further extranal BPs container.
*/

export class ProcurementRequisitionExtBidderDataService extends ProcurementCommonExtBidderDataService<IProcurementCommonExtBidderEntity, IReqHeaderEntity, PrcCommonExtBidderComplete>{

    public constructor(protected override parentService: ProcurementRequisitionHeaderDataService) {
        super(parentService);
    }
    
    protected getPackageFk(parent: IReqHeaderEntity): number {
       if(parent) {
           return parent.PackageFk!;
       }
       throw new Error('Should have selected parent entity');
    }

    public isReadonly(): boolean {
        return this.parentService.getHeaderContext().readonly;
    }
    public override isParentFn(parentKey: IReqHeaderEntity, entity: IProcurementCommonExtBidderEntity): boolean {
       return entity.PrcPackageFk === parentKey.PackageFk;
    }
}