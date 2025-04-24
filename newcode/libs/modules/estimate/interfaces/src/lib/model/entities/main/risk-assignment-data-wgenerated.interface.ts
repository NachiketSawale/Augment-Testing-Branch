/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstRiskRegisterEntity } from './est-risk-register-entity.interface';

export interface IRiskAssignmentDataWGenerated {

/*
 * data
 */
  data?: IEstRiskRegisterEntity[] | null;

/*
 * estHeaderFk
 */
  estHeaderFk?: number | null;
}
