/*
 * Copyright(c) RIB Software GmbH
 */

import { IConHeaderEntity } from '@libs/procurement/interfaces';


export interface ICheckAndUpdateContractRequestGenerated {

  /**
   * ChangeResult
   */
  // ChangeResult?: IConCheckChangeResult | null;

  /**
   * Contract
   */
  Contract?: IConHeaderEntity | null;
}
