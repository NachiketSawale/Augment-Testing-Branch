/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';


export interface IEngProdComponentEntityGenerated extends IEntityBase {

  ActualQuantity?: number | null;

  ActualQuantity2?: number | null;

  ActualQuantity3?: number | null;

  BasUomActQty2Fk?: number | null;

  BasUomActQty3Fk?: number | null;

  BasUomActQtyFk?: number | null;

  BasUomFk?: number | null;

  BasUomQty2Fk?: number | null;

  BasUomQty3Fk?: number | null;

  Description?: string | null;

  EngDrawingComponentFk?: number | null;

  EngDrawingFk?: number | null;

  EngDrwCompTypeFk?: number | null;

  Id?: number | null;

  IsLive?: boolean | null;

  MdcCostCodeFk?: number | null;

  MdcMaterialCostCodeProductFk?: number | null;

  MdcMaterialFk?: number | null;

  PpsProductFk?: number | null;

  PpsProductOriginFk?: number | null;

  PrcStockTransactionFk?: number | null;

  Quantity?: number | null;

  Quantity2?: number | null;

  Quantity3?: number | null;

  Reserved1?: string | null;

  Reserved2?: string | null;

  Sorting?: number | null;

  UserDefined1?: string | null;

  UserDefined2?: string | null;

  UserDefined3?: string | null;

  UserDefined4?: string | null;

  UserDefined5?: string | null;

  UserFlag1?: boolean | null;

  UserFlag2?: boolean | null;
}
