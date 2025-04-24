/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';


export interface IPpsRackAssignEntityGenerated extends IEntityBase {

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * PpsProductFk
 */
  PpsProductFk?: number | null;

/*
 * RackCode
 */
  RackCode?: string | null;

/*
 * ResResourceRackFk
 */
  ResResourceRackFk?: number | null;
}
