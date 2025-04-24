/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface ICharacteristicSectionEntityGenerated extends IEntityBase {

  /**
   * Checked
   */
  Checked: boolean;

  /**
   * ContainerUuid
   */
  ContainerUuid?: string | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * ModuleFk
   */
  ModuleFk?: number | null;

  /**
   * SectionName
   */
  SectionName?: string | null;

  /**
   * Sorting
   */
  Sorting: number;
}
