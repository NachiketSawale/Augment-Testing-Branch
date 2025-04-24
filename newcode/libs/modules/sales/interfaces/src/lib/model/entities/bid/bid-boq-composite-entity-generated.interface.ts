/*
 * Copyright(c) RIB Software GmbH
 */

import { IBoqHeaderEntity, IBoqItemEntity } from '@libs/boq/interfaces';
import { IBidBoqEntity } from './bid-boq-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IBidBoqCompositeEntityGenerated extends IEntityBase {

  /**
   * BidBoq
   */
  BidBoq?: IBidBoqEntity | null;

  /**
   * BoqHeader
   */
  //BoqHeader?: IBoqHeaderEntity | null; //todo - generated from dto - Type 'IBidBoqCompositeEntity' does not satisfy the constraint 'IBoqCompositeEntity'.
  BoqHeader: IBoqHeaderEntity;

  /**
   * BoqRootItem
   */
  //BoqRootItem?: IBoqItemEntity | null; //todo - generated from dto - Type 'IBidBoqCompositeEntity' does not satisfy the constraint 'IBoqCompositeEntity'.
  BoqRootItem: IBoqItemEntity;
  
  /**
   * Id
   */
  Id: number;
}
