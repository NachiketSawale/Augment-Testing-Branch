/*
 * Copyright(c) RIB Software GmbH
 */

import { IConHeaderEntity } from '@libs/procurement/interfaces';


export interface IContractTerminationResultGenerated {

  /**
   * ChangeOrderContract
   */
  ChangeOrderContract?: IConHeaderEntity | null;

  /**
   * Contract
   */
  Contract?: IConHeaderEntity | null;

  /**
   * Requisition
   */
  // Requisition?: IIRequistionHeaderData | null;
}
