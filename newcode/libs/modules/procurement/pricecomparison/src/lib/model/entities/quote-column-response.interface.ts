/*
 * Copyright(c) RIB Software GmbH
 */

import { IQuoteHeaderEntity } from '@libs/procurement/quote';
import { ICustomCompareColumnEntity } from './custom-compare-column-entity.interface';

export interface IQuoteColumnResponse {
	Main: ICustomCompareColumnEntity[];
	Quote: IQuoteHeaderEntity[];
}