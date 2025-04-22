/*
 * Copyright(c) RIB Software GmbH
 */

export interface IOutlookRecipientEntityGenerated {

  /**
   * AddressLine
   */
  AddressLine?: string | null;

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk: number;

  /**
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * ContactRoleFk
   */
  ContactRoleFk?: number | null;

  /**
   * Department
   */
  Department?: string | null;

  /**
   * Email
   */
  Email?: string | null;

  /**
   * FullName
   */
  FullName?: string | null;

  /**
   * LastName
   */
  LastName?: string | null;

  /**
   * OriginalId
   */
  OriginalId: number;

  /**
   * Salutation
   */
  Salutation?: string | null;

  /**
   * SubsidiaryFk
   */
  SubsidiaryFk?: number | null;

  /**
   * TitleFk
   */
  TitleFk?: number | null;
}
