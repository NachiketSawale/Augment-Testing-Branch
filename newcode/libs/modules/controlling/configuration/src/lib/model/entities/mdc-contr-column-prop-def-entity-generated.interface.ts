/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IMdcContrChartSeriesEntity } from './mdc-contr-chart-series-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IMdcContrColumnPropDefEntityGenerated extends IEntityBase {

/*
 * CalColumn
 */
  CalColumn?: string | null;

/*
 * CalType
 */
  CalType?: number | null;

/*
 * Code
 */
  Code: string;

/*
 * Description
 */
  Description?: IDescriptionInfo | null;

/*
 * Id
 */
  Id: number;

/*
 * MdcContrChartseriesEntities
 */
  MdcContrChartseriesEntities?: IMdcContrChartSeriesEntity[] | null;

/*
 * MdcContrConfigHeaderFk
 */
  MdcContrConfigHeaderFk?: number | null;

/*
 * ReportPeriodRelativeEnd
 */
  ReportPeriodRelativeEnd?: string | null;

/*
 * ReportPeriodRelativeStart
 */
  ReportPeriodRelativeStart?: string | null;
}
