/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IResultEntityGenerated extends IEntityBase {

  BasClobFormulaFk: number | null;

  //ClobToSave?: IClobEntity | null;

  ComponentTypeFk: number;

  ContextFk: number | null;

  CostCodeFk: number | null;

  Description: string | null;

  Id: number;

  IsLive: boolean | null;

  MaterialFk: number | null;

  MaterialGroupFk: number | null;

  OverrideUom: boolean | null;

  PpsEntityFk: number | null;

  Property: number | null;

  QuantityFormula: string | null;

  QuantityFormula2: string | null;

  QuantityFormula3: string | null;

  Result: number | null;

  RuleSetFk: number | null;

  Sorting: number | null;

  Uom2Fk: number | null;

  Uom3Fk: number | null;

  UomFk: number | null;

  UpdActive: boolean | null;

  UpstreamItemTarget: number | null;

  UpstreamItemTemplateFk: number | null;
}
