/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstAllowanceAreaEntityGenerated extends IEntityBase {

/*
 * AreaType
 */
  AreaType: number;

/*
 * Code
 */
  Code: string;

/*
 * Description
 */
  Description?: IDescriptionInfo | null;

/*
 * DjcTotal
 */
  DjcTotal?: number | null;

/*
 * EstAllowanceFk
 */
  EstAllowanceFk?: number | null;

/*
 * GcTotal
 */
  GcTotal?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * ParentFk
 */
  ParentFk?: number | null;
}
