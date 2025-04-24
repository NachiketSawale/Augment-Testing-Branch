/*
 * Copyright(c) RIB Software GmbH
 */

import { IBusinesspartnerEntity } from './businesspartner-entity.interface';
import { IContactEntity } from './contact-entity.interface';
import { IOrdHeaderEntity } from './ord-header-entity.interface';
import { IProjectEntity } from './project-entity.interface';
import { IWipHeaderFormDataEntity } from './wip-header-form-data-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IWipHeaderEntityGenerated extends IEntityBase {

  /**
   * BusinesspartnerEntity
   */
  BusinesspartnerEntity?: IBusinesspartnerEntity | null;

  /**
   * BusinesspartnerFk
   */
  BusinesspartnerFk?: number | null;

  /**
   * ClerkFk
   */
  ClerkFk: number;

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
  CompanyFk: number;

  /**
   * CompanyResponsibleFk
   */
  CompanyResponsibleFk: number;

  /**
   * ContactEntity
   */
  ContactEntity?: IContactEntity | null;

  /**
   * ContactFk
   */
  ContactFk?: number | null;

  /**
   * CurrencyFk
   */
  CurrencyFk: number;

  /**
   * CustomerFk
   */
  CustomerFk?: number | null;

  /**
   * DateEffective
   */
  DateEffective: Date | string;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DescriptionTr
   */
  DescriptionTr?: number | null;

  /**
   * DocumentDate
   */
  DocumentDate?: Date | string | null;

  /**
   * Exchangerate
   */
  Exchangerate: number;

  /**
   * Id
   */
  Id: number;

  /**
   * Isbilled
   */
  Isbilled: boolean;

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
   * MdcTaxCodeFk
   */
  MdcTaxCodeFk: number;

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
  OrdHeaderFk: number;

  /**
   * PaymentTermFiFk
   */
  PaymentTermFiFk?: number | null;

  /**
   * PaymentTermPaFk
   */
  PaymentTermPaFk?: number | null;

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
   * WipHeaderFormdataEntities
   */
  WipHeaderFormdataEntities?: IWipHeaderFormDataEntity[] | null;

  /**
   * WipStatusFk
   */
  WipStatusFk: number;

  /**
   * WipValue
   */
  WipValue: number;

  /**
   * WipValueOc
   */
  WipValueOc: number;

  /**
   * WipVat
   */
  WipVat: number;

  /**
   * WipVatOc
   */
  WipVatOc: number;
}
