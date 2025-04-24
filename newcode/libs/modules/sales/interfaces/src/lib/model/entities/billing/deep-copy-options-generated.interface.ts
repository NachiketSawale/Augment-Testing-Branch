/*
 * Copyright(c) RIB Software GmbH
 */

import { IBilHeaderCreationEntity } from './bil-header-creation-entity.interface';

export interface IDeepCopyOptionsGenerated {

  /**
   * copyIdentifiers
   */
  copyIdentifiers?: string[] | null;

  /**
   * creationData
   */
  creationData?: IBilHeaderCreationEntity | null;

  /**
   * entityId
   */
  entityId: number;
}
