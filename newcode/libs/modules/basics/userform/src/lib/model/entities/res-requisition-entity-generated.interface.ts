/*
 * Copyright(c) RIB Software GmbH
 */

import { ILgmJobCardEntity } from './lgm-job-card-entity.interface';
import { ILgmJobEntity } from './lgm-job-entity.interface';
import { IProjectEntity } from './project-entity.interface';
import { IPsdActivityEntity } from './psd-activity-entity.interface';
import { IResRequisitionEntity } from './res-requisition-entity.interface';
import { IResRequisitionFormdataEntity } from './res-requisition-formdata-entity.interface';
import { IResReservationEntity } from './res-reservation-entity.interface';
import { IResResourceEntity } from './res-resource-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IResRequisitionEntityGenerated extends IEntityBase {

  /**
   * ClerkownerFk
   */
  ClerkownerFk?: number | null;

  /**
   * ClerkresponsibleFk
   */
  ClerkresponsibleFk?: number | null;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * Islinkedfixtoreservation
   */
  Islinkedfixtoreservation: boolean;

  /**
   * LgmJobCardEntities
   */
  LgmJobCardEntities?: ILgmJobCardEntity[] | null;

  /**
   * LgmJobEntity_LgmJobFk
   */
  LgmJobEntity_LgmJobFk?: ILgmJobEntity | null;

  /**
   * LgmJobEntity_LgmJobpreferredFk
   */
  LgmJobEntity_LgmJobpreferredFk?: ILgmJobEntity | null;

  /**
   * LgmJobFk
   */
  LgmJobFk: number;

  /**
   * LgmJobpreferredFk
   */
  LgmJobpreferredFk?: number | null;

  /**
   * MdcMaterialFk
   */
  MdcMaterialFk?: number | null;

  /**
   * PpsEventFk
   */
  PpsEventFk?: number | null;

  /**
   * ProjectEntity
   */
  ProjectEntity?: IProjectEntity | null;

  /**
   * ProjectFk
   */
  ProjectFk: number;

  /**
   * PsdActivityEntity
   */
  PsdActivityEntity?: IPsdActivityEntity | null;

  /**
   * PsdActivityFk
   */
  PsdActivityFk?: number | null;

  /**
   * Quantity
   */
  Quantity: number;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * RequestedFrom
   */
  RequestedFrom: Date | string;

  /**
   * RequestedTo
   */
  RequestedTo: Date | string;

  /**
   * ResRequisitionEntities_ResRequisitionFk
   */
  ResRequisitionEntities_ResRequisitionFk?: IResRequisitionEntity[] | null;

  /**
   * ResRequisitionEntity_ResRequisitionFk
   */
  ResRequisitionEntity_ResRequisitionFk?: IResRequisitionEntity | null;

  /**
   * ResRequisitionFk
   */
  ResRequisitionFk?: number | null;

  /**
   * ResRequisitionFormdataEntities
   */
  ResRequisitionFormdataEntities?: IResRequisitionFormdataEntity[] | null;

  /**
   * ResRequisitionTypeFk
   */
  ResRequisitionTypeFk?: number | null;

  /**
   * ResRequisitiongroupFk
   */
  ResRequisitiongroupFk?: number | null;

  /**
   * ResRequisitionpriorityFk
   */
  ResRequisitionpriorityFk?: number | null;

  /**
   * ResRequisitionstatusFk
   */
  ResRequisitionstatusFk: number;

  /**
   * ResReservationEntities
   */
  ResReservationEntities?: IResReservationEntity[] | null;

  /**
   * ResResourceEntity
   */
  ResResourceEntity?: IResResourceEntity | null;

  /**
   * ResResourceFk
   */
  ResResourceFk?: number | null;

  /**
   * ResTypeFk
   */
  ResTypeFk?: number | null;

  /**
   * ReservationId
   */
  ReservationId?: number | null;

  /**
   * ReservedFrom
   */
  ReservedFrom?: Date | string | null;

  /**
   * ReservedTo
   */
  ReservedTo?: Date | string | null;

  /**
   * ResourceContextFk
   */
  ResourceContextFk?: number | null;

  /**
   * SearchPattern
   */
  SearchPattern?: string | null;

  /**
   * SiteFk
   */
  SiteFk?: number | null;

  /**
   * StockFk
   */
  StockFk?: number | null;

  /**
   * TrsRequisitionFk
   */
  TrsRequisitionFk?: number | null;

  /**
   * UomFk
   */
  UomFk: number;

  /**
   * Userdefinedtext01
   */
  Userdefinedtext01?: string | null;

  /**
   * Userdefinedtext02
   */
  Userdefinedtext02?: string | null;

  /**
   * Userdefinedtext03
   */
  Userdefinedtext03?: string | null;

  /**
   * Userdefinedtext04
   */
  Userdefinedtext04?: string | null;

  /**
   * Userdefinedtext05
   */
  Userdefinedtext05?: string | null;
}
