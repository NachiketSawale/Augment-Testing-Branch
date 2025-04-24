/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstAllowanceEntity } from './est-allowance-entity.interface';

export interface IAllowanceCalculationOptionGenerated {

/*
 * AllowanceFk
 */
  AllowanceFk?: number | null;

/*
 * EstAllowance
 */
  EstAllowance?: IEstAllowanceEntity | null;

/*
 * EstHeaderId
 */
  EstHeaderId?: number | null;

/*
 * ProjectId
 */
  ProjectId?: number | null;
}
