/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IOenLbChangeTypeEntityGenerated extends IEntityBase {

/*
 * Description
 */
  Description?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * IsDefault
 */
  IsDefault: boolean;

/*
 * Sorting
 */
  Sorting: number;
}
