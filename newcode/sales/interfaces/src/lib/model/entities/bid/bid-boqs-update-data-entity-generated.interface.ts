/*
 * Copyright(c) RIB Software GmbH
 */

import { IBidBoqsCreationDataEntity } from './bid-boqs-creation-data-entity.interface';
import { IBidHeaderCreationEntity } from './bid-header-creation-entity.interface';

export interface IBidBoqsUpdateDataEntityGenerated {

  /**
   * BidHeaderCreationData
   */
  BidHeaderCreationData?: IBidHeaderCreationEntity | null;

  /**
   * CreationData
   */
  CreationData?: IBidBoqsCreationDataEntity | null;
}
