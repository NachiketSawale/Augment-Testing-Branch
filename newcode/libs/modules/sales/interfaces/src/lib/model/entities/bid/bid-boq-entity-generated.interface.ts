/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityBase } from '@libs/platform/common';
import { IBidHeaderEntity } from './bid-header-entity.interface';

export interface IBidBoqEntityGenerated extends IEntityBase {

  /**
   * BidHeaderEntity
   */
  BidHeaderEntity?: IBidHeaderEntity | null;

  /**
   * BidHeaderFk
   */
  BidHeaderFk: number;

  /**
   * BoqHeaderFk
   */
  BoqHeaderFk: number;

  /**
   * Id
   */
  Id: number;
}
