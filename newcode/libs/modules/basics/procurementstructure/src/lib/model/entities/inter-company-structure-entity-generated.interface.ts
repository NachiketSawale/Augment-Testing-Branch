/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IInterCompanyStructureEntityGenerated extends IEntityBase {

  /**
   * Id
   */
  Id: number;

  /**
   * MdcContextFk
   */
  MdcContextFk: number;

  /**
   * PrcStructureFk
   */
  PrcStructureFk: number;

  /**
   * PrcStructureToFk
   */
  PrcStructureToFk: number;
}
