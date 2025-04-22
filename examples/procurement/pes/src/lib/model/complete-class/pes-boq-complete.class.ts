/*
 * Copyright(c) RIB Software GmbH
 */

import { IBoqItemEntity } from '@libs/boq/interfaces';
import { CompleteIdentification } from '@libs/platform/common';
import { IPesBoqEntity } from '../entities/pes-boq-entity.interface';

export class PesBoqComplete implements CompleteIdentification<IPesBoqEntity>{

  /**
   * BoqItemToDelete
   */
  public BoqItemToDelete?: IBoqItemEntity[] | null = [];

  /**
   * BoqItemToSave
   */
  // public BoqItemToSave?: BoqItemComplete[] | null = [];

  /**
   * EntitiesCount
   */
  public EntitiesCount: number = 0;

  /**
   * MainItemId
   */
  public MainItemId: number = 0;

  /**
   * PesBoq
   */
  public PesBoq?: IPesBoqEntity | null;

  /**
   * PriceChangedInfoMap
   */
  // public PriceChangedInfoMap?: {[key: string]: IEntityPriceChangedInfo} | null = [];
}
