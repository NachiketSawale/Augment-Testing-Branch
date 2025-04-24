/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPpsPlannedQuantityEntityGenerated extends IEntityBase {
  Id: number;
  Description?: string;
  PpsHeaderFk: number;
  PlannedQuantityFk?: number;
  Quantity: number;
  BasUomFk?: number;
  PpsPlannedQuantityTypeFk: number;
  Property?: number | null;
  MdcProductDescriptionFk?: number | null;
  FormulaParameter?: string | null;
  CharacteristicFk?: number | null;
  PrjLocationFk?: number | null;
  DueDate?: string | null;
  BasBlobsSpecificationFk?: number | null;
  BoqHeaderFk?: number;
  BoqItemFk?: number;
  EstHeaderFk?: number;
  EstLineItemFk?: number;
  EstResourceFk?: number;
  MdcMaterialFk?: number | null;
  MdcCostCodeFk?: number | null;
  SourceCode1?: string;
  SourceCode2?: string;
  SourceCode3?: string;
  CommentText?: string;
  Userdefined1?: string | null;
  Userdefined2?: string | null;
  Userdefined3?: string | null;
  Userdefined4?: string | null;
  Userdefined5?: string | null;
}
