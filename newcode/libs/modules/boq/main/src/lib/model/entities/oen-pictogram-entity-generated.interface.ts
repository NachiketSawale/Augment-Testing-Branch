/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IOenPictogramEntityGenerated extends IEntityBase {

/*
 * BlobsFk
 */
  BlobsFk: number;

/*
 * Description
 */
  Description: string;

/*
 * Id
 */
  Id: number;

/*
 * OenParamListFk
 */
  OenParamListFk: number;

/*
 * Uuid
 */
  Uuid: string;
}
