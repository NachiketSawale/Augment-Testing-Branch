/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IGccPackagesEntityGenerated extends IEntityBase {

/*
 * Budget
 */
  Budget?: number | null;

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
 * MdcControllingUnitFk
 */
  MdcControllingUnitFk?: number | null;

/*
 * PackageStatusFk
 */
  PackageStatusFk?: number | null;

/*
 * Remark
 */
  Remark?: string | null;

/*
 * Remark2
 */
  Remark2?: string | null;

/*
 * Remark3
 */
  Remark3?: string | null;
}
