/*
 * Copyright(c) RIB Software GmbH
 */
import {IDescriptionInfo} from '@libs/platform/common';

/**
 * Req Status Entity returns from order request http
 */
export interface IReqStatusEntity {
    Id: number;
    DescriptionInfo: IDescriptionInfo;
    Iscanceled: boolean;
    Isordered: boolean;
}