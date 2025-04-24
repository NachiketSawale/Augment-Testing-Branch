/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IQuoteHeaderEntity } from './quote-header-entity.interface';
import { QuoteRequisitionEntityComplete } from './quote-quisition-entity-complete.class';
import { IPrcGeneralsEntity } from '@libs/procurement/common';
export class QuoteHeaderEntityComplete implements CompleteIdentification<IQuoteHeaderEntity> {
	public constructor(
		public MainItemId: number,
		public EntitiesCount: number
	) {
	}

	public QuoteHeader?: IQuoteHeaderEntity | null;
	public QtnRequisitionToSave?: QuoteRequisitionEntityComplete[] | null;
	public PrcGeneralsToSave?:Array<IPrcGeneralsEntity>;
	public PrcGeneralsToDelete?:Array<IPrcGeneralsEntity>;

}