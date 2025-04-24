/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IMdcMaterial2basUomEntityGenerated extends IEntityBase {

  /**
   * BasUomFk
   */
  BasUomFk: number;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefaultForInternalDelivery
   */
  IsDefaultForInternalDelivery: boolean;

  /**
   * MdcMaterialFk
   */
  MdcMaterialFk: number;

  /**
   * Quantity
   */
  Quantity: number;
}
