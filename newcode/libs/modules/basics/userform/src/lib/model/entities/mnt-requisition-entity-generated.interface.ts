/*
 * Copyright(c) RIB Software GmbH
 */

import { IMntRequisitionFormdataEntity } from './mnt-requisition-formdata-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IMntRequisitionEntityGenerated extends IEntityBase {

  /**
   * ClerkFk
   */
  ClerkFk: number;

  /**
   * Code
   */
  Code: string;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * EndDate
   */
  EndDate: Date | string;

  /**
   * Id
   */
  Id: number;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * LgmJobFk
   */
  LgmJobFk: number;

  /**
   * MntReqStatusFk
   */
  MntReqStatusFk: number;

  /**
   * MntRequisitionFormdataEntities
   */
  MntRequisitionFormdataEntities?: IMntRequisitionFormdataEntity[] | null;

  /**
   * PpsHeaderFk
   */
  PpsHeaderFk: number;

  /**
   * ProjectFk
   */
  ProjectFk: number;

  /**
   * Remarks
   */
  Remarks?: string | null;

  /**
   * StartDate
   */
  StartDate: Date | string;

  /**
   * UserDefined1
   */
  UserDefined1?: string | null;

  /**
   * UserDefined2
   */
  UserDefined2?: string | null;

  /**
   * UserDefined3
   */
  UserDefined3?: string | null;

  /**
   * UserDefined4
   */
  UserDefined4?: string | null;

  /**
   * UserDefined5
   */
  UserDefined5?: string | null;
}
