/*
 * Copyright(c) RIB Software GmbH
 */
import {IDescriptionInfo, IEntityIdentification} from '@libs/platform/common';

export interface IContractStatusEntity extends IEntityIdentification {
    Selected: boolean;
    DescriptionInfo:  IDescriptionInfo;
    Icon:number
}