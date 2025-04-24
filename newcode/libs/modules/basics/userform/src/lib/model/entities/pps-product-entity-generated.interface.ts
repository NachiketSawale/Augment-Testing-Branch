/*
 * Copyright(c) RIB Software GmbH
 */

import { IPpsProductFormdataEntity } from './pps-product-formdata-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IPpsProductEntityGenerated extends IEntityBase {

  /**
   * Area
   */
  Area: number;

  /**
   * Area2
   */
  Area2: number;

  /**
   * Area3
   */
  Area3: number;

  /**
   * Code
   */
  Code: string;

  /**
   * ConcreteQuality
   */
  ConcreteQuality?: string | null;

  /**
   * ConcreteVolume
   */
  ConcreteVolume: number;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * EngTmplRevisionFk
   */
  EngTmplRevisionFk?: number | null;

  /**
   * ExternalCode
   */
  ExternalCode?: string | null;

  /**
   * Height
   */
  Height: number;

  /**
   * Id
   */
  Id: number;

  /**
   * Islive
   */
  Islive: boolean;

  /**
   * IsolationVolume
   */
  IsolationVolume: number;

  /**
   * Length
   */
  Length: number;

  /**
   * LgmJobFk
   */
  LgmJobFk: number;

  /**
   * LingQuantity
   */
  LingQuantity: number;

  /**
   * LocationFk
   */
  LocationFk?: number | null;

  /**
   * PlanQuantity
   */
  PlanQuantity: number;

  /**
   * PpsItemFk
   */
  PpsItemFk: number;

  /**
   * PpsProductFormdataEntities
   */
  PpsProductFormdataEntities?: IPpsProductFormdataEntity[] | null;

  /**
   * PpsProductStatusFk
   */
  PpsProductStatusFk: number;

  /**
   * PpsProductdescriptionFk
   */
  PpsProductdescriptionFk: number;

  /**
   * PpsProductionSetFk
   */
  PpsProductionSetFk?: number | null;

  /**
   * Productiontime
   */
  Productiontime?: Date | string | null;

  /**
   * TrsProductBundleFk
   */
  TrsProductBundleFk?: number | null;

  /**
   * Unitprice
   */
  Unitprice: number;

  /**
   * UomAreaFk
   */
  UomAreaFk: number;

  /**
   * UomBillFk
   */
  UomBillFk: number;

  /**
   * UomHeightFk
   */
  UomHeightFk: number;

  /**
   * UomLengthFk
   */
  UomLengthFk: number;

  /**
   * UomPlanFk
   */
  UomPlanFk: number;

  /**
   * UomVolumeFk
   */
  UomVolumeFk: number;

  /**
   * UomWeightFk
   */
  UomWeightFk: number;

  /**
   * UomWidthFk
   */
  UomWidthFk: number;

  /**
   * Userdefined1
   */
  Userdefined1?: string | null;

  /**
   * Userdefined2
   */
  Userdefined2?: string | null;

  /**
   * Userdefined3
   */
  Userdefined3?: string | null;

  /**
   * Userdefined4
   */
  Userdefined4?: string | null;

  /**
   * Userdefined5
   */
  Userdefined5?: string | null;

  /**
   * Volume
   */
  Volume: number;

  /**
   * Volume2
   */
  Volume2: number;

  /**
   * Volume3
   */
  Volume3: number;

  /**
   * Weight
   */
  Weight: number;

  /**
   * Weight2
   */
  Weight2: number;

  /**
   * Weight3
   */
  Weight3: number;

  /**
   * Width
   */
  Width: number;
}
