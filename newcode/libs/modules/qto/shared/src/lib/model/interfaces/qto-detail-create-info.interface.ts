/*
 * Copyright(c) RIB Software GmbH
 */

import {IQtoShareDetailEntity} from '../entities/qto-share-detail-entity.interface';

/**
 * create qto line info: createitems
 */
export interface IQtoDetailCreateInfoInterface<T extends IQtoShareDetailEntity> {
    QtoLines: T[];
    CopyItems?: T[] | null;
    IsGeneratedNo: boolean;
    IsOverflow: boolean;
    //CostGroups: costGroups; //TODO: missinig => cost groups -lnt

}