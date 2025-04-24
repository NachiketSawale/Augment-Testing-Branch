/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPrcConfiguration2BSchemaEntityGenerated extends IEntityBase {

  /**
   * BillingSchemaFk
   */
  BillingSchemaFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefault
   */
  IsDefault?: boolean | null;

  /**
   * LedgerContextFk
   */
  LedgerContextFk: number;

  /**
   * PrcConfigHeaderFk
   */
  PrcConfigHeaderFk: number;
}
