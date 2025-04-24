/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IBusinessPartnerEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPriceComparisonBusinessPartnerBehavior implements IEntityContainerBehavior<IGridContainerLink<IBusinessPartnerEntity>, IBusinessPartnerEntity> {

}