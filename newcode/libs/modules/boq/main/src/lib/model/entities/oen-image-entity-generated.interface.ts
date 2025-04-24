/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IOenImageEntityGenerated extends IEntityBase {

/*
 * BlobsFk
 */
  BlobsFk: number;

/*
 * Format
 */
  Format: string;

/*
 * Id
 */
  Id: number;

/*
 * OenParamListFk
 */
  OenParamListFk: number;
}
