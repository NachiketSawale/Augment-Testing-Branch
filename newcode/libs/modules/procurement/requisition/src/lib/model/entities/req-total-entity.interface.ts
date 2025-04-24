/*
 * Copyright(c) RIB Software GmbH
 */


import {IReqHeaderEntity} from './reqheader-entity.interface';
import { IPrcCommonTotalEntity } from '@libs/procurement/interfaces';

export interface IReqTotalEntity extends IPrcCommonTotalEntity{
	ReqHeader?: IReqHeaderEntity | null;
}
