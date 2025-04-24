/*
 * Copyright(c) RIB Software GmbH
 */

import { IBusinesspartnerEntity } from './businesspartner-entity.interface';
import { ILgmJobCardEntity } from './lgm-job-card-entity.interface';
import { IResRequisitionEntity } from './res-requisition-entity.interface';
import { IResReservationEntity } from './res-reservation-entity.interface';
import { IResResourceFormdataEntity } from './res-resource-formdata-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IResResourceEntityGenerated extends IEntityBase {

  /**
   * BusinesspartnerEntity
   */
  BusinesspartnerEntity?: IBusinesspartnerEntity | null;

  /**
   * BusinesspartnerFk
   */
  BusinesspartnerFk?: number | null;

  /**
   * CalCalendarFk
   */
  CalCalendarFk?: number | null;

  /**
   * Capacity
   */
  Capacity: number;

  /**
   * ClerkFk
   */
  ClerkFk?: number | null;

  /**
   * Code
   */
  Code: string;

  /**
   * CompanyFk
   */
  CompanyFk?: number | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DescriptionTr
   */
  DescriptionTr?: number | null;

  /**
   * ExternalCode
   */
  ExternalCode?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * Islive
   */
  Islive: boolean;

  /**
   * LgmDispatcherGroupFk
   */
  LgmDispatcherGroupFk?: number | null;

  /**
   * LgmJobCardEntities
   */
  LgmJobCardEntities?: ILgmJobCardEntity[] | null;

  /**
   * PrcItemFk
   */
  PrcItemFk?: number | null;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * ResGroupFk
   */
  ResGroupFk: number;

  /**
   * ResKindFk
   */
  ResKindFk: number;

  /**
   * ResRequisitionEntities
   */
  ResRequisitionEntities?: IResRequisitionEntity[] | null;

  /**
   * ResReservationEntities
   */
  ResReservationEntities?: IResReservationEntity[] | null;

  /**
   * ResResourceFormdataEntities
   */
  ResResourceFormdataEntities?: IResResourceFormdataEntity[] | null;

  /**
   * ResTypeFk
   */
  ResTypeFk: number;

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
  SiteFk: number;

  /**
   * Sortcode
   */
  Sortcode?: string | null;

  /**
   * UomBasisFk
   */
  UomBasisFk: number;

  /**
   * UomTimeFk
   */
  UomTimeFk?: number | null;

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
