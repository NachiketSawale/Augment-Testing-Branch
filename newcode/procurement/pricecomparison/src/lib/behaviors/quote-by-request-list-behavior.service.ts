/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IQuote2RfqVEntity } from '@libs/procurement/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPriceComparisonQuoteByRequestBehavior implements IEntityContainerBehavior<IGridContainerLink<IQuote2RfqVEntity>, IQuote2RfqVEntity> {

}