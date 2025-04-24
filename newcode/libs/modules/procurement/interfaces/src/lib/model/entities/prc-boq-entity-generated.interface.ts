/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcHeaderEntity } from './prc-header-entity.interface';

export interface IPrcBoqEntityGenerated  {

  /**
   * BoqHeaderFk
   */
  BoqHeaderFk: number;

  /**
   * Code
   */
  Code: string;

  /**
   * Id
   */
  Id: number;

  /**
   * MdcControllingunitFk
   */
  MdcControllingunitFk?: number | null;

  /**
   * PackageFk
   */
  PackageFk: number;

  /**
   * PrcHeaderEntity
   */
  PrcHeaderEntity?: IPrcHeaderEntity | null;

  /**
   * PrcHeaderFk
   */
  PrcHeaderFk: number;

  /**
   * PrcItemstatusFk
   */
  PrcItemstatusFk?: number | null;
}
