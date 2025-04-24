/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IOenZzVariantEntityGenerated extends IEntityBase {

/*
 * Description
 */
  Description?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * Nr
 */
  Nr: number;

/*
 * OenZzFk
 */
  OenZzFk: number;
}
