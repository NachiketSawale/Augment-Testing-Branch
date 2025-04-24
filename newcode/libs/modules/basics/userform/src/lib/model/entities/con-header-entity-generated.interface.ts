/*
 * Copyright(c) RIB Software GmbH
 */

import { IBusinesspartnerEntity } from './businesspartner-entity.interface';
import { IConHeaderEntity } from './con-header-entity.interface';
import { IConHeaderFormDataEntity } from './con-header-form-data-entity.interface';
import { IContactEntity } from './contact-entity.interface';
import { IInvHeaderEntity } from './inv-header-entity.interface';
import { IPesHeaderEntity } from './pes-header-entity.interface';
import { IPrcPackageEntity } from './prc-package-entity.interface';
import { IProjectEntity } from './project-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IConHeaderEntityGenerated extends IEntityBase {

  /**
   * AddressFk
   */
  AddressFk?: number | null;

  /**
   * ApprovalDealdline
   */
  ApprovalDealdline?: number | null;

  /**
   * ApprovalPeriod
   */
  ApprovalPeriod?: number | null;

  /**
   * Businesspartner2Fk
   */
  Businesspartner2Fk?: number | null;

  /**
   * BusinesspartnerAgentFk
   */
  BusinesspartnerAgentFk?: number | null;

  /**
   * BusinesspartnerEntity
   */
  BusinesspartnerEntity?: IBusinesspartnerEntity | null;

  /**
   * BusinesspartnerEntity_Businesspartner2Fk
   */
  BusinesspartnerEntity_Businesspartner2Fk?: IBusinesspartnerEntity | null;

  /**
   * BusinesspartnerEntity_BusinesspartnerAgentFk
   */
  BusinesspartnerEntity_BusinesspartnerAgentFk?: IBusinesspartnerEntity | null;

  /**
   * BusinesspartnerFk
   */
  BusinesspartnerFk: number;

  /**
   * ChangeFk
   */
  ChangeFk?: number | null;

  /**
   * ClerkPrcFk
   */
  ClerkPrcFk?: number | null;

  /**
   * ClerkReqFk
   */
  ClerkReqFk?: number | null;

  /**
   * Code
   */
  Code: string;

  /**
   * CodeQuotation
   */
  CodeQuotation?: string | null;

  /**
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * CompanyInvoiceFk
   */
  CompanyInvoiceFk?: number | null;

  /**
   * ConHeaderEntities_ConHeaderFk
   */
  ConHeaderEntities_ConHeaderFk?: IConHeaderEntity[] | null;

  /**
   * ConHeaderEntity_ConHeaderFk
   */
  ConHeaderEntity_ConHeaderFk?: IConHeaderEntity | null;

  /**
   * ConHeaderFk
   */
  ConHeaderFk?: number | null;

  /**
   * ConHeaderFormdataEntities
   */
  ConHeaderFormdataEntities?: IConHeaderFormDataEntity[] | null;

  /**
   * ConStatusFk
   */
  ConStatusFk: number;

  /**
   * ConTypeFk
   */
  ConTypeFk: number;

  /**
   * ConfirmationCode
   */
  ConfirmationCode?: string | null;

  /**
   * ConfirmationDate
   */
  ConfirmationDate?: Date | string | null;

  /**
   * Contact2Fk
   */
  Contact2Fk?: number | null;

  /**
   * ContactEntity_Contact2Fk
   */
  ContactEntity_Contact2Fk?: IContactEntity | null;

  /**
   * ContactEntity_ContactFk
   */
  ContactEntity_ContactFk?: IContactEntity | null;

  /**
   * ContactFk
   */
  ContactFk?: number | null;

  /**
   * CurrencyFk
   */
  CurrencyFk: number;

  /**
   * DateCallofffrom
   */
  DateCallofffrom?: Date | string | null;

  /**
   * DateCalloffto
   */
  DateCalloffto?: Date | string | null;

  /**
   * DateCanceled
   */
  DateCanceled?: Date | string | null;

  /**
   * DateDelivery
   */
  DateDelivery?: Date | string | null;

  /**
   * DateEffective
   */
  DateEffective: Date | string;

  /**
   * DateOrdered
   */
  DateOrdered: Date | string;

  /**
   * DatePenalty
   */
  DatePenalty?: Date | string | null;

  /**
   * DateQuotation
   */
  DateQuotation?: Date | string | null;

  /**
   * DateReported
   */
  DateReported?: Date | string | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * Exchangerate
   */
  Exchangerate: number;

  /**
   * ExternalCode
   */
  ExternalCode?: string | null;

  /**
   * Haschanges
   */
  Haschanges: boolean;

  /**
   * Id
   */
  Id: number;

  /**
   * InvHeaderEntities
   */
  InvHeaderEntities?: IInvHeaderEntity[] | null;

  /**
   * MdcBillingSchemaFk
   */
  MdcBillingSchemaFk: number;

  /**
   * MdcControllingunitFk
   */
  MdcControllingunitFk?: number | null;

  /**
   * MdcMaterialCatalogFk
   */
  MdcMaterialCatalogFk?: number | null;

  /**
   * MdcTaxCodeFk
   */
  MdcTaxCodeFk: number;

  /**
   * PaymentTermAdFk
   */
  PaymentTermAdFk?: number | null;

  /**
   * PaymentTermFiFk
   */
  PaymentTermFiFk?: number | null;

  /**
   * PaymentTermPaFk
   */
  PaymentTermPaFk?: number | null;

  /**
   * PenaltyComment
   */
  PenaltyComment?: string | null;

  /**
   * PenaltyPercentmax
   */
  PenaltyPercentmax: number;

  /**
   * PenaltyPercentperday
   */
  PenaltyPercentperday: number;

  /**
   * PesHeaderEntities
   */
  PesHeaderEntities?: IPesHeaderEntity[] | null;

  /**
   * PrcAwardmethodFk
   */
  PrcAwardmethodFk: number;

  /**
   * PrcContracttypeFk
   */
  PrcContracttypeFk: number;

  /**
   * PrcCopymodeFk
   */
  PrcCopymodeFk: number;

  /**
   * PrcHeaderFk
   */
  PrcHeaderFk: number;

  /**
   * PrcIncotermFk
   */
  PrcIncotermFk?: number | null;

  /**
   * PrcPackage2headerFk
   */
  PrcPackage2headerFk?: number | null;

  /**
   * PrcPackageEntity
   */
  PrcPackageEntity?: IPrcPackageEntity | null;

  /**
   * PrcPackageFk
   */
  PrcPackageFk?: number | null;

  /**
   * ProjectEntity
   */
  ProjectEntity?: IProjectEntity | null;

  /**
   * ProjectFk
   */
  ProjectFk?: number | null;

  /**
   * ProvingDealdline
   */
  ProvingDealdline?: number | null;

  /**
   * ProvingPeriod
   */
  ProvingPeriod?: number | null;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * SearchPattern
   */
  SearchPattern?: string | null;

  /**
   * Subsidiary2Fk
   */
  Subsidiary2Fk?: number | null;

  /**
   * SubsidiaryFk
   */
  SubsidiaryFk?: number | null;

  /**
   * Supplier2Fk
   */
  Supplier2Fk?: number | null;

  /**
   * SupplierFk
   */
  SupplierFk?: number | null;

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
   * VatgroupFk
   */
  VatgroupFk?: number | null;
}
