/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IRuleSetEntityGenerated extends IEntityBase {

  AutoGenerated: boolean | null;

  Comment: string | null;

  Description: string | null;

  Id: number;

  IsLive: boolean | null;
}
