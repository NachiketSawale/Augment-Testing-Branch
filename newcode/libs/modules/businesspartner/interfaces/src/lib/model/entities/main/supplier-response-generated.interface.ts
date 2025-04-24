/*
 * Copyright(c) RIB Software GmbH
 */

import { ISupplierEntity } from './supplier-entity.interface';
import { ISupplierLedgerGroupEntity } from './supplier-ledger-group-entity.interface';

export interface ISupplierResponseGenerated {

  /**
   * BillingSchema
   * todo - not sure how to handle IInt32[]
   */
  //BillingSchema?: IInt32[] | null;

  /**
   * Main
   */
  Main?: ISupplierEntity[] | null;

  /**
   * SupplierLedgerGroup
   */
  SupplierLedgerGroup?: ISupplierLedgerGroupEntity[] | null;
}
