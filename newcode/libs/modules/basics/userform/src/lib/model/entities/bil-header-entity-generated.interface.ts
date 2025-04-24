/*
 * Copyright(c) RIB Software GmbH
 */

import { IBusinesspartnerEntity } from './businesspartner-entity.interface';
import { IContactEntity } from './contact-entity.interface';
import { IBilHeaderFormDataEntity } from './bil-header-form-data-entity.interface';
import { IOrdHeaderEntity } from './ord-header-entity.interface';
import { IProjectEntity } from './project-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IBilHeaderEntityGenerated extends IEntityBase {

  /**
   * AmountGross
   */
  AmountGross: number;

  /**
   * AmountGrossOc
   */
  AmountGrossOc: number;

  /**
   * AmountNet
   */
  AmountNet: number;

  /**
   * AmountNetOc
   */
  AmountNetOc: number;

  /**
   * BankFk
   */
  BankFk?: number | null;

  /**
   * BlobsBillToPartyFk
   */
  BlobsBillToPartyFk?: number | null;

  /**
   * BlobsFooterFk
   */
  BlobsFooterFk?: number | null;

  /**
   * BlobsHeaderFk
   */
  BlobsHeaderFk?: number | null;

  /**
   * BlobsReferenceFk
   */
  BlobsReferenceFk?: number | null;

  /**
   * BlobsSalutationFk
   */
  BlobsSalutationFk?: number | null;

  /**
   * BlobsSubjectFk
   */
  BlobsSubjectFk?: number | null;

  /**
   * BookingText
   */
  BookingText?: string | null;

  /**
   * BusinesspartnerBilltoFk
   */
  BusinesspartnerBilltoFk?: number | null;

  /**
   * BusinesspartnerEntity
   */
  BusinesspartnerEntity?: IBusinesspartnerEntity | null;

  /**
   * BusinesspartnerEntity_BusinesspartnerBilltoFk
   */
  BusinesspartnerEntity_BusinesspartnerBilltoFk?: IBusinesspartnerEntity | null;

  /**
   * BusinesspartnerFk
   */
  BusinesspartnerFk: number;

  /**
   * CancellationDate
   */
  CancellationDate?: Date | string | null;

  /**
   * CancellationNo
   */
  CancellationNo?: string | null;

  /**
   * CancellationReason
   */
  CancellationReason?: string | null;

  /**
   * ChangeFk
   */
  ChangeFk?: number | null;

  /**
   * ClerkFk
   */
  ClerkFk: number;

  /**
   * ClobsBillToPartyFk
   */
  ClobsBillToPartyFk?: number | null;

  /**
   * ClobsFooterFk
   */
  ClobsFooterFk?: number | null;

  /**
   * ClobsHeaderFk
   */
  ClobsHeaderFk?: number | null;

  /**
   * ClobsReferenceFk
   */
  ClobsReferenceFk?: number | null;

  /**
   * ClobsSalutationFk
   */
  ClobsSalutationFk?: number | null;

  /**
   * ClobsSubjectFk
   */
  ClobsSubjectFk?: number | null;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * CompanyResponsibleFk
   */
  CompanyResponsibleFk: number;

  /**
   * ContactBilltoFk
   */
  ContactBilltoFk?: number | null;

  /**
   * ContactEntity_ContactBilltoFk
   */
  ContactEntity_ContactBilltoFk?: IContactEntity | null;

  /**
   * ContactEntity_ContactFk
   */
  ContactEntity_ContactFk?: IContactEntity | null;

  /**
   * ContactFk
   */
  ContactFk?: number | null;

  /**
   * ContractTypeFk
   */
  ContractTypeFk: number;

  /**
   * CurrencyFk
   */
  CurrencyFk: number;

  /**
   * CustomerFk
   */
  CustomerFk: number;

  /**
   * DateDiscount
   */
  DateDiscount?: Date | string | null;

  /**
   * DateEffective
   */
  DateEffective: Date | string;

  /**
   * DateNetpayable
   */
  DateNetpayable?: Date | string | null;

  /**
   * DatePosted
   */
  DatePosted?: Date | string | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DescriptionTr
   */
  DescriptionTr?: number | null;

  /**
   * Exchangerate
   */
  Exchangerate: number;

  /**
   * HeaderFormdataEntities
   */
  HeaderFormdataEntities?: IBilHeaderFormDataEntity[] | null;

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
   * LDate
   */
  LDate?: Date | string | null;

  /**
   * LNo
   */
  LNo: string;

  /**
   * LanguageFk
   */
  LanguageFk: number;

  /**
   * MdcBillingSchemaFk
   */
  MdcBillingSchemaFk: number;

  /**
   * MdcControllingunitFk
   */
  MdcControllingunitFk?: number | null;

  /**
   * MdcTaxcodeFk
   */
  MdcTaxcodeFk: number;

  /**
   * ObjUnitFk
   */
  ObjUnitFk?: number | null;

  /**
   * OrdHeaderEntity
   */
  OrdHeaderEntity?: IOrdHeaderEntity | null;

  /**
   * OrdHeaderFk
   */
  OrdHeaderFk?: number | null;

  /**
   * PaymentTermFiFk
   */
  PaymentTermFiFk: number;

  /**
   * PaymentTermPaFk
   */
  PaymentTermPaFk: number;

  /**
   * Performedfrom
   */
  Performedfrom?: Date | string | null;

  /**
   * Performedto
   */
  Performedto?: Date | string | null;

  /**
   * PrcStructureFk
   */
  PrcStructureFk?: number | null;

  /**
   * ProjectEntity
   */
  ProjectEntity?: IProjectEntity | null;

  /**
   * ProjectFk
   */
  ProjectFk: number;

  /**
   * ReferenceStructured
   */
  ReferenceStructured?: string | null;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * RubricCategoryFk
   */
  RubricCategoryFk: number;

  /**
   * SearchPattern
   */
  SearchPattern?: string | null;

  /**
   * StatusFk
   */
  StatusFk: number;

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
   * Userdefineddate01
   */
  Userdefineddate01?: Date | string | null;

  /**
   * Userdefineddate02
   */
  Userdefineddate02?: Date | string | null;

  /**
   * Userdefineddate03
   */
  Userdefineddate03?: Date | string | null;

  /**
   * Userdefineddate04
   */
  Userdefineddate04?: Date | string | null;

  /**
   * Userdefineddate05
   */
  Userdefineddate05?: Date | string | null;

  /**
   * VatgroupFk
   */
  VatgroupFk?: number | null;

  /**
   * VoucherTypeFk
   */
  VoucherTypeFk: number;
}
