/*
 * Copyright(c) RIB Software GmbH
 */

import { IPpsMaterialEntity } from './pps-material-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IPpsMaterialMappingEntityGenerated extends IEntityBase {

  /**
   * BasExternalsourceFk
   */
  BasExternalsourceFk?: number | null;

  /**
   * BasExternalsourcetypeFk
   */
  BasExternalsourcetypeFk: number;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * MappingCode
   */
  MappingCode: string;

  /**
   * PpsMaterialEntity
   */
  PpsMaterialEntity?: IPpsMaterialEntity | null;

  /**
   * PpsMaterialFk
   */
  PpsMaterialFk: number;

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
