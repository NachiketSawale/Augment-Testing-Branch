/*
 * Copyright(c) RIB Software GmbH
 */

import { IItemArray } from './item-array.interface';

export interface ISubmitContractRequestGenerated {

  /**
   * CompanyCode
   */
  CompanyCode?: string | null;

  /**
   * ContractExternalCode
   */
  ContractExternalCode?: string | null;

  /**
   * IsSubmitItem
   */
  IsSubmitItem: boolean;

  /**
   * ItemArray
   */
  ItemArray?: IItemArray[] | null;
}
