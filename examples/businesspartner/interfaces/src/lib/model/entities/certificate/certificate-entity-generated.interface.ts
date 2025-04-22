/*
 * Copyright(c) RIB Software GmbH
 */

import { ICertificate2subsidiaryEntity } from './certificate-2-subsidiary-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface ICertificateEntityGenerated extends IEntityBase {

  /**
   * Amount
   */
  Amount?: number | null;

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk: number;

  /**
   * BusinessPartnerIssuerFk
   */
  BusinessPartnerIssuerFk?: number | null;

  /**
   * Certificate2subsidiaryEntities
   */
  Certificate2subsidiaryEntities?: ICertificate2subsidiaryEntity[] | null;

  /**
   * CertificateDate
   */
  CertificateDate?: Date | string | null;

  /**
   * CertificateStatusFk
   */
  CertificateStatusFk: number;

  /**
   * CertificateTypeFk
   */
  CertificateTypeFk: number;

  /**
   * Code
   */
  Code: string;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * CompanyFk
   */
  CompanyFk?: number | null;

  /**
   * ConHeaderFk
   */
  ConHeaderFk?: number | null;

  /**
   * CostReimbursable
   */
  CostReimbursable: boolean;

  /**
   * CostReimbursedDate
   */
  CostReimbursedDate?: Date | string | null;

  /**
   * CurrencyFk
   */
  CurrencyFk?: number | null;

  /**
   * DischargedDate
   */
  DischargedDate?: Date | string | null;

  /**
   * ExpirationDate
   */
  ExpirationDate?: Date | string | null;

  /**
   * GuaranteeCost
   */
  GuaranteeCost: number;

  /**
   * GuaranteeCostPercent
   */
  GuaranteeCostPercent: number;

  /**
   * Id
   */
  Id: number;

  /**
   * Islimited
   */
  Islimited: boolean;

  /**
   * Issuer
   */
  Issuer?: string | null;

  /**
   * OrdHeaderFk
   */
  OrdHeaderFk?: number | null;

  /**
   * ProjectFk
   */
  ProjectFk?: number | null;

  /**
   * ReclaimDate1
   */
  ReclaimDate1?: Date | string | null;

  /**
   * ReclaimDate2
   */
  ReclaimDate2?: Date | string | null;

  /**
   * ReclaimDate3
   */
  ReclaimDate3?: Date | string | null;

  /**
   * Reference
   */
  Reference?: string | null;

  /**
   * ReferenceDate
   */
  ReferenceDate?: Date | string | null;

  /**
   * RequiredDate
   */
  RequiredDate?: Date | string | null;

  /**
   * SearchPattern
   */
  SearchPattern?: string | null;

  /**
   * SubsidiaryFk
   */
  SubsidiaryFk?: number | null;

  /**
   * Userdefined1
   */
  Userdefined1?: string | null;

  /**
   * Userdefined2
   */
  Userdefined2?: string | null;

  /**
   * Userdefined3
   */
  Userdefined3?: string | null;

  /**
   * Userdefined4
   */
  Userdefined4?: string | null;

  /**
   * Userdefined5
   */
  Userdefined5?: string | null;

  /**
   * ValidFrom
   */
  ValidFrom?: Date | string | null;

  /**
   * ValidTo
   */
  ValidTo?: Date | string | null;

  /**
   * ValidatedDate
   */
  ValidatedDate?: Date | string | null;
}
