/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcOverviewVEntity } from './prc-overview-ventity.interface';
import { IDescriptionInfo } from '@libs/platform/common';

export interface IPrcOverviewVEntityGenerated {

  /**
   * Children
   */
  Children?: IPrcOverviewVEntity[] | null;

  /**
   * Count
   */
  Count?: number | null;

  /**
   * DataId
   */
  DataId?: number | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IdReal
   */
  IdReal: number;

  /**
   * ParentFk
   */
  ParentFk: number;

  /**
   * PrcHeaderFk
   */
  PrcHeaderFk: number;

  /**
   * Sorting
   */
  Sorting?: number | null;
}
