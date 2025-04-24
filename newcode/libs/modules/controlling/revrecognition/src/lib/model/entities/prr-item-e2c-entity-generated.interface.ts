/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrrHeaderEntity } from './prr-header-entity.interface';
import { IPrrItemE2cEntity } from './prr-item-e2c-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IPrrItemE2cEntityGenerated extends IEntityBase {

  /**
   * ActualCost
   */
  ActualCost: number;

  /**
   * ActualCostPercent
   */
  ActualCostPercent: number;

  /**
   * ActualRevenue
   */
  ActualRevenue: number;

  /**
   * CalculatedRevenue
   */
  CalculatedRevenue: number;

  /**
   * CalculatedRevenuePercent
   */
  CalculatedRevenuePercent: number;

  /**
   * Code
   */
  Code: string;

  /**
   * ContractedValue
   */
  ContractedValue: number;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * EstimatedCost
   */
  EstimatedCost: number;

  /**
   * HasChildren
   */
  HasChildren: boolean;

  /**
   * Id
   */
  Id: number;

  /**
   * MdcControllingunitFk
   */
  MdcControllingunitFk: number;

  /**
   * MdcControllingunitParentFk
   */
  MdcControllingunitParentFk?: number | null;

  /**
   * ParentId
   */
  ParentId?: number | null;

  /**
   * PrrHeaderEntity
   */
  PrrHeaderEntity?: IPrrHeaderEntity | null;

  /**
   * PrrHeaderFk
   */
  PrrHeaderFk: number;

  /**
   * PrrItemE2cChildren
   */
  PrrItemE2cChildren?: IPrrItemE2cEntity[] | null;

  /**
   * RevenueAccrual
   */
  RevenueAccrual: number;

  /**
   * RevenueAccrualPercent
   */
  RevenueAccrualPercent: number;

  /**
   * RevenueToComplete
   */
  RevenueToComplete: number;

  /**
   * TotalCost
   */
  TotalCost: number;

  /**
   * isBaseItem
   */
  isBaseItem: boolean;
}
