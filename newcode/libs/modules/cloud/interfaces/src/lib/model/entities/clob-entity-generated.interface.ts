/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IClobEntityGenerated extends IEntityBase {

/*
 * Content
 */
  Content?: string | null;

/*
 * Id
 */
  Id: number;
}
