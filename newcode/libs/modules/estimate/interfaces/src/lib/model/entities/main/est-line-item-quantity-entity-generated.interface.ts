/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IEstLineItemEntity } from './estimate-line-item-base-entity.interface';

export interface IEstLineItemQuantityEntityGenerated extends IEntityBase {
  /*
   * BilHeaderFk
   */
  BilHeaderFk?: number | null;

  /*
   * BoqHeaderFk
   */
  BoqHeaderFk?: number | null;

  /*
   * BoqItemFk
   */
  BoqItemFk?: number | null;

  /*
   * Comment
   */
  Comment?: string | null;

  /*
   * Date
   */
  Date?: string | null;

  /*
   * EstHeaderFk
   */
  EstHeaderFk: number;

  /*
   * EstLineItemEntity
   */
  EstLineItemEntity?: IEstLineItemEntity | null;

  /*
   * EstLineItemFk
   */
  EstLineItemFk: number;

  /*
   * Id
   */
  Id: number;

  /*
   * IsCalculated
   */
  IsCalculated: boolean;

  /*
   * MdlModelFk
   */
  MdlModelFk?: number | null;

  /*
   * PesHeaderFk
   */
  PesHeaderFk?: number | null;

  /*
   * PsdActivityFk
   */
  PsdActivityFk?: number | null;

  /*
   * Quantity
   */
  Quantity: number;

  /*
   * QuantityExternal
   */
  QuantityExternal: number;

  /*
   * QuantityTypeFk
   */
  QuantityTypeFk: number;

  /*
   * WipHeaderFk
   */
  WipHeaderFk?: number | null;

  /*
   * TargetQuantityValue
   */
  TargetQuantityValue: number;

  /*
   * TargetQuantityTypeFk
   */
  TargetQuantityTypeFk: number;

  /*
   * Factor
   */
  Factor: number;

  /*
   * LineItems
   */
  LineItems?: IEstLineItemEntity[] | null;

  /*
   * SelectedLineItem
   */
  SelectedLineItem?: IEstLineItemEntity | null;

  /*
   * ProjectId
   */
  ProjectId: number;

  /*
   * IsSchedule
   */
  IsSchedule: boolean;

  /*
   * IsWip
   */
  IsWip: boolean;

  /*
   * IsPes
   */
  IsPes: boolean;
}
