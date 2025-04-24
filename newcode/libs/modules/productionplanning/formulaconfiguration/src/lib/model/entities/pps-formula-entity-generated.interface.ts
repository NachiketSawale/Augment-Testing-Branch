/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';


export interface IPpsFormulaEntityGenerated extends IEntityBase {
  Id: number;
  Description: string;
  CommentText: string;
}
