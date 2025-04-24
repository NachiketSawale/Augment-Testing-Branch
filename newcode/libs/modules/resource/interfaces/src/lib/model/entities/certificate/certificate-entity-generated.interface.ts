/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface ICertificateEntityGenerated extends IEntityBase {

/*
 * BusinessPartnerFk
 */
  BusinessPartnerFk?: number | null;

/*
 * CertificateStatusFk
 */
  CertificateStatusFk?: number | null;

/*
 * CertificateTypeFk
 */
  CertificateTypeFk?: number | null;

/*
 * ClerkFk
 */
  ClerkFk?: number | null;

/*
 * Comment
 */
  Comment?: string | null;

/*
 * CompanyFk
 */
  CompanyFk?: number | null;

/*
 * ContactFk
 */
  ContactFk?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * DivisionFk
 */
  DivisionFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * Remark
 */
  Remark?: string | null;

/*
 * SupplierFk
 */
  SupplierFk?: number | null;

/*
 * UserDefinedDate01
 */
  UserDefinedDate01?: string | null;

/*
 * UserDefinedDate02
 */
  UserDefinedDate02?: string | null;

/*
 * UserDefinedDate03
 */
  UserDefinedDate03?: string | null;

/*
 * UserDefinedDate04
 */
  UserDefinedDate04?: string | null;

/*
 * UserDefinedDate05
 */
  UserDefinedDate05?: string | null;

/*
 * UserDefinedNumber01
 */
  UserDefinedNumber01?: number | null;

/*
 * UserDefinedNumber02
 */
  UserDefinedNumber02?: number | null;

/*
 * UserDefinedNumber03
 */
  UserDefinedNumber03?: number | null;

/*
 * UserDefinedNumber04
 */
  UserDefinedNumber04?: number | null;

/*
 * UserDefinedNumber05
 */
  UserDefinedNumber05?: number | null;

/*
 * UserDefinedText01
 */
  UserDefinedText01?: string | null;

/*
 * UserDefinedText02
 */
  UserDefinedText02?: string | null;

/*
 * UserDefinedText03
 */
  UserDefinedText03?: string | null;

/*
 * UserDefinedText04
 */
  UserDefinedText04?: string | null;

/*
 * UserDefinedText05
 */
  UserDefinedText05?: string | null;

/*
 * ValidFrom
 */
  ValidFrom?: string | null;

/*
 * ValidTo
 */
  ValidTo?: string | null;
}
