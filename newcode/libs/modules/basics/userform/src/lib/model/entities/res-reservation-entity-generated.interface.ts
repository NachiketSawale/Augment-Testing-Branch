/*
 * Copyright(c) RIB Software GmbH
 */

import { ILgmJobCardEntity } from './lgm-job-card-entity.interface';
import { ILgmJobEntity } from './lgm-job-entity.interface';
import { IProjectEntity } from './project-entity.interface';
import { IResRequisitionEntity } from './res-requisition-entity.interface';
import { IResReservationFormdataEntity } from './res-reservation-formdata-entity.interface';
import { IResResourceEntity } from './res-resource-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IResReservationEntityGenerated extends IEntityBase {

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
   * Instructionsofdriver
   */
  Instructionsofdriver?: string | null;

  /**
   * Isworkonweekend
   */
  Isworkonweekend: boolean;

  /**
   * LgmJobCardEntities
   */
  LgmJobCardEntities?: ILgmJobCardEntity[] | null;

  /**
   * LgmJobEntity
   */
  LgmJobEntity?: ILgmJobEntity | null;

  /**
   * LgmJobFk
   */
  LgmJobFk: number;

  /**
   * PrcItemFk
   */
  PrcItemFk?: number | null;

  /**
   * ProjectEntity
   */
  ProjectEntity?: IProjectEntity | null;

  /**
   * ProjectFk
   */
  ProjectFk: number;

  /**
   * Quantity
   */
  Quantity: number;

  /**
   * ResRequisitionEntity
   */
  ResRequisitionEntity?: IResRequisitionEntity | null;

  /**
   * ResRequisitionFk
   */
  ResRequisitionFk: number;

  /**
   * ResReservationFormdataEntities
   */
  ResReservationFormdataEntities?: IResReservationFormdataEntity[] | null;

  /**
   * ResReservationstatusFk
   */
  ResReservationstatusFk: number;

  /**
   * ResReservationtypeFk
   */
  ResReservationtypeFk?: number | null;

  /**
   * ResResourceEntity
   */
  ResResourceEntity?: IResResourceEntity | null;

  /**
   * ResResourceFk
   */
  ResResourceFk: number;

  /**
   * ReservedFrom
   */
  ReservedFrom: Date | string;

  /**
   * ReservedTo
   */
  ReservedTo: Date | string;

  /**
   * ResourceContextFk
   */
  ResourceContextFk?: number | null;

  /**
   * SearchPattern
   */
  SearchPattern?: string | null;

  /**
   * UomFk
   */
  UomFk: number;

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
