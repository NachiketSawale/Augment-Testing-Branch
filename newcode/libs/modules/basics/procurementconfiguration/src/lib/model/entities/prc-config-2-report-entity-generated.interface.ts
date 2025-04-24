/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPrcConfig2ReportEntityGenerated extends IEntityBase {

  /**
   * BasReportFk
   */
  BasReportFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * IsMandatory
   */
  IsMandatory: boolean;

  /**
   * PrcConfigurationFk
   */
  PrcConfigurationFk: number;

  /**
   * ReportType
   */
  ReportType: number;
}
