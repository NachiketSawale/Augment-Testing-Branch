/*
 * Copyright(c) RIB Software GmbH
 */

import { ICharacteristicGroup2CompanyEntity } from '@libs/basics/interfaces';
import { ICompanyEntity } from './company-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface ICompanyEntityGenerated extends IEntityBase {

  /**
   * AddressFk
   */
  AddressFk?: number | null;

  /**
   * BlobsFk
   */
  BlobsFk?: number | null;

  /**
   * CalCalendarFk
   */
  CalCalendarFk?: number | null;

  /**
   * CharacteristicGroup2CompanyEntities
   */
  CharacteristicGroup2CompanyEntities?: ICharacteristicGroup2CompanyEntity[] | null;

  /**
   * Checked
   */
  Checked: boolean;

  /**
   * ClerkFk
   */
  ClerkFk?: number | null;

  /**
   * Code
   */
  Code: string;

  /**
   * Companies
   */
  Companies?: ICompanyEntity[] | null;

  /**
   * CompanyFk
   */
  CompanyFk?: number | null;

  /**
   * CompanyName
   */
  CompanyName?: string | null;

  /**
   * CompanyName2
   */
  CompanyName2?: string | null;

  /**
   * CompanyName3
   */
  CompanyName3?: string | null;

  /**
   * CompanyTypeFk
   */
  CompanyTypeFk: number;

  /**
   * ContextFk
   */
  ContextFk?: number | null;

  /**
   * CountryFk
   */
  CountryFk: number;

  /**
   * CurrencyFk
   */
  CurrencyFk: number;

  /**
   * Email
   */
  Email?: string | null;

  /**
   * HasChildren
   */
  HasChildren: boolean;

  /**
   * Id
   */
  Id: number;

  /**
   * Internet
   */
  Internet?: string | null;

  /**
   * Islive
   */
  Islive: boolean;

  /**
   * LanguageFk
   */
  LanguageFk: number;

  /**
   * LgcPriceconditionFk
   */
  LgcPriceconditionFk?: number | null;

  /**
   * LoginAllowed
   */
  LoginAllowed: boolean;

  /**
   * MdcBillingSchemaFk
   */
  MdcBillingSchemaFk?: number | null;

  /**
   * MdcContextFk
   */
  MdcContextFk: number;

  /**
   * MdcLedgerContextFk
   */
  MdcLedgerContextFk: number;

  /**
   * MdcLineitemcontextFk
   */
  MdcLineitemcontextFk: number;

  /**
   * MdcTaxCodeFk
   */
  MdcTaxCodeFk?: number | null;

  /**
   * ModuleContextFk
   */
  ModuleContextFk: number;

  /**
   * PaymentTermFiFk
   */
  PaymentTermFiFk?: number | null;

  /**
   * PaymentTermPaFk
   */
  PaymentTermPaFk?: number | null;

  /**
   * Profitcenter
   */
  Profitcenter?: string | null;

  /**
   * SchedulingContextFk
   */
  SchedulingContextFk?: number | null;

  /**
   * SearchPattern
   */
  SearchPattern?: string | null;

  /**
   * Signatory
   */
  Signatory?: string | null;

  /**
   * SubledgerContextFk
   */
  SubledgerContextFk: number;

  /**
   * TelefaxPattern
   */
  TelefaxPattern?: string | null;

  /**
   * TelephoneNumberFk
   */
  TelephoneNumberFk?: number | null;

  /**
   * TelephonePattern
   */
  TelephonePattern?: string | null;

  /**
   * TelephoneTelefaxFk
   */
  TelephoneTelefaxFk?: number | null;

  /**
   * TextModuleContextFk
   */
  TextModuleContextFk: number;

  /**
   * Validfrom
   */
  Validfrom?: Date | string | null;

  /**
   * Validto
   */
  Validto?: Date | string | null;
}
