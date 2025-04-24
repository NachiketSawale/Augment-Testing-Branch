/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IEstAllAreaBoqRangeEntityGenerated extends IEntityBase {

/*
 * EstAllowanceAreaFk
 */
  EstAllowanceAreaFk?: number | null;

/*
 * EstAllowanceFk
 */
  EstAllowanceFk?: number | null;

/*
 * FromBoqHeaderFk
 */
  FromBoqHeaderFk?: number | null;

/*
 * FromBoqItemFk
 */
  FromBoqItemFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * ToBoqHeaderFk
 */
  ToBoqHeaderFk?: number | null;

/*
 * ToBoqItemFk
 */
  ToBoqItemFk?: number | null;
}
