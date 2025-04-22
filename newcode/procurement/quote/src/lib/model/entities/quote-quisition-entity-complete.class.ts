/*
 * Copyright(c) RIB Software GmbH
 */

import { IQuoteRequisitionEntity } from './quote-requisition-entity.interface';
import { ReqHeaderCompleteEntity } from '@libs/procurement/requisition';

export class QuoteRequisitionEntityComplete extends ReqHeaderCompleteEntity {
	public QuoteRequisition!: IQuoteRequisitionEntity;

}