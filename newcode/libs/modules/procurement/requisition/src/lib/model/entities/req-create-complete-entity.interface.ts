/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcHeaderblobEntity } from '@libs/procurement/interfaces';
import {IReqTotalEntity} from './req-total-entity.interface';
import {IReqHeaderEntity} from './reqheader-entity.interface';

export interface IReqCreateCompleteEntity {
	ReqHeaderDto?: IReqHeaderEntity | null;
	PrcTotalsDto?: IReqTotalEntity[] | null;
	PrcHeaderBlob?: IPrcHeaderblobEntity[] | null;
}
