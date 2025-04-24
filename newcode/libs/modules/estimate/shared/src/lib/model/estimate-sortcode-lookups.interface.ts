/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';


export interface ISortcodes{
    Code:string;
    DescriptionInfo?:IDescriptionInfo;
    Id:number;
    InsertedAt?:Date;
    InsertedBy?:Date;
    ProjectFk?:number;
    UpdatedAt?:Date;
    UpdatedBy?:number;
    Version?:number;
}

export interface ISortCodeEntity{
    totalCount:number;
}