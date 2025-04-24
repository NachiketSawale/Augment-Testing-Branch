/*
 * Copyright(c) RIB Software GmbH
 */

import { IMaterialPortionEntity } from '@libs/basics/interfaces';
import { IEntityBase } from '@libs/platform/common';
import { IPrjMaterialEntity } from './prj-material-entity.interface';

export interface IProject2MdcMaterialPortionEntityGenerated extends IEntityBase {

  /**
   * BasMaterialPortion
   */
  BasMaterialPortion?: IMaterialPortionEntity | null;

  /**
   * CostCode
   */
  CostCode?: string | null;

  /**
   * CostPerUnit
   */
  CostPerUnit: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDayWorkRate
   */
  IsDayWorkRate: boolean;

  /**
   * IsEstimatePrice
   */
  IsEstimatePrice: boolean;

  /**
   * IsRefereToProjectCostCode
   */
  IsRefereToProjectCostCode: boolean;

  /**
   * MdcCostCodeFK
   */
  MdcCostCodeFK?: number | null;

  /**
   * MdcMaterialPortionFk
   */
  MdcMaterialPortionFk: number;

  /**
   * MdcMaterialPortionTypeFk
   */
  MdcMaterialPortionTypeFk?: number | null;

  /**
   * PriceConditionFk
   */
  PriceConditionFk?: number | null;

  /**
   * PriceExtra
   */
  PriceExtra: number;

  /**
   * PrjMaterialEntity
   */
  PrjMaterialEntity?: IPrjMaterialEntity | null;

  /**
   * Project2MdcCostCodeFk
   */
  Project2MdcCostCodeFk?: number | null;

  /**
   * Project2MdcMaterialFk
   */
  Project2MdcMaterialFk: number;

  /**
   * Quantity
   */
  Quantity?: number | null;
}
