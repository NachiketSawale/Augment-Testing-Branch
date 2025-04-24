/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IGccAddExpenseEntityGenerated extends IEntityBase {

/*
 * Amount
 */
  Amount?: number | null;

/*
 * Code
 */
  Code?: string | null;

/*
 * Comment
 */
  Comment?: string | null;

/*
 * ConHeaderFk
 */
  ConHeaderFk?: number | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * MdcControllingUnitFk
 */
  MdcControllingUnitFk?: number | null;

/*
 * PrcPackageFk
 */
  PrcPackageFk?: number | null;
}
