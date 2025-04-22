/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { BasicsSharedPriceConditionParamDataService, PriceConditionHeaderEnum } from '@libs/basics/shared';
import { IWipHeaderEntity } from '../model/entities/wip-header-entity.interface';
import { WipHeaderComplete } from '../model/wip-header-complete.class';
import { SalesWipWipsDataService } from './sales-wip-wips-data.service';

@Injectable({
	providedIn: 'root',
})

export class WipPriceConditionParamDataService extends BasicsSharedPriceConditionParamDataService<IWipHeaderEntity, WipHeaderComplete> {
	public constructor(protected dataService: SalesWipWipsDataService) {
		super(dataService, PriceConditionHeaderEnum.Wip);
	}
}
