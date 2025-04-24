/*
 * Copyright(c) RIB Software GmbH
 */

import { ClerkEntity } from '@libs/basics/shared';
import { IActivityEntity } from './activity-entity.interface';

export interface IActivityResponseGenerated {

  /**
   * Clerk
   */
  Clerk?: ClerkEntity[] | null;

  /**
   * DocumentType
   * todo - not sure where this entity comes from
   */
  //DocumentType?: IDocumentTypeEntity[] | null;

  /**
   * Main
   */
  Main?: IActivityEntity[] | null;
}
