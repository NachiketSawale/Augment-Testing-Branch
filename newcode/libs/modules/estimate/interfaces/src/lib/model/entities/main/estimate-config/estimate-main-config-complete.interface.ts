/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstimateMainColumnConfigComplete } from './estimate-main-column-config-complete.interface';
import { IEstimateMainConfigEntity } from './estimate-main-config-entity.interface';
import { ITotalsConfigComplete } from './totals-config-complete.interface';
import { IRoundingConfigComplete } from './rounding-config-complete.interface';

export interface IEstimateMainConfigComplete extends IEstimateMainConfigEntity, IEstimateMainColumnConfigComplete, ITotalsConfigComplete, IRoundingConfigComplete {

}