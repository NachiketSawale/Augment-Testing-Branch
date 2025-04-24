/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IControllingGrpSetDTLEntityGenerated extends IEntityBase {

/*
 * ControllinggroupFk
 */
  ControllinggroupFk: number;

/*
 * ControllinggroupdetailFk
 */
  ControllinggroupdetailFk: number;

/*
 * ControllinggrpdetailFk
 */
  ControllinggrpdetailFk?: number | null;

/*
 * ControllinggrpsetFk
 */
  ControllinggrpsetFk: number;

/*
 * Id
 */
  Id: number;

/*
 * headerFk
 */
  headerFk?: number | null;
}
