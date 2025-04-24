/*
 * Copyright(c) RIB Software GmbH
 */

import { IBilHeaderEntity } from './bil-header-entity.interface';

export interface ICreateXBillRequestGenerated {

  /**
   * AdditionalDocuments
   * todo - not sure where this entity comes from
   */
  //AdditionalDocuments?: IAdditionalDocumentData[] | null;

  /**
   * BillHeader
   */
  BillHeader?: IBilHeaderEntity | null;
}
