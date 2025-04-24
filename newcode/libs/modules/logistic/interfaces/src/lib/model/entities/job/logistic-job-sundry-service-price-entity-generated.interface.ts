/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ILogisticJobSundryServicePriceEntityGenerated extends IEntityBase {

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsManual
   */
  IsManual: boolean;

  /**
   * JobFk
   */
  JobFk: number;

  /**
   * JobPerformingFk
   */
  JobPerformingFk?: number | null;

  /**
   * PricePortion1
   */
  PricePortion1: number;

  /**
   * PricePortion2
   */
  PricePortion2: number;

  /**
   * PricePortion3
   */
  PricePortion3: number;

  /**
   * PricePortion4
   */
  PricePortion4: number;

  /**
   * PricePortion5
   */
  PricePortion5: number;

  /**
   * PricePortion6
   */
  PricePortion6: number;

  /**
   * SundryServiceFk
   */
  SundryServiceFk: number;

  /**
   * ValidFrom
   */
  ValidFrom?: string | null;

  /**
   * ValidTo
   */
  ValidTo?: string | null;
}
