/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstCostcodeAssignDetailEntity } from './est-costcode-assign-detail-entity.interface';

export interface IEstCopyAssignDataGenerated {

/*
 * DataAssigns
 */
  DataAssigns?: IEstCostcodeAssignDetailEntity[] | null;

/*
 * EstTotalsConfigDetailFk
 */
  EstTotalsConfigDetailFk?: number | null;
}
