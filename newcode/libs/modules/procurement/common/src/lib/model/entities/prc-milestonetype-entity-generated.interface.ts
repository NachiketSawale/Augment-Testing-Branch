/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcMilestoneEntity } from './prc-milestone-entity.interface';
import { IDescriptionInfo } from '@libs/platform/common';

export interface IPrcMilestonetypeEntityGenerated {

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Icon
   */
  Icon: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * Iscritical
   */
  Iscritical: boolean;

  /**
   * Isinformationonly
   */
  Isinformationonly: boolean;

  /**
   * PrcMilestoneEntities
   */
  PrcMilestoneEntities?: IPrcMilestoneEntity[] | null;

  /**
   * Sorting
   */
  Sorting: number;
}
