/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPesSelfBillingEntityGenerated extends IEntityBase {

  /**
   * BillDate
   */
  BillDate?: string | null;

  /**
   * Code
   */
  Code: string;

  /**
   * Comment
   */
  Comment?: string | null;

  /**
   * DeliveredDate
   */
  DeliveredDate?: string | null;

  /**
   * DeliveredFromDate
   */
  DeliveredFromDate?: string | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsProgress
   */
  IsProgress: boolean;

  /**
   * PesHeaderFk
   */
  PesHeaderFk: number;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * Responsible
   */
  Responsible?: string | null;

  /**
   * SbhStatusFk
   */
  SbhStatusFk: number;

  /**
   * TaxNo
   */
  TaxNo?: string | null;

  /**
   * UserDefinedDate1
   */
  UserDefinedDate1?: string | null;

  /**
   * UserDefinedDate2
   */
  UserDefinedDate2?: string | null;

  /**
   * UserDefinedDate3
   */
  UserDefinedDate3?: string | null;

  /**
   * UserDefinedDate4
   */
  UserDefinedDate4?: string | null;

  /**
   * UserDefinedDate5
   */
  UserDefinedDate5?: string | null;

  /**
   * UserDefinedMoney1
   */
  UserDefinedMoney1?: number | null;

  /**
   * UserDefinedMoney2
   */
  UserDefinedMoney2?: number | null;

  /**
   * UserDefinedMoney3
   */
  UserDefinedMoney3?: number | null;

  /**
   * UserDefinedMoney4
   */
  UserDefinedMoney4?: number | null;

  /**
   * UserDefinedMoney5
   */
  UserDefinedMoney5?: number | null;

  /**
   * UserDefinedText1
   */
  UserDefinedText1?: string | null;

  /**
   * UserDefinedText2
   */
  UserDefinedText2?: string | null;

  /**
   * UserDefinedText3
   */
  UserDefinedText3?: string | null;

  /**
   * UserDefinedText4
   */
  UserDefinedText4?: string | null;

  /**
   * UserDefinedText5
   */
  UserDefinedText5?: string | null;

  /**
   * VatNo
   */
  VatNo?: string | null;
}
