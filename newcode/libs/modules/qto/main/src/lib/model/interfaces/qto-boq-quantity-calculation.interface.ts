/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {IQtoMainDetailGridEntity} from '../qto-main-detail-grid-entity.class';
import {IQtoDetailBoqCalculateInfo} from './qto-detail-boq-calculate-info.interface';

/**
 * qto boq quantity calculation info
 */
export interface IQtoBoqQuantityCalculation {
    boqItemFks?: number[] | null;
    QtoDetailDatas?: IQtoMainDetailGridEntity[] | null;
    qtoDetialsOfAffectedBoq?: IQtoDetailBoqCalculateInfo[] | null;
}