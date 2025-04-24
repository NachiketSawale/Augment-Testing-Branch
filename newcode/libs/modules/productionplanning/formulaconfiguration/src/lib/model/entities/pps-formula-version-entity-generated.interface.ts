/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';


export interface IPpsFormulaVersionEntityGenerated extends IEntityBase {
  Id: number;
  PpsFormulaFk: number;
  BasClobsFk?: number | null;
  FormulaVersion: number;
  Status: number;
  IsLive: boolean;
  CommentText: string;
}
