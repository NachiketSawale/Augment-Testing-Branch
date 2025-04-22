/*
 * Copyright(c) RIB Software GmbH
 */

import { IOrdHeaderCreationEntity } from './ord-header-creation-entity.interface';

export interface IDeepCopyOptionsGenerated {

  /**
   * copyIdentifiers
   */
  copyIdentifiers?: string[] | null;

  /**
   * creationData
   */
  creationData?: IOrdHeaderCreationEntity | null;

  /**
   * entityId
   */
  entityId: number;
}
