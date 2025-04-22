/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcHeaderEntity } from './prc-header-entity.interface';
import { IWarrantyObligationEntity } from './warranty-obligation-entity.interface';
import { IWarrantySecurityEntity } from './warranty-security-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IPrcWarrantyEntityGenerated extends IEntityBase {

  /**
   * BasWarrantyobligationFk
   */
  BasWarrantyobligationFk: number;

  /**
   * BasWarrantysecurityFk
   */
  BasWarrantysecurityFk: number;

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
  HandoverDate: string;

  /**
   * Id
   */
  Id: number;

  /**
   * PrcHeaderEntity
   */
  PrcHeaderEntity?: IPrcHeaderEntity | null;

  /**
   * PrcHeaderFk
   */
  PrcHeaderFk: number;

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
  WarrantyEnddate: string;

  /**
   * WarrantyobligationEntity
   */
  WarrantyobligationEntity?: IWarrantyObligationEntity | null;

  /**
   * WarrantysecurityEntity
   */
  WarrantysecurityEntity?: IWarrantySecurityEntity | null;
}
