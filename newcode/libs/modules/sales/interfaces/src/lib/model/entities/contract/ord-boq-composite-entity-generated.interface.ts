/*
 * Copyright(c) RIB Software GmbH
 */

import { IBoqHeaderEntity, IBoqItemEntity } from '@libs/boq/interfaces';
import { IOrdBoqEntity } from './ord-boq-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IOrdBoqCompositeEntityGenerated extends IEntityBase {

  /**
   * BoqHeader
   */
  BoqHeader: IBoqHeaderEntity;

  /**
   * BoqRootItem
   */
  BoqRootItem: IBoqItemEntity;

  /**
   * Id
   */
  readonly Id: number;

  /**
   * OrdBoq
   */
  OrdBoq?: IOrdBoqEntity | null;
}
