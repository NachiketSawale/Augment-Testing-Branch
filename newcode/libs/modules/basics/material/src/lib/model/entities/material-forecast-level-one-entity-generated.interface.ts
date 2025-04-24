/*
 * Copyright(c) RIB Software GmbH
 */

import { IMaterialGroupEntity } from '@libs/basics/shared';
import { IMaterialForecastLevelOneEntity } from './material-forecast-level-one-entity.interface';

export interface IMaterialForecastLevelOneEntityGenerated {

  /**
   * ChildItems
   */
  ChildItems?: IMaterialForecastLevelOneEntity[] | null;

  /**
   * Code
   */
  Code?: string | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: string | null;

  /**
   * Group
   */
  Group?: IMaterialGroupEntity | null;

  /**
   * Id
   */
  Id?: number | null;

  /**
   * IsDirectory
   */
  IsDirectory: boolean;

  /**
   * MaterialCode
   */
  MaterialCode?: string | null;

  /**
   * MdcMaterialGroupFk
   */
  MdcMaterialGroupFk?: number | null;

  /**
   * Uom
   */
  Uom?: number | null;

  /**
   * image
   */
  image?: string | null;
}
