/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IPrcMilestoneEntity, ProcurementCommonMileStoneDataService } from '@libs/procurement/common';
import { IQuoteHeaderEntity, QuoteHeaderEntityComplete } from '../model';
import { ProcurementQuoteHeaderDataService } from './quote-header-data.service';

/**
 * MileStone service in Quote
 */
@Injectable({
    providedIn: 'root'
})
export class ProcurementQuoteMileStoneDataService extends ProcurementCommonMileStoneDataService<IPrcMilestoneEntity,IQuoteHeaderEntity, QuoteHeaderEntityComplete> {
    public constructor(protected override readonly parentService: ProcurementQuoteHeaderDataService) {
        super(parentService);
    }

    protected override getMainItemId(parent:IQuoteHeaderEntity){
        return parent.PrcHeaderFk!;
    }
    protected override getProjectId(parent:IQuoteHeaderEntity){
        return parent.ProjectFk!;
    }

    protected override getModuleName(): string {
        return 'procurement.quote';
    }

	public override isParentFn(parentKey: IQuoteHeaderEntity, entity: IPrcMilestoneEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}
}