/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { IPlantCostCodeEntity } from './plant-cost-code-entity.interface';

export interface IPriceConditionEntityGenerated extends IEntityBase {

  /**
   * Code
   */
  Code: string;

  /**
   * CurrencyFk
   */
  CurrencyFk: number;

  /**
   * DepartureRatingPercent
   */
  DepartureRatingPercent: number;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * HandlingChargeExtern
   */
  HandlingChargeExtern: number;

  /**
   * HandlingChargeFull
   */
  HandlingChargeFull: number;

  /**
   * HandlingChargeRating01
   */
  HandlingChargeRating01?: number | null;

  /**
   * HandlingChargeRating02
   */
  HandlingChargeRating02?: number | null;

  /**
   * HandlingChargeRating03
   */
  HandlingChargeRating03?: number | null;

  /**
   * HandlingChargeRating04
   */
  HandlingChargeRating04?: number | null;

  /**
   * HandlingChargeReduced
   */
  HandlingChargeReduced: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * IsHandlingCharge
   */
  IsHandlingCharge: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * IsMultiple01
   */
  IsMultiple01: boolean;

  /**
   * IsMultiple02
   */
  IsMultiple02: boolean;

  /**
   * IsMultiple03
   */
  IsMultiple03: boolean;

  /**
   * IsMultiple04
   */
  IsMultiple04: boolean;

  /**
   * LgcPlantcostcodeEntities
   */
  LgcPlantcostcodeEntities?: IPlantCostCodeEntity[] | null;

  /**
   * LogisticContextFk
   */
  LogisticContextFk: number;

  /**
   * MasterDataCostCodePriceVersionFk
   */
  MasterDataCostCodePriceVersionFk?: number | null;

  /**
   * MasterDataPriceListFk
   */
  MasterDataPriceListFk?: number | null;

  /**
   * SundryServiceLoadingCostsFk
   */
  SundryServiceLoadingCostsFk?: number | null;

  /**
   * UserDefinedText01
   */
  UserDefinedText01?: string | null;

  /**
   * UserDefinedText02
   */
  UserDefinedText02?: string | null;

  /**
   * UserDefinedText03
   */
  UserDefinedText03?: string | null;

  /**
   * UserDefinedText04
   */
  UserDefinedText04?: string | null;

  /**
   * UserDefinedText05
   */
  UserDefinedText05?: string | null;

  /**
   * VolumeHandlingChargeFull
   */
  VolumeHandlingChargeFull: number;

  /**
   * VolumeHandlingChargeReduced
   */
  VolumeHandlingChargeReduced: number;
}
