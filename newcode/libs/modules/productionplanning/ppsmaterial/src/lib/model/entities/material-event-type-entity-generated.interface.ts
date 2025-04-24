/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IMaterialEventTypeEntityGenerated extends IEntityBase {

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * EventFor
   */
  EventFor?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * LagTime
   */
  LagTime: number;

  /**
   * MaterialFk
   */
  MaterialFk: number;

  /**
   * PpsEventTypeBaseFk
   */
  PpsEventTypeBaseFk: number;

  /**
   * PpsEventTypeFk
   */
  PpsEventTypeFk: number;

  /**
   * ResTypeFk
   */
  ResTypeFk: number;

  /**
   * SiteFk
   */
  SiteFk: number;

  /**
   * Sorting
   */
  Sorting: number;

  /**
   * VarDuration
   */
  VarDuration: number;
}
