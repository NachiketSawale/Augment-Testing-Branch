/*
 * Copyright(c) RIB Software GmbH
 */

import {IEstHeaderEntity} from '@libs/estimate/interfaces';

export interface ProjectCostCodesEditableMap{
    noGCCOrderSetting: boolean;
    fixedRate: boolean;
    isEditableShow:boolean
}

export interface IEstHeaderCompositeEntity extends IEstHeaderEntity{
    IsReadOnly: boolean
}

export interface CreateAdditionalExpenseResponseMap{
    NoDefaultJob?: boolean;
    timeStr: object
}