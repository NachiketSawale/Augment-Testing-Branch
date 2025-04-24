/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcHeaderblobEntity } from '@libs/procurement/interfaces';


export interface IReloadHeaderTextEntityGenerated {

  /**
   * HeaderTexts
   */
  HeaderTexts?: IPrcHeaderblobEntity[] | null;

  /**
   * IsOverride
   */
  IsOverride: boolean;

  /**
   * PrcConfigurationId
   */
  PrcConfigurationId: number;

  /**
   * PrcHeaderId
   */
  PrcHeaderId: number;

  /**
   * ProjectId
   */
  ProjectId?: number | null;
}
