/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IBidWarrantyEntityGenerated extends IEntityBase {

  /**
   * BasWarrantyobligationFk
   */
  BasWarrantyobligationFk: number;

  /**
   * BasWarrantysecurityFk
   */
  BasWarrantysecurityFk: number;

  /**
   * BidHeaderFk
   */
  BidHeaderFk: number;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DurationMonths
   */
  DurationMonths: number;

  /**
   * HandoverDate
   */
  HandoverDate: Date | string;

  /**
   * Id
   */
  Id: number;

  /**
   * UserDefinedDate1
   */
  UserDefinedDate1?: Date | string | null;

  /**
   * UserDefinedDate2
   */
  UserDefinedDate2?: Date | string | null;

  /**
   * UserDefinedDate3
   */
  UserDefinedDate3?: Date | string | null;

  /**
   * UserDefinedDate4
   */
  UserDefinedDate4?: Date | string | null;

  /**
   * UserDefinedDate5
   */
  UserDefinedDate5?: Date | string | null;

  /**
   * UserDefinedNumber1
   */
  UserDefinedNumber1: number;

  /**
   * UserDefinedNumber2
   */
  UserDefinedNumber2: number;

  /**
   * UserDefinedNumber3
   */
  UserDefinedNumber3: number;

  /**
   * UserDefinedNumber4
   */
  UserDefinedNumber4: number;

  /**
   * UserDefinedNumber5
   */
  UserDefinedNumber5: number;

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
   * WarrantyEnddate
   */
  WarrantyEnddate: Date | string;
}
