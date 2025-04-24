/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstAllAreaBoqRangeEntity } from './est-all-area-boq-range-entity.interface';

export interface IAreaWiseBalancingValidationDataGenerated {

/*
 * BoqRanges
 */
  BoqRanges?: IEstAllAreaBoqRangeEntity[] | null;

/*
 * EstAllowanceId
 */
  EstAllowanceId?: number | null;

/*
 * ProjectId
 */
  ProjectId?: number | null;
}
