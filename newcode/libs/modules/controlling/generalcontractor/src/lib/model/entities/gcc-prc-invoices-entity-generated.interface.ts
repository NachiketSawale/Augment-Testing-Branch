/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IGccPrcInvoicesEntityGenerated extends IEntityBase {

/*
 * AmountNet
 */
  AmountNet?: number | null;

/*
 * BpdBusinesspartnerFk
 */
  BpdBusinesspartnerFk?: number | null;

/*
 * BpdSupplierFk
 */
  BpdSupplierFk?: number | null;

/*
 * Code
 */
  Code?: string | null;

/*
 * ConHeaderFk
 */
  ConHeaderFk?: number | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * InvTypeFk
 */
  InvTypeFk?: number | null;

/*
 * InvoiceStatusFk
 */
  InvoiceStatusFk?: number | null;

/*
 * MdcControllingUnitFk
 */
  MdcControllingUnitFk?: number | null;

/*
 * PaymentDate
 */
  PaymentDate?: string | null;
}
