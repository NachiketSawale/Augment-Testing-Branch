/*
 * Copyright(c) RIB Software GmbH
 */
import { IDescriptionInfo } from '@libs/platform/common';
import { IPrcItemEntity } from './prc-item-entity.interface';
import { IReqStatusEntity } from './req-status-entity.interface';
import { IBasicsCustomizeConStatusEntity } from '@libs/basics/interfaces';

/**
 * Req/Contract Header Entity returns from order request http
 */
export interface IPrcOrderQueryItemEntity {
	Id: number;
	Code: string;
	DescriptionInfo: IDescriptionInfo;
	BasCurrencyDescription: string;
	DateReceived: string;
	Total: number;
	PrcItems?: IPrcItemEntity[];
	ClerkPrcDescription: string;
	ReqStatus?: IReqStatusEntity;
	ConStatus?: IBasicsCustomizeConStatusEntity;
	Remark: string;
	ReqStatusFk?: number;
	ConStatusFk?: number;
	DateOrdered: string;
}
