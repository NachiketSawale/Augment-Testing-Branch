/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IRuleEntityGenerated extends IEntityBase {

  Id: number;

  ImportFormatFk: number;

  IsLive: boolean | null;

  MatchFieldFk: number;

  MatchPattern: string | null;

  Remark: string | null;

  RuleSetFk: number | null;

  RuleTypeFk: number;
}
