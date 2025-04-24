/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IModuleEntity } from '../../../modules/model/entities/module-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IMcTwoQnAEntityGenerated extends IEntityBase {

  /*
   * Answer
   */
  Answer?: IDescriptionInfo | null;

  /*
   * BasModuleFk
   */
  BasModuleFk?: number | null;

  /*
   * Id
   */
  Id?: number | null;

  /*
   * IsDefault
   */
  IsDefault?: boolean | null;

  /*
   * IsLive
   */
  IsLive?: boolean | null;

  /*
   * ModuleEntity
   */
  ModuleEntity?: IModuleEntity | null;

  /*
   * Question
   */
  Question?: IDescriptionInfo | null;

  /*
   * Sorting
   */
  Sorting?: number | null;
}
