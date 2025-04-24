/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';


export interface IPpsFormulaInstanceEntityGenerated extends IEntityBase {
  Id: number;
  Code: string;
  DescriptionInfo: IDescriptionInfo;
  PpsFormulaFk: number;
  CommentText: string;
}
