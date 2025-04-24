/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPrcStructureEventEntityGenerated extends IEntityBase {

  /**
   * AddLeadTimeToEnd
   */
  AddLeadTimeToEnd?: number | null;

  /**
   * AddLeadTimeToStart
   */
  AddLeadTimeToStart?: number | null;

  /**
   * EndBasis
   */
  EndBasis: number;

  /**
   * EndNoOfDays
   */
  EndNoOfDays: number;

  /**
   * Id
   */
  Id: number;

  /**
   * PrcEventTypeEndFk
   */
  PrcEventTypeEndFk?: number | null;

  /**
   * PrcEventTypeFk
   */
  PrcEventTypeFk: number;

  /**
   * PrcEventTypeStartFk
   */
  PrcEventTypeStartFk?: number | null;

  /**
   * PrcStructureFk
   */
  PrcStructureFk: number;

  /**
   * PrcSystemEventTypeEndFk
   */
  PrcSystemEventTypeEndFk?: number | null;

  /**
   * PrcSystemEventTypeStartFk
   */
  PrcSystemEventTypeStartFk?: number | null;

  /**
   * Sorting
   */
  Sorting: number;

  /**
   * StartBasis
   */
  StartBasis: number;

  /**
   * StartNoOfDays
   */
  StartNoOfDays: number;
}
