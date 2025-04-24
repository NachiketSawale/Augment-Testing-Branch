/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPpsNestingEntityGenerated extends IEntityBase {
  AngleA?: number;
  AngleB?: number;
  AngleC?: number;
  EngDrawingFk?: number;
  Id: number;
  PositionX?: number;
  PositionY?: number;
  PositionZ?: number;
  PpsFabricationUnitFk?: number;
  PpsItemFk?: number;
  PpsProductFk?: number;
  SlabNumber?: string;
  UserDefined1?: string;
  UserDefined2?: string;
  UserDefined3?: string;
  UserDefined4?: string;
  UserDefined5?: string;
}
