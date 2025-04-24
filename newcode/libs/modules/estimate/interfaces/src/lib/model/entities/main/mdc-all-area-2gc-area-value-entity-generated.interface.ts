/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IMdcAllArea2GcAreaValueEntityGenerated extends IEntityBase {

/*
 * Id
 */
  Id: number;

/*
 * MdcAllowanceAreaFk
 */
  MdcAllowanceAreaFk?: number | null;

/*
 * MdcAllowanceFk
 */
  MdcAllowanceFk?: number | null;

/*
 * MdcAllowanceGcAreaFk
 */
  MdcAllowanceGcAreaFk?: number | null;

/*
 * Value
 */
  Value?: number | null;
}
