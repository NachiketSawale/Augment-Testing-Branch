/*
 * Copyright(c) RIB Software GmbH
 */

import { IBusinesspartnerEntity } from './businesspartner-entity.interface';
import { IConHeaderEntity } from './con-header-entity.interface';
import { IEstLineItemEntity } from './est-line-item-entity.interface';
import { IInvHeaderEntity } from './inv-header-entity.interface';
import { IPesHeaderEntity } from './pes-header-entity.interface';
import { IPrcPackageFormDataEntity } from './prc-package-form-data-entity.interface';
import { IProjectEntity } from './project-entity.interface';
import { IReqHeaderEntity } from './req-header-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IPrcPackageEntityGenerated extends IEntityBase {

  /**
   * ActualEnd
   */
  ActualEnd?: Date | string | null;

  /**
   * ActualStart
   */
  ActualStart?: Date | string | null;

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
   * CashprojectionFk
   */
  CashprojectionFk?: number | null;

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
   * ConHeaderEntities
   */
  ConHeaderEntities?: IConHeaderEntity[] | null;

  /**
   * CurrencyFk
   */
  CurrencyFk: number;

  /**
   * DateEffective
   */
  DateEffective: Date | string;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * ElinePath
   */
  ElinePath?: string | null;

  /**
   * ElinePhase
   */
  ElinePhase?: number | null;

  /**
   * ElineUpdate
   */
  ElineUpdate?: Date | string | null;

  /**
   * EstLineItemEntities
   */
  EstLineItemEntities?: IEstLineItemEntity[] | null;

  /**
   * Exchangerate
   */
  Exchangerate: number;

  /**
   * Id
   */
  Id: number;

  /**
   * InvHeaderEntities
   */
  InvHeaderEntities?: IInvHeaderEntity[] | null;

  /**
   * Islive
   */
  Islive: boolean;

  /**
   * MdcAssetMasterFk
   */
  MdcAssetMasterFk?: number | null;

  /**
   * MdcTaxCodeFk
   */
  MdcTaxCodeFk: number;

  /**
   * PesHeaderEntities
   */
  PesHeaderEntities?: IPesHeaderEntity[] | null;

  /**
   * PlannedEnd
   */
  PlannedEnd?: Date | string | null;

  /**
   * PlannedStart
   */
  PlannedStart?: Date | string | null;

  /**
   * PrcConfigurationFk
   */
  PrcConfigurationFk?: number | null;

  /**
   * PrcContracttypeFk
   */
  PrcContracttypeFk?: number | null;

  /**
   * PrcPackageFormdataEntities
   */
  PrcPackageFormdataEntities?: IPrcPackageFormDataEntity[] | null;

  /**
   * PrcPackagestatusFk
   */
  PrcPackagestatusFk: number;

  /**
   * PrcPackagetypeFk
   */
  PrcPackagetypeFk?: number | null;

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
   * PsdActivityFk
   */
  PsdActivityFk?: number | null;

  /**
   * PsdScheduleFk
   */
  PsdScheduleFk?: number | null;

  /**
   * Quantity
   */
  Quantity: number;

  /**
   * Reference
   */
  Reference?: string | null;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * Remark2
   */
  Remark2?: string | null;

  /**
   * Remark3
   */
  Remark3?: string | null;

  /**
   * ReqHeaderEntities
   */
  ReqHeaderEntities?: IReqHeaderEntity[] | null;

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
   * UomFk
   */
  UomFk: number;

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
   * Userdefineddate1
   */
  Userdefineddate1?: Date | string | null;

  /**
   * Userdefineddate2
   */
  Userdefineddate2?: Date | string | null;

  /**
   * Userdefineddate3
   */
  Userdefineddate3?: Date | string | null;

  /**
   * Userdefineddate4
   */
  Userdefineddate4?: Date | string | null;

  /**
   * Userdefineddate5
   */
  Userdefineddate5?: Date | string | null;

  /**
   * VatgroupFk
   */
  VatgroupFk?: number | null;
}
