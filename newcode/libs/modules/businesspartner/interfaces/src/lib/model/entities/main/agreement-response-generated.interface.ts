/*
 * Copyright(c) RIB Software GmbH
 */

import { IAgreementEntity } from './agreement-entity.interface';

export interface IAgreementResponseGenerated {

  /**
   * DocumentType
   * todo - not sure where this entity comes from
   */
  //DocumentType?: IDocumentTypeEntity[] | null;

  /**
   * Main
   */
  Main?: IAgreementEntity[] | null;
}
