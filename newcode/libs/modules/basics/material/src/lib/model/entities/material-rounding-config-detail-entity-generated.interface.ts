/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IMaterialRoundingConfigDetailEntityGenerated extends IEntityBase {

  /**
   * ColumnId
   */
  ColumnId: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IsWithoutRounding
   */
  IsWithoutRounding: boolean;

  /**
   * MaterialRoundingConfigFk
   */
  MaterialRoundingConfigFk: number;

  /**
   * RoundTo
   */
  RoundTo: number;

  /**
   * RoundToFk
   */
  RoundToFk?: number | null;

  /**
   * RoundingMethodFk
   */
  RoundingMethodFk?: number | null;

  /**
   * Sorting
   */
  Sorting: number;

  /**
   * UiDisplayTo
   */
  UiDisplayTo: number;
}
