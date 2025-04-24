/*
 * Copyright(c) RIB Software GmbH
 */

import { IBilHeaderEntity } from './bil-header-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IBil2BilEntityGenerated extends IEntityBase {

  /**
   * BilBeforeHeaderFk
   */
  BilBeforeHeaderFk: number;

  /**
   * BilHeaderFk
   */
  BilHeaderFk: number;

  /**
   * CanLoad
   */
  CanLoad: boolean;

  /**
   * FinalGroup
   */
  FinalGroup?: number | null;

  /**
   * HeaderEntity_BilBeforeHeaderFk
   */
  HeaderEntity_BilBeforeHeaderFk?: IBilHeaderEntity | null;

  /**
   * HeaderEntity_BilHeaderFk
   */
  HeaderEntity_BilHeaderFk?: IBilHeaderEntity | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsSelected
   */
  IsSelected: boolean;

  /**
   * IsStorno
   */
  IsStorno: boolean;

  /**
   * ProjectFk
   */
  ProjectFk: number;
}
