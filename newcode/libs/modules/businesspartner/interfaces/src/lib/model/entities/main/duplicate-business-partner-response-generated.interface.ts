/*
 * Copyright(c) RIB Software GmbH
 */

import { IBusinessPartnerEntity } from './business-partner-entity.interface';

export interface IDuplicateBusinessPartnerResponseGenerated {

  /**
   * Items
   */
  Items?: IBusinessPartnerEntity[] | null;

  /**
   * RecordsFound
   */
  RecordsFound: number;

  /**
   * RecordsRetrieved
   */
  RecordsRetrieved: number;
}
