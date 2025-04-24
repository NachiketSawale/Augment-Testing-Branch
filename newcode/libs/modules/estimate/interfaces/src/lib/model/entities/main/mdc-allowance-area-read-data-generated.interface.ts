/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IMdcAllowanceAreaEntity } from './mdc-allowance-area-entity.interface';
import { IMdcAllArea2GcAreaValueEntity } from './mdc-all-area-2gc-area-value-entity.interface';

export interface IMdcAllowanceAreaReadDataGenerated {

/*
 * AreaType
 */
  AreaType?: number | null;

/*
 * IsExistAllowance
 */
  IsExistAllowance?: boolean | null;

/*
 * MdcAllowanceArea
 */
  MdcAllowanceArea?: IMdcAllowanceAreaEntity[] | null;

/*
 * MdcAllowanceFk
 */
  MdcAllowanceFk?: number | null;

/*
 * NormalAllowanceAreaRestFk
 */
  NormalAllowanceAreaRestFk?: number | null;

/*
 * mdcAllArea2GcAreas
 */
  mdcAllArea2GcAreas?: IMdcAllArea2GcAreaValueEntity[] | null;

/*
 * mdcAllowanceAreaFks
 */
  mdcAllowanceAreaFks?: number[] | null;
}
