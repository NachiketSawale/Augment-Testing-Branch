/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IMdcContrChartEntity } from './mdc-contr-chart-entity.interface';
import { IMdcContrColumnPropDefEntity } from './mdc-contr-column-prop-def-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IMdcContrChartSeriesEntityGenerated extends IEntityBase {

/*
 * ChartDataConfig
 */
  ChartDataConfig?: string | null;

/*
 * Code
 */
  Code?: string | null;

/*
 * Description
 */
  Description?: IDescriptionInfo | null;

/*
 * Id
 */
  Id: number;

/*
 * MdcContrChartEntity
 */
  MdcContrChartEntity?: IMdcContrChartEntity | null;

/*
 * MdcContrChartFk
 */
  MdcContrChartFk?: number | null;

/*
 * MdcContrColumnPropDefEntity
 */
  MdcContrColumnPropDefEntity?: IMdcContrColumnPropDefEntity | null;

/*
 * MdcContrColumnPropDefFk
 */
  MdcContrColumnPropDefFk?: number | null;
}
