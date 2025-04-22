/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IQuoteHeaderEntity } from '../model/entities/quote-header-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class ProcurementQuoteHeaderBehavior implements IEntityContainerBehavior<IGridContainerLink<IQuoteHeaderEntity>, IQuoteHeaderEntity> {

}