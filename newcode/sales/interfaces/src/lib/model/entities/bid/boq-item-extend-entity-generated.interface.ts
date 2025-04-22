/*
 * Copyright(c) RIB Software GmbH
 */

import { IBoqItemExtendEntity } from './boq-item-extend-entity.interface';
import { IDescriptionInfo } from '@libs/platform/common';

export interface IBoqItemExtendEntityGenerated {

  /**
   * BasUomFk
   */
  BasUomFk: number;

  /**
   * BoqHeaderFk
   */
  BoqHeaderFk: number;

  /**
   * BoqItemExtendDtos
   */
  BoqItemExtendDtos?: IBoqItemExtendEntity[] | null;

  /**
   * BoqItemFk
   */
  BoqItemFk?: number | null;

  /**
   * BoqLineTypeFk
   */
  BoqLineTypeFk: number;

  /**
   * BriefInfo
   */
  BriefInfo?: IDescriptionInfo | null;

  /**
   * Finalprice
   */
  Finalprice: number;

  /**
   * Id
   */
  Id: number;

  /**
   * Price
   */
  Price: number;

  /**
   * Quantity
   */
  Quantity: number;

  /**
   * ReadOnly
   */
  ReadOnly: boolean;

  /**
   * Reference
   */
  Reference?: string | null;
}
