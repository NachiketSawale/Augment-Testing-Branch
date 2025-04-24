/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcConfiguration2StrategyEntity } from './prc-configuration-2-strategy-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IPrcStrategyEntityGenerated extends IEntityBase {

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
   * IsLive
   */
  IsLive: boolean;

  /**
   * PrcConfiguration2StrategyEntities
   */
  PrcConfiguration2StrategyEntities?: IPrcConfiguration2StrategyEntity[] | null;

  /**
   * Sorting
   */
  Sorting: number;
}
