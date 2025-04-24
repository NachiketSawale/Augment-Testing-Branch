/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IMdcProductDescriptionEntityGenerated extends IEntityBase {

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
   * BasUomAreaFk
   */
  BasUomAreaFk: number;

  /**
   * BasUomHeightFk
   */
  BasUomHeightFk: number;

  /**
   * BasUomLengthFk
   */
  BasUomLengthFk: number;

  /**
   * BasUomVolumeFk
   */
  BasUomVolumeFk: number;

  /**
   * BasUomWeightFk
   */
  BasUomWeightFk: number;

  /**
   * BasUomWidthFk
   */
  BasUomWidthFk: number;

  /**
   * ClobsFk
   */
  ClobsFk?: number | null;

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
   * EngDrawingFk
   */
  EngDrawingFk: number;

  /**
   * Height
   */
  Height: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * IsolationVolume
   */
  IsolationVolume: number;

  /**
   * Length
   */
  Length: number;

  /**
   * MaterialFk
   */
  MaterialFk: number;

  /**
   * PpsFormulaInstanceFk
   */
  PpsFormulaInstanceFk?: number | null;

  /**
   * ProcessTemplateFk
   */
  ProcessTemplateFk?: number | null;

  /**
   * UomFk
   */
  UomFk: number;

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
