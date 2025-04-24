/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ICosObjectTemplateEntityBase extends IEntityBase {

  /**
   * CosHeaderFk
   */
  CosHeaderFk: number;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * Height
   */
  Height: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IsComposite
   */
  IsComposite: boolean;

  /**
   * LicCostGroup1Fk
   */
  LicCostGroup1Fk?: number | null;

  /**
   * LicCostGroup2Fk
   */
  LicCostGroup2Fk?: number | null;

  /**
   * LicCostGroup3Fk
   */
  LicCostGroup3Fk?: number | null;

  /**
   * LicCostGroup4Fk
   */
  LicCostGroup4Fk?: number | null;

  /**
   * LicCostGroup5Fk
   */
  LicCostGroup5Fk?: number | null;

  /**
   * MdlDimensionTypeFk
   */
  MdlDimensionTypeFk: number;

  /**
   * MdlObjectTextureNegFk
   */
  MdlObjectTextureNegFk: number;

  /**
   * MdlObjectTexturePosFk
   */
  MdlObjectTexturePosFk: number;

  /**
   * Multiplier
   */
  Multiplier: number;

  /**
   * NegativeColor
   */
  NegativeColor: number;

  /**
   * Offset
   */
  Offset: number;

  /**
   * PositiveColor
   */
  PositiveColor: number;
}
