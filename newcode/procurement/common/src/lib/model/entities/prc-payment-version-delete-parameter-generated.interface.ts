/*
 * Copyright(c) RIB Software GmbH
 */

import { IPaymentScheduleVersionInfo } from './payment-schedule-version-info.interface';

export interface IPrcPaymentVersionDeleteParameterGenerated {

  /**
   * MainItemId
   */
  MainItemId: number;

  /**
   * VersionInfos
   */
  VersionInfos?: IPaymentScheduleVersionInfo[] | null;
}
