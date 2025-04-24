/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPpsItemSourceEntityGenerated extends IEntityBase {
  Id: number;
  PpsItemFk: number;
  BoqHeaderFk?: number | null;
  BoqItemFk?: number | null;
  PpsEventSeqConfigFk?: number | null;
  EstHeaderFk?: number | null;
  EstLineItemFk?: number | null;
  EstResourceFk?: number | null;
  PpsPlannedQuantityFk?: number | null;
}
