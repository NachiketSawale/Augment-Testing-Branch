/*
 * Copyright(c) RIB Software GmbH
 */

import { IEngTaskFormdataEntity } from './eng-task-formdata-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IEngTaskEntityGenerated extends IEntityBase {

  /**
   * ClerkFk
   */
  ClerkFk: number;

  /**
   * Code
   */
  Code: string;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * EngDrawingFk
   */
  EngDrawingFk?: number | null;

  /**
   * EngHeaderFk
   */
  EngHeaderFk: number;

  /**
   * EngTaskFormdataEntities
   */
  EngTaskFormdataEntities?: IEngTaskFormdataEntity[] | null;

  /**
   * EngTaskStatusFk
   */
  EngTaskStatusFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * Islive
   */
  Islive: boolean;

  /**
   * PpsEventFk
   */
  PpsEventFk: number;

  /**
   * Remark
   */
  Remark?: string | null;

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
}
