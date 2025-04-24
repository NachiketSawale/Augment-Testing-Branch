/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IOenGraphicEntityGenerated extends IEntityBase {

/*
 * Blob
 */
  //Blob?: IBlobEntity | null;

/*
 * BlobsFk
 */
  BlobsFk: number;

/*
 * BoqHeaderFk
 */
  BoqHeaderFk: number;

/*
 * Description
 */
  Description: string;

/*
 * Format
 */
  Format: string;

/*
 * Id
 */
  Id: number;

/*
 * Uuid
 */
  Uuid: string;
}
