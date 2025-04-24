/*
 * Copyright(c) RIB Software GmbH
 */

import { IResRequisitionEntity } from './res-requisition-entity.interface';
import { IResReservationEntity } from './res-reservation-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface ILgmJobEntityGenerated extends IEntityBase {

  /**
   * AddressFk
   */
  AddressFk?: number | null;

  /**
   * AddressPrjFk
   */
  AddressPrjFk?: number | null;

  /**
   * BlobsDeliveryaddrFk
   */
  BlobsDeliveryaddrFk?: number | null;

  /**
   * BusinesspartnerFk
   */
  BusinesspartnerFk?: number | null;

  /**
   * CalCalendarFk
   */
  CalCalendarFk: number;

  /**
   * ClerkOwnerFk
   */
  ClerkOwnerFk?: number | null;

  /**
   * ClerkResponsibleFk
   */
  ClerkResponsibleFk?: number | null;

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
   * ContactDeliveryaddrFk
   */
  ContactDeliveryaddrFk?: number | null;

  /**
   * CurrencyFk
   */
  CurrencyFk: number;

  /**
   * CustomerFk
   */
  CustomerFk?: number | null;

  /**
   * DeliveryaddrRemark
   */
  DeliveryaddrRemark?: string | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * EtmDivisionFk
   */
  EtmDivisionFk: number;

  /**
   * EtmPlantFk
   */
  EtmPlantFk?: number | null;

  /**
   * EtmPlantgroupFk
   */
  EtmPlantgroupFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * Islive
   */
  Islive: boolean;

  /**
   * Isprojectdefault
   */
  Isprojectdefault: boolean;

  /**
   * LastSettlementDate
   */
  LastSettlementDate?: Date | string | null;

  /**
   * LgcPriceconditionFk
   */
  LgcPriceconditionFk?: number | null;

  /**
   * LgmContextFk
   */
  LgmContextFk: number;

  /**
   * LgmJobgroupFk
   */
  LgmJobgroupFk?: number | null;

  /**
   * LgmJobstatusFk
   */
  LgmJobstatusFk: number;

  /**
   * LgmJobtypeFk
   */
  LgmJobtypeFk: number;

  /**
   * LgmSettledbytypeFk
   */
  LgmSettledbytypeFk?: number | null;

  /**
   * MdcControllingunitFk
   */
  MdcControllingunitFk?: number | null;

  /**
   * MdcCostcodePriceverFk
   */
  MdcCostcodePriceverFk?: number | null;

  /**
   * MdcPriceListFk
   */
  MdcPriceListFk?: number | null;

  /**
   * PrcIncotermFk
   */
  PrcIncotermFk?: number | null;

  /**
   * ProjectFk
   */
  ProjectFk: number;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * ResRequisitionEntities_LgmJobFk
   */
  ResRequisitionEntities_LgmJobFk?: IResRequisitionEntity[] | null;

  /**
   * ResRequisitionEntities_LgmJobpreferredFk
   */
  ResRequisitionEntities_LgmJobpreferredFk?: IResRequisitionEntity[] | null;

  /**
   * ResReservationEntities
   */
  ResReservationEntities?: IResReservationEntity[] | null;

  /**
   * RubricCategoryFk
   */
  RubricCategoryFk: number;

  /**
   * SiteFk
   */
  SiteFk?: number | null;

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
   * Validfrom
   */
  Validfrom?: Date | string | null;

  /**
   * Validto
   */
  Validto?: Date | string | null;
}
