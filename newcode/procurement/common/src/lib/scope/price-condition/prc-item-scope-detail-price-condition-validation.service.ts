/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { BasicsSharedPriceConditionValidationService } from '@libs/basics/shared';
import { IPrcItemEntity, IPrcItemScopeDetailEntity, IPrcItemScopeDetailPcEntity, } from '../../model/entities';
import { PrcCommonItemComplete } from '../../model/procurement-common-item-complete.class';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { PrcItemScopeDetailPriceConditionDataService } from './prc-item-scope-detail-price-condition-data.service';
import { PrcItemScopeDetailComplete } from '../../model/prc-item-scope-detail-complete.class';
/**
 * prc item price condition validation service
 */
@Injectable({
	providedIn: 'root'
})
export class PrcItemScopeDetailPriceConditionValidationService<
	PT extends IPrcItemEntity,
	PU extends PrcCommonItemComplete,
	HT extends IEntityIdentification,
	HU extends CompleteIdentification<HT>
> extends BasicsSharedPriceConditionValidationService<IPrcItemScopeDetailPcEntity, IPrcItemScopeDetailEntity, PrcItemScopeDetailComplete> {

	public constructor(dataService: PrcItemScopeDetailPriceConditionDataService<PT, PU, HT, HU>) {
		super(dataService);
	}
}