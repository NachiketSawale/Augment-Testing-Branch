/*
 * Copyright(c) RIB Software GmbH
 */

import { IBusinesspartnerEntity } from './businesspartner-entity.interface';
import { IConHeaderEntity } from './con-header-entity.interface';
import { IHsqChecklistEntity } from './hsq-checklist-entity.interface';
import { IInvHeaderEntity } from './inv-header-entity.interface';
import { IPesHeaderFormDataEntity } from './pes-header-form-data-entity.interface';
import { IPrcPackageEntity } from './prc-package-entity.interface';
import { IProjectEntity } from './project-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IPesHeaderEntityGenerated extends IEntityBase {

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
  ClerkPrcFk: number;

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
   * ConHeaderEntity
   */
  ConHeaderEntity?: IConHeaderEntity | null;

  /**
   * ConHeaderFk
   */
  ConHeaderFk?: number | null;

  /**
   * CurrencyFk
   */
  CurrencyFk: number;

  /**
   * DateDelivered
   */
  DateDelivered: Date | string;

  /**
   * DateDeliveredfrom
   */
  DateDeliveredfrom?: Date | string | null;

  /**
   * DateEffective
   */
  DateEffective: Date | string;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DocumentDate
   */
  DocumentDate?: Date | string | null;

  /**
   * Exchangerate
   */
  Exchangerate: number;

  /**
   * HsqChecklistEntities
   */
  HsqChecklistEntities?: IHsqChecklistEntity[] | null;

  /**
   * Id
   */
  Id: number;

  /**
   * InvHeaderEntities
   */
  InvHeaderEntities?: IInvHeaderEntity[] | null;

  /**
   * Isnotaccrual
   */
  Isnotaccrual: boolean;

  /**
   * MdcBillingSchemaFk
   */
  MdcBillingSchemaFk?: number | null;

  /**
   * MdcControllingunitFk
   */
  MdcControllingunitFk?: number | null;

  /**
   * PesHeaderFormdataEntities
   */
  PesHeaderFormdataEntities?: IPesHeaderFormDataEntity[] | null;

  /**
   * PesShipmentinfoFk
   */
  PesShipmentinfoFk?: number | null;

  /**
   * PesStatusFk
   */
  PesStatusFk: number;

  /**
   * PesValue
   */
  PesValue: number;

  /**
   * PesValueOc
   */
  PesValueOc: number;

  /**
   * PesVat
   */
  PesVat: number;

  /**
   * PesVatOc
   */
  PesVatOc: number;

  /**
   * PrcConfigurationFk
   */
  PrcConfigurationFk: number;

  /**
   * PrcPackageEntity
   */
  PrcPackageEntity?: IPrcPackageEntity | null;

  /**
   * PrcPackageFk
   */
  PrcPackageFk?: number | null;

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
  ProjectFk?: number | null;

  /**
   * Remark
   */
  Remark?: string | null;

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
