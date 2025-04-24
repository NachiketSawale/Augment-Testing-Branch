/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICostcodePriceListEntity } from '@libs/basics/interfaces';
import { CompleteIdentification } from '@libs/platform/common';

export class BasicsCostCodesPriceVersionRecordComplete implements CompleteIdentification<ICostcodePriceListEntity>{

	public Id: number = 0;

	public PriceVersionListRecord:ICostcodePriceListEntity[] | null = [];

	
}
