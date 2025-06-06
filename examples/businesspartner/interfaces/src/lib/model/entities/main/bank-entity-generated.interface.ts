/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IBankEntityGenerated extends IEntityBase {

  /**
   * AccountNo
   */
  AccountNo?: string | null;

  /**
   * BankFk
   */
  BankFk?: number | null;

  /**
   * BankIbanWithName
   */
  BankIbanWithName?: string | null;

  /**
   * BankName
   */
  BankName?: string | null;

  /**
   * BankTypeFk
   */
  BankTypeFk: number;

  /**
   * BpdBankStatusFk
   */
  BpdBankStatusFk: number;

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk: number;

  /**
   * CompanyFk
   */
  CompanyFk?: number | null;

  /**
   * CountryFk
   */
  CountryFk: number;

  /**
   * Iban
   */
  Iban?: string | null;

  /**
   * IbanNameOrBicAccountName
   */
  IbanNameOrBicAccountName?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * IsDefaultCustomer
   */
  IsDefaultCustomer: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

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
}
