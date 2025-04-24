/*
 * Copyright(c) RIB Software GmbH
 */

import { ITimekeepingSettlementItemEntity } from './timekeeping-settlement-item-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface ITimekeepingSettlementEntityGenerated extends IEntityBase {

  /**
   * BookingText
   */
  BookingText?: string | null;

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk?: number | null;

  /**
   * ClerkFk
   */
  ClerkFk: number;

  /**
   * CompanyChargedFk
   */
  CompanyChargedFk: number;

  /**
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * CurrencyFk
   */
  CurrencyFk: number;

  /**
   * CustomerFk
   */
  CustomerFk?: number | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * DivisionFk
   */
  DivisionFk: number;

  /**
   * ExchangeRate
   */
  ExchangeRate: number;

  /**
   * Id
   */
  Id: number;

  /**
   * InvoiceTypeFk
   */
  InvoiceTypeFk: number;

  /**
   * Iscanceled
   */
  Iscanceled: boolean;

  /**
   * JobTypeFk
   */
  JobTypeFk: number;

  /**
   * LanguageFk
   */
  LanguageFk: number;

  /**
   * Number
   */
  Number: string;

  /**
   * PaymentTermFk
   */
  PaymentTermFk: number;

  /**
   * PerformeFrom
   */
  PerformeFrom?: Date | string | null;

  /**
   * PerformeTo
   */
  PerformeTo?: Date | string | null;

  /**
   * PeriodFk
   */
  PeriodFk: number;

  /**
   * PostingDate
   */
  PostingDate?: Date | string | null;

  /**
   * ProjectFk
   */
  ProjectFk: number;

  /**
   * SettlementDate
   */
  SettlementDate?: Date | string | null;

  /**
   * SettlementNo
   */
  SettlementNo: string;

  /**
   * SettlementRecipientNo
   */
  SettlementRecipientNo?: string | null;

  /**
   * SettlementStatusFK
   */
  SettlementStatusFK: number;

  /**
   * SubsidiaryFk
   */
  SubsidiaryFk?: number | null;

  /**
   * SupplierFk
   */
  SupplierFk?: number | null;

  /**
   * TaxCodeFk
   */
  TaxCodeFk: number;

  /**
   * TksSettlementitemEntities
   */
  TksSettlementitemEntities?: ITimekeepingSettlementItemEntity[] | null;

  /**
   * VatGroupFk
   */
  VatGroupFk?: number | null;

  /**
   * VoucherTypeFk
   */
  VoucherTypeFk: number;
}
