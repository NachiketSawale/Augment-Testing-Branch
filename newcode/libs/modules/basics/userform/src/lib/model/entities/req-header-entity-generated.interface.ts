/*
 * Copyright(c) RIB Software GmbH
 */

import { IBusinesspartnerEntity } from './businesspartner-entity.interface';
import { IPrcPackageEntity } from './prc-package-entity.interface';
import { IProjectEntity } from './project-entity.interface';
import { IReqHeaderEntity } from './req-header-entity.interface';
import { IReqHeaderFormDataEntity } from './req-header-form-data-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IReqHeaderEntityGenerated extends IEntityBase {

  /**
   * AddressFk
   */
  AddressFk?: number | null;

  /**
   * BusinesspartnerEntity
   */
  BusinesspartnerEntity?: IBusinesspartnerEntity | null;

  /**
   * BusinesspartnerFk
   */
  BusinesspartnerFk?: number | null;

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
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * CurrencyFk
   */
  CurrencyFk: number;

  /**
   * DateCanceled
   */
  DateCanceled?: Date | string | null;

  /**
   * DateEffective
   */
  DateEffective: Date | string;

  /**
   * DateReceived
   */
  DateReceived: Date | string;

  /**
   * DateRequired
   */
  DateRequired?: Date | string | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * Exchangerate
   */
  Exchangerate: number;

  /**
   * Haschanges
   */
  Haschanges: boolean;

  /**
   * Id
   */
  Id: number;

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
   * PrcAwardmethodFk
   */
  PrcAwardmethodFk: number;

  /**
   * PrcContracttypeFk
   */
  PrcContracttypeFk: number;

  /**
   * PrcHeaderFk
   */
  PrcHeaderFk: number;

  /**
   * PrcIncotrmFk
   */
  PrcIncotrmFk?: number | null;

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
   * Remark
   */
  Remark?: string | null;

  /**
   * ReqHeaderEntities_ReqHeaderFk
   */
  ReqHeaderEntities_ReqHeaderFk?: IReqHeaderEntity[] | null;

  /**
   * ReqHeaderEntity_ReqHeaderFk
   */
  ReqHeaderEntity_ReqHeaderFk?: IReqHeaderEntity | null;

  /**
   * ReqHeaderFk
   */
  ReqHeaderFk?: number | null;

  /**
   * ReqHeaderFormdataEntities
   */
  ReqHeaderFormdataEntities?: IReqHeaderFormDataEntity[] | null;

  /**
   * ReqStatusFk
   */
  ReqStatusFk: number;

  /**
   * ReqTypeFk
   */
  ReqTypeFk: number;

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
