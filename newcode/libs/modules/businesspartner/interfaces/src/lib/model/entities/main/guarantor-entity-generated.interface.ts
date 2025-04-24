/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IBusinessPartnerEntity } from './business-partner-entity.interface';

export interface IGuarantorEntityGenerated extends IEntityBase {

  /**
   * AmountCalledOff
   */
  AmountCalledOff?: number | null;

  /**
   * AmountMaximum
   */
  AmountMaximum?: number | null;

  /**
   * AmountMaximumText
   */
  AmountMaximumText?: string | null;

  /**
   * AmountRemaining
   */
  AmountRemaining?: number | null;

  /**
   * BpdIssuerbusinesspartnerFk
   */
  BpdIssuerbusinesspartnerFk?: number | null;

  /**
   * BusinessPartnerEntity
   */
  BusinessPartnerEntity?: IBusinessPartnerEntity | null;

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk: number;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * CompanyFk
   */
  CompanyFk?: number | null;

  /**
   * CreditLine
   */
  CreditLine: number;

  /**
   * CurrencyFk
   */
  CurrencyFk: number;

  /**
   * Date
   */
  Date?: Date | string | null;

  /**
   * DischargedDate
   */
  DischargedDate?: Date | string | null;

  /**
   * ExpirationDate
   */
  ExpirationDate?: Date | string | null;

  /**
   * GuaranteeEndDate
   */
  GuaranteeEndDate?: Date | string | null;

  /**
   * GuaranteeFee
   */
  GuaranteeFee: number;

  /**
   * GuaranteeFeeMinimum
   */
  GuaranteeFeeMinimum: number;

  /**
   * GuaranteePercent
   */
  GuaranteePercent: number;

  /**
   * GuaranteeStartDate
   */
  GuaranteeStartDate?: Date | string | null;

  /**
   * GuaranteeType1
   */
  GuaranteeType1: boolean;

  /**
   * GuaranteeType2
   */
  GuaranteeType2: boolean;

  /**
   * GuaranteeType3
   */
  GuaranteeType3: boolean;

  /**
   * GuaranteeType4
   */
  GuaranteeType4: boolean;

  /**
   * GuaranteeType5
   */
  GuaranteeType5: boolean;

  /**
   * GuaranteeTypeFk
   */
  GuaranteeTypeFk?: number | null;

  /**
   * GuarantorActive
   */
  GuarantorActive?: boolean | null;

  /**
   * GuarantorTypeFk
   */
  GuarantorTypeFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * Issuer
   */
  Issuer?: string | null;

  /**
   * RequiredDate
   */
  RequiredDate?: Date | string | null;

  /**
   * RhythmFk
   */
  RhythmFk: number;

  /**
   * UserDefined1
   */
  UserDefined1?: string | null;

  /**
   * UserDefined2
   */
  UserDefined2?: string | null;

  /**
   * UserDefined3
   */
  UserDefined3?: string | null;

  /**
   * UserDefined4
   */
  UserDefined4?: string | null;

  /**
   * UserDefined5
   */
  UserDefined5?: string | null;

  /**
   * ValidatedDate
   */
  ValidatedDate?: Date | string | null;

  /**
   * Validfrom
   */
  Validfrom?: Date | string | null;

  /**
   * Validto
   */
  Validto?: Date | string | null;
}
