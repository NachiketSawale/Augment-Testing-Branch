/*
 * Copyright(c) RIB Software GmbH
 */

import { IPesItemEntity } from './pes-item-entity.interface';

export interface IItemsCopyParameterGenerated {

  /**
   * CachedItemIds
   */
  CachedItemIds?: number[] | null;

  /**
   * MaxItemNo
   */
  MaxItemNo: number;

  /**
   * PesItemDtos
   */
  PesItemDtos?: IPesItemEntity[] | null;
}
