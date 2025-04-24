/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPPSItem2ClerkEntityGenerated extends IEntityBase {
  Id: number;
  PpsItemFk: number;
  ClerkFk: number;
  ClerkRoleFk: number;
  ValidFrom?: string;
  ValidTo?: string;
  Comment?: string;
}
