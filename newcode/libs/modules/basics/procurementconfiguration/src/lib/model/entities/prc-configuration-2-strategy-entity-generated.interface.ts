/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcStrategyEntity } from './prc-strategy-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IPrcConfiguration2StrategyEntityGenerated extends IEntityBase {

  /**
   * Id
   */
  Id: number;

  /**
   * PrcCommunicationChannelFk
   */
  PrcCommunicationChannelFk?: number | null;

  /**
   * PrcConfigHeaderFk
   */
  PrcConfigHeaderFk: number;

  /**
   * PrcStrategyEntity
   */
  PrcStrategyEntity?: IPrcStrategyEntity | null;

  /**
   * PrcStrategyFk
   */
  PrcStrategyFk: number;
}
