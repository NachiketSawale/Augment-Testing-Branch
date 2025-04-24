/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICosFlagEntity } from './cos-flag-entity.interface';
import { ICosInstanceEntity } from '@libs/constructionsystem/shared';

export interface ICosCompareEntityGenerated {

/*
 * CosFlags
 */
  CosFlags?: ICosFlagEntity[] | null;

/*
 * CosInstances
 */
  CosInstances?: ICosInstanceEntity[] | null;
}
