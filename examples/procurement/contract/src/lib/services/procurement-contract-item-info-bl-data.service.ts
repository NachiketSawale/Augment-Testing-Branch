/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken} from '@angular/core';
import {
    IPrcItemInfoBLEntity,
    ProcurementCommonItemInfoBlDataService
} from '@libs/procurement/common';
import { ConItemComplete } from '../model/con-item-complete.class';
import { IConItemEntity } from '../model/entities';
import { ProcurementContractItemDataService } from './procurement-contract-item-data.service';


export const PROCUREMENT_CONTRACT_ITEM_INFO_BL_DATA_TOKEN = new InjectionToken<ProcurementContractItemInfoBlDataService>('procurementContractItemInfoBlDataService');


/**
 * BaseLine service in contract
 */
@Injectable({
    providedIn: 'root'
})
export class ProcurementContractItemInfoBlDataService extends ProcurementCommonItemInfoBlDataService<IPrcItemInfoBLEntity,IConItemEntity, ConItemComplete> {

    public constructor(protected override readonly parentService:ProcurementContractItemDataService) {
        super(parentService);
    }

    public override isParentFn(parentKey: IConItemEntity, entity: IPrcItemInfoBLEntity): boolean {
		return entity.PrcItemFk === parentKey.Id;
	}
}