/*
 * Copyright(c) RIB Software GmbH
 */

import { IBoqHeaderEntity, IBoqItemEntity } from '@libs/boq/interfaces';
import { IBilBoqEntity } from './bil-boq-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IBilBoqCompositeEntityGenerated extends IEntityBase {

  /**
   * BilBoq
   */
  BilBoq?: IBilBoqEntity | null;

  /**
   * BoqHeader
   */
  BoqHeader?: IBoqHeaderEntity | null;

  /**
   * BoqRootItem
   */
  BoqRootItem?: IBoqItemEntity | null;

  /**
   * Id
   */
  Id: number;
}
