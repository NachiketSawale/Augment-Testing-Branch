/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IReportGroupEntity } from '../../../report-groups/model/entities/report-group-entity.interface';

export interface IReport2GroupEntityGenerated extends IEntityBase {

  /*
   * AccessRightDescriptor
   */
  AccessRightDescriptor?: string | null;

  /*
   * AccessRightDescriptorFk
   */
  AccessRightDescriptorFk?: number | null;

  /*
   * Id
   */
  Id?: number | null;

  /*
   * IsVisible
   */
  IsVisible?: boolean | null;

  /*
   * ReportEntity
   */
  // ReportEntity?: IReportEntity | null;

  /*
   * ReportFk
   */
  ReportFk?: number | null;

  /*
   * ReportGroupEntity
   */
  ReportGroupEntity?: IReportGroupEntity | null;

  /*
   * ReportGroupFk
   */
  ReportGroupFk?: number | null;

  /*
   * Sorting
   */
  Sorting?: number | null;

  /*
   * Visibility
   */
  Visibility?: number | null;
}
