/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ITimeSymbolAccountEntityGenerated extends IEntityBase {

  /**
   * AccountCostFk
   */
  AccountCostFk?: number | null;

  /**
   * AccountICCostFk
   */
  AccountICCostFk?: number | null;

  /**
   * AccountICRevFk
   */
  AccountICRevFk?: number | null;

  /**
   * AccountRevFk
   */
  AccountRevFk?: number | null;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * CompanyChargedFk
   */
  CompanyChargedFk: number;

  /**
   * CompanyChargedLedgerContextFk
   */
  CompanyChargedLedgerContextFk: number;

  /**
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * CompanyLedgerContextFk
   */
  CompanyLedgerContextFk: number;

  /**
   * ControllingGroup1Fk
   */
  ControllingGroup1Fk?: number | null;

  /**
   * ControllingGroup2Fk
   */
  ControllingGroup2Fk?: number | null;

  /**
   * ControllingGroup3Fk
   */
  ControllingGroup3Fk?: number | null;

  /**
   * ControllingGrpDetail1CostFk
   */
  ControllingGrpDetail1CostFk?: number | null;

  /**
   * ControllingGrpDetail1ICCostFk
   */
  ControllingGrpDetail1ICCostFk?: number | null;

  /**
   * ControllingGrpDetail1ICRevFk
   */
  ControllingGrpDetail1ICRevFk?: number | null;

  /**
   * ControllingGrpDetail1RevFk
   */
  ControllingGrpDetail1RevFk?: number | null;

  /**
   * ControllingGrpDetail2CostFk
   */
  ControllingGrpDetail2CostFk?: number | null;

  /**
   * ControllingGrpDetail2ICCostFk
   */
  ControllingGrpDetail2ICCostFk?: number | null;

  /**
   * ControllingGrpDetail2ICRevFk
   */
  ControllingGrpDetail2ICRevFk?: number | null;

  /**
   * ControllingGrpDetail2RevFk
   */
  ControllingGrpDetail2RevFk?: number | null;

  /**
   * ControllingGrpDetail3CostFk
   */
  ControllingGrpDetail3CostFk?: number | null;

  /**
   * ControllingGrpDetail3ICCostFk
   */
  ControllingGrpDetail3ICCostFk?: number | null;

  /**
   * ControllingGrpDetail3ICRevFk
   */
  ControllingGrpDetail3ICRevFk?: number | null;

  /**
   * ControllingGrpDetail3RevFk
   */
  ControllingGrpDetail3RevFk?: number | null;

  /**
   * ControllingUnitFk
   */
  ControllingUnitFk?: number | null;

  /**
   * CostGroupFk
   */
  CostGroupFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * NominalDimension1Cost
   */
  NominalDimension1Cost?: string | null;

  /**
   * NominalDimension1ICCost
   */
  NominalDimension1ICCost?: string | null;

  /**
   * NominalDimension1ICRev
   */
  NominalDimension1ICRev?: string | null;

  /**
   * NominalDimension1Rev
   */
  NominalDimension1Rev?: string | null;

  /**
   * NominalDimension2Cost
   */
  NominalDimension2Cost?: string | null;

  /**
   * NominalDimension2ICCost
   */
  NominalDimension2ICCost?: string | null;

  /**
   * NominalDimension2ICRev
   */
  NominalDimension2ICRev?: string | null;

  /**
   * NominalDimension2Rev
   */
  NominalDimension2Rev?: string | null;

  /**
   * NominalDimension3Cost
   */
  NominalDimension3Cost?: string | null;

  /**
   * NominalDimension3ICCost
   */
  NominalDimension3ICCost?: string | null;

  /**
   * NominalDimension3ICRev
   */
  NominalDimension3ICRev?: string | null;

  /**
   * NominalDimension3Rev
   */
  NominalDimension3Rev?: string | null;

  /**
   * SurchargeTypeFk
   */
  SurchargeTypeFk: number;

  /**
   * TimeSymbolFk
   */
  TimeSymbolFk: number;
}
