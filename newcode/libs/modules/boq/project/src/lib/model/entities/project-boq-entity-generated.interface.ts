/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IProjectBoqEntityGenerated extends IEntityBase {

/*
 * BoqHeaderFk
 */
  BoqHeaderFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * PrjProjectFk
 */
  PrjProjectFk: number;
}
