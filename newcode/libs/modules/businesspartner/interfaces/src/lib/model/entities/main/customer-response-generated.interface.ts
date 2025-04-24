/*
 * Copyright(c) RIB Software GmbH
 */

import { ICustomerLedgerGroupEntity } from './customer-ledger-group-entity.interface';
import { ICustomerEntity } from './customer-entity.interface';

export interface ICustomerResponseGenerated {

  /**
   * BillingSchema
   * todo - not sure how to handle IInt32[]
   */
  //BillingSchema?: IInt32[] | null;

  /**
   * BusinessUnit
   * todo - not sure how to handle IInt32[]
   */
  //BusinessUnit?: IInt32[] | null;

  /**
   * CustomerBranch
   * todo - not sure how to handle IInt32[]
   */
  //CustomerBranch?: IInt32[] | null;

  /**
   * CustomerLedgerGroup
   */
  CustomerLedgerGroup?: ICustomerLedgerGroupEntity[] | null;

  /**
   * Main
   */
  Main?: ICustomerEntity[] | null;
}
