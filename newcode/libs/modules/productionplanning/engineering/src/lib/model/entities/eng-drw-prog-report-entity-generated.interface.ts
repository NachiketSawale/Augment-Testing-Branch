/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IEngDrwProgReportEntityGenerated extends IEntityBase {

  /**
   * ActualEndDate
   */
  ActualEndDate?: string | null;

  /**
   * ActualStartDate
   */
  ActualStartDate?: string | null;

  /**
   * BasClerkFk
   */
  BasClerkFk: number;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * EngDrawingFk
   */
  EngDrawingFk?: number | null;

  /**
   * EngTaskFk
   */
  EngTaskFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsManualQuantity
   */
  IsManualQuantity: boolean;

  /**
   * LgmJobRecvFk
   */
  LgmJobRecvFk: number;

  /**
   * MdcControllingunitFk
   */
  MdcControllingunitFk?: number | null;

  /**
   * PerformanceDate
   */
  PerformanceDate: string;

  /**
   * Quantity
   */
  Quantity: number;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * UserDefined1
   */
  UserDefined1?: string | null;

  /**
   * UserDefined2
   */
  UserDefined2?: string | null;

  /**
   * UserDefined3
   */
  UserDefined3?: string | null;

  /**
   * UserDefined4
   */
  UserDefined4?: string | null;

  /**
   * UserDefined5
   */
  UserDefined5?: string | null;

  /**
   * UserFlag1
   */
  UserFlag1: boolean;

  /**
   * UserFlag2
   */
  UserFlag2: boolean;
}
