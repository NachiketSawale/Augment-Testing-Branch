/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IEngHeaderEntityGenerated extends IEntityBase {

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
   * EngStatusFk
   */
  EngStatusFk: number;

  /**
   * EngTypeFk
   */
  EngTypeFk: number;

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
  LgmJobFk?: number | null;

  /**
   * ModelFk
   */
  ModelFk?: number | null;

  /**
   * ProjectFk
   */
  ProjectFk: number;

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
