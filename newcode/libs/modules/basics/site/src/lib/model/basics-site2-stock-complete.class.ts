/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSite2StockEntity } from './basics-site2-stock-entity.class';
import { CompleteIdentification } from '@libs/platform/common';

export class BasicsSite2StockComplete implements CompleteIdentification<BasicsSite2StockEntity> {
	public Id: number = 0;

	public Datas: BasicsSite2StockEntity[] | null = [];
}
