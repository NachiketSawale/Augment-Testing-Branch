/*
 * Copyright(c) RIB Software GmbH
 */
import {IDescriptionInfo} from '@libs/platform/common';
import {IPrcItemEntity} from './prc-item-entity.interface';
import {IReqStatusEntity} from './req-status-entity.interface';

/**
 * Req Header Entity returns from order request http
 */
export interface IReqHeaderEntity {
    Id: number;
    Code: string;
    DescriptionInfo: IDescriptionInfo;
    BasCurrencyDescription: string;
    DateReceived: string;
    Total: number;
    PrcItems?: IPrcItemEntity[];
    ClerkPrcDescription: string;
    ReqStatus: IReqStatusEntity;
    Remark: string;
    ReqStatusFk: number;
}