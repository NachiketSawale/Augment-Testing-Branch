/*
 * Copyright(c) RIB Software GmbH
 */


import { IQtoShareHeaderEntity } from '@libs/qto/shared';


export interface IQtoMainHeaderGridEntity extends IQtoShareHeaderEntity {
    ProjectNo?: string;
    PrcPackageFk?: number;
}