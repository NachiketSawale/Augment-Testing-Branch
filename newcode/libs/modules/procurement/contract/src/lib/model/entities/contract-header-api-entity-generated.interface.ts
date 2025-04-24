/*
 * Copyright(c) RIB Software GmbH
 */

import { IContractItem } from './contract-item.interface';

export interface IContractHeaderApiEntityGenerated {

  /**
   * Code
   */
  Code?: string | null;

  /**
   * DeliveryDate
   */
  DeliveryDate?: string | null;

  /**
   * ExternalCode
   */
  ExternalCode?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * Items
   */
  Items?: IContractItem[] | null;
}
