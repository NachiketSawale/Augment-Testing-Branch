/*
 * Copyright(c) RIB Software GmbH
 */

import { IInvoiceTypeEntity } from './invoice-type-entity.interface';
import { IVoucherTypeEntity } from './voucher-type-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface ICategoryDefaultsEntityGenerated extends IEntityBase {

  /**
   * Id
   */
  Id: number;

  /**
   * InvoiceTypeEntity
   */
  InvoiceTypeEntity?: IInvoiceTypeEntity | null;

  /**
   * InvoiceTypeFk
   */
  InvoiceTypeFk: number;

  /**
   * RubricCategoryFk
   */
  RubricCategoryFk: number;

  /**
   * VoucherTypeEntity
   */
  VoucherTypeEntity?: IVoucherTypeEntity | null;

  /**
   * VoucherTypeFk
   */
  VoucherTypeFk: number;
}
