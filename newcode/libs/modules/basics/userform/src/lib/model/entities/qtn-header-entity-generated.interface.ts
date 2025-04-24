/*
 * Copyright(c) RIB Software GmbH
 */

import { IBusinesspartnerEntity } from './businesspartner-entity.interface';
import { IProjectEntity } from './project-entity.interface';
import { IQtnHeaderEntity } from './qtn-header-entity.interface';
import { IQtnHeaderFormDataEntity } from './qtn-header-form-data-entity.interface';
import { IRfqHeaderEntity } from './rfq-header-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IQtnHeaderEntityGenerated extends IEntityBase {

  /**
   * BusinesspartnerEntity
   */
  BusinesspartnerEntity?: IBusinesspartnerEntity | null;

  /**
   * BusinesspartnerFk
   */
  BusinesspartnerFk: number;

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
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * CurrencyFk
   */
  CurrencyFk: number;

  /**
   * DateEffective
   */
  DateEffective: Date | string;

  /**
   * DatePricefixing
   */
  DatePricefixing?: Date | string | null;

  /**
   * DateQuoted
   */
  DateQuoted: Date | string;

  /**
   * DateReceived
   */
  DateReceived?: Date | string | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * EvaluationFk
   */
  EvaluationFk?: number | null;

  /**
   * Exchangerate
   */
  Exchangerate: number;

  /**
   * Id
   */
  Id: number;

  /**
   * Isexcluded
   */
  Isexcluded: boolean;

  /**
   * Isidealbidder
   */
  Isidealbidder: boolean;

  /**
   * Isshortlisted
   */
  Isshortlisted: boolean;

  /**
   * Isvalidated
   */
  Isvalidated: boolean;

  /**
   * MdcBillingSchemaFk
   */
  MdcBillingSchemaFk?: number | null;

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
   * PrcIncotermFk
   */
  PrcIncotermFk?: number | null;

  /**
   * ProjectEntity
   */
  ProjectEntity?: IProjectEntity | null;

  /**
   * ProjectFk
   */
  ProjectFk?: number | null;

  /**
   * QtnHeaderEntities_QtnHeaderFk
   */
  QtnHeaderEntities_QtnHeaderFk?: IQtnHeaderEntity[] | null;

  /**
   * QtnHeaderEntity_QtnHeaderFk
   */
  QtnHeaderEntity_QtnHeaderFk?: IQtnHeaderEntity | null;

  /**
   * QtnHeaderFk
   */
  QtnHeaderFk?: number | null;

  /**
   * QtnHeaderFormdataEntities
   */
  QtnHeaderFormdataEntities?: IQtnHeaderFormDataEntity[] | null;

  /**
   * QtnStatusFk
   */
  QtnStatusFk: number;

  /**
   * QtnTypeFk
   */
  QtnTypeFk: number;

  /**
   * QtnVersion
   */
  QtnVersion: number;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * RfqHeaderEntity
   */
  RfqHeaderEntity?: IRfqHeaderEntity | null;

  /**
   * RfqHeaderFk
   */
  RfqHeaderFk: number;

  /**
   * SearchPattern
   */
  SearchPattern?: string | null;

  /**
   * SubsidiaryFk
   */
  SubsidiaryFk?: number | null;

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
