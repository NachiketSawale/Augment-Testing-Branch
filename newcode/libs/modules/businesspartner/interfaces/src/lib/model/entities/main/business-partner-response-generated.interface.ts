/*
 * Copyright(c) RIB Software GmbH
 */
import { ILegalFormEntity } from './legal-form-entity.interface';
import { IBusinessPartnerEntity } from './business-partner-entity.interface';
import { BusinessPartnerStatusEntity } from '../lookup/businesspartner-status-entity.class';
import { ClerkEntity, CompanyEntity, IFilterResponse, ILookupDescriptorEntity } from '@libs/basics/shared';

export interface IBusinessPartnerResponseGenerated {

  /**
   * AllUniqueColumns
   */
  AllUniqueColumns?: string[] | null;

  /**
   * BusinessPartnerStatus
   */
  BusinessPartnerStatus?: BusinessPartnerStatusEntity[] | null;

  /**
   * BusinessPartnerStatusCreateRight
   */
  BusinessPartnerStatusCreateRight?: BusinessPartnerStatusEntity[] | null;

  /**
   * BusinessPartnerStatusDeleteRight
   */
  BusinessPartnerStatusDeleteRight?: BusinessPartnerStatusEntity[] | null;

  /**
   * BusinessPartnerStatusEditRight
   */
  BusinessPartnerStatusEditRight?: BusinessPartnerStatusEntity[] | null;

  /**
   * BusinessPartnerStatusEditRightToCustomer
   */
  BusinessPartnerStatusEditRightToCustomer?: BusinessPartnerStatusEntity[] | null;

  /**
   * BusinessPartnerStatusEditRightToSupplier
   */
  BusinessPartnerStatusEditRightToSupplier?: BusinessPartnerStatusEntity[] | null;

  /**
   * Clerk
   */
  Clerk?: ClerkEntity[] | null;

  /**
   * Company
   */
  Company?: CompanyEntity[] | null;

  /**
   * CustomerBranche
   */
  CustomerBranche?: ILookupDescriptorEntity[] | null;

  /**
   * Customer_Status
   */
  Customer_Status?: ILookupDescriptorEntity[] | null;

  /**
   * DoesBpDuplicateCheckEmail
   */
  DoesBpDuplicateCheckEmail: boolean;

  /**
   * FilterResult
   */
  FilterResult?: IFilterResponse | null;

  /**
   * LegalForm
   */
  LegalForm?: ILegalFormEntity[] | null;

  /**
   * Main
   */
  Main?: IBusinessPartnerEntity[] | null;
}
