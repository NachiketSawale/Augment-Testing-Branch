/*
 * Copyright(c) RIB Software GmbH
 */

import { IMaterialEntity } from '@libs/basics/interfaces';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { IProject2MdcMaterialPortionEntity } from './project-2-mdc-material-portion-entity.interface';

export interface IPrjMaterialEntityGenerated extends IEntityBase {

  /**
   * BasCurrencyFk
   */
  BasCurrencyFk?: number | null;

  /**
   * BasMaterial
   */
  BasMaterial?: IMaterialEntity | null;

  /**
   * BasUomPriceUnitFk
   */
  BasUomPriceUnitFk?: number | null;

  /**
   * Charges
   */
  Charges: number;

  /**
   * Co2Project
   */
  Co2Project?: number | null;

  /**
   * Co2Source
   */
  Co2Source?: number | null;

  /**
   * Co2SourceFk
   */
  Co2SourceFk?: number | null;

  /**
   * Code
   */
  Code?: string | null;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * Cost
   */
  Cost: number;

  /**
   * DayWorkRate
   */
  DayWorkRate: number;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * DescriptionInfo2
   */
  DescriptionInfo2?: IDescriptionInfo | null;

  /**
   * Discount
   */
  Discount: number;

  /**
   * EstCostTypeFk
   */
  EstCostTypeFk?: number | null;

  /**
   * EstimatePrice
   */
  EstimatePrice: number;

  /**
   * FactorHour
   */
  FactorHour: number;

  /**
   * FactorPriceUnit
   */
  FactorPriceUnit?: number | null;

  /**
   * HourUnit
   */
  HourUnit: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IsLabour
   */
  IsLabour?: boolean | null;

  /**
   * IsRate
   */
  IsRate: boolean;

  /**
   * JobCode
   */
  JobCode?: string | null;

  /**
   * JobDescription
   */
  JobDescription?: string | null;

  /**
   * LgmJobFk
   */
  LgmJobFk?: number | null;

  /**
   * ListPrice
   */
  ListPrice: number;

  /**
   * MaterialCatalogFk
   */
  MaterialCatalogFk: number;

  /**
   * MaterialDiscountGroupFk
   */
  MaterialDiscountGroupFk?: number | null;

  /**
   * MaterialGroupFk
   */
  MaterialGroupFk: number;

  /**
   * MaterialPriceConditionEntities
   */
  // MaterialPriceConditionEntities?: IPrjMaterialPriceConditionEntity[] | null;

  /**
   * MdcCostCodeFK
   */
  MdcCostCodeFK?: number | null;

  /**
   * MdcDayWorkRate
   */
  MdcDayWorkRate: number;

  /**
   * MdcEstCostTypeFk
   */
  MdcEstCostTypeFk?: number | null;

  /**
   * MdcEstimatePrice
   */
  MdcEstimatePrice: number;

  /**
   * MdcMaterialFk
   */
  MdcMaterialFk: number;

  /**
   * MdcTaxCodeFk
   */
  MdcTaxCodeFk?: number | null;

  /**
   * OldJobFk
   */
  OldJobFk?: number | null;

  /**
   * PrcPriceConditionFk
   */
  PrcPriceConditionFk?: number | null;

  /**
   * PrcPriceconditionFk
   */
  PrcPriceconditionFk?: number | null;

  /**
   * PrcStructureFk
   */
  PrcStructureFk?: number | null;

  /**
   * PriceExtra
   */
  PriceExtra: number;

  /**
   * PriceUnit
   */
  PriceUnit: number;

  /**
   * Project2mdcMaterialPortionEntities
   */
  Project2mdcMaterialPortionEntities?: IProject2MdcMaterialPortionEntity[] | null;

  /**
   * ProjectFk
   */
  ProjectFk: number;

  /**
   * RetailPrice
   */
  RetailPrice: number;

  /**
   * UomFk
   */
  UomFk: number;
}
