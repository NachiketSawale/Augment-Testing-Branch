/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IBasBankEntityGenerated extends IEntityBase {

  /**
   * BankName
   */
  BankName?: string | null;

  /**
   * BasCountryFk
   */
  BasCountryFk: number;

  /**
   * Bic
   */
  Bic?: string | null;

  /**
   * City
   */
  City?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * Iso2
   */
  Iso2?: string | null;

  /**
   * SortCode
   */
  SortCode?: string | null;

  /**
   * Street
   */
  Street?: string | null;

  /**
   * ZipCode
   */
  ZipCode?: string | null;
}
