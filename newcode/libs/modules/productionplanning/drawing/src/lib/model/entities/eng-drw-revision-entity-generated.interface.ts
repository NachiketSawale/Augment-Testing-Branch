/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IEngDrwRevisionEntityGenerated extends IEntityBase {

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * EngDrawingFk
 */
  EngDrawingFk?: number | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * Revision
 */
  Revision?: number | null;
}
