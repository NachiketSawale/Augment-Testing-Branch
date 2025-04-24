/*
 * Copyright(c) RIB Software GmbH
 */

import { IBidHeaderCreationEntity } from './bid-header-creation-entity.interface';

export interface IDeepCopyOptionsGenerated {

  /**
   * copyIdentifiers
   */
  copyIdentifiers?: string[] | null;

  /**
   * creationData
   */
  creationData?: IBidHeaderCreationEntity | null;

  /**
   * entityId
   */
  entityId: number;
}
