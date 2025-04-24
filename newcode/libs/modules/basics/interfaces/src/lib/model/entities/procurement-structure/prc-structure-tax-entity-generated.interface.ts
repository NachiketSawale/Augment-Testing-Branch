/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPrcStructureTaxEntityGenerated extends IEntityBase {

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * MdcLedgerContextFk
   */
  MdcLedgerContextFk: number;

  /**
   * MdcSalesTaxGroupFk
   */
  MdcSalesTaxGroupFk?: number | null;

  /**
   * MdcTaxCodeFk
   */
  MdcTaxCodeFk?: number | null;

  /**
   * PrcStructureFk
   */
  PrcStructureFk: number;
}
