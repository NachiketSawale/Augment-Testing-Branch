/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPesHeaderCompeleteEntityGenerated extends IEntityBase {

/*
 * Code
 */
  Code?: string | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * MdcControllingunitFk
 */
  MdcControllingunitFk?: number | null;

/*
 * PesStatusFk
 */
  PesStatusFk?: number | null;

/*
 * PesValue
 */
  PesValue?: number | null;

/*
 * PrjChangeFk
 */
  PrjChangeFk?: number | null;
}
