/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IMdcContrChartCategoryEntity } from './mdc-contr-chart-category-entity.interface';
import { IMdcContrChartSeriesEntity } from './mdc-contr-chart-series-entity.interface';
import { IMdcContrConfigHeaderEntity } from './mdc-contr-config-header-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IMdcContrChartEntityGenerated extends IEntityBase {

/*
 * Action
 */
  Action?: string | null;

/*
 * BasChartTypeFk
 */
  BasChartTypeFk: number;

/*
 * ChartOptionConfig
 */
  ChartOptionConfig?: string | null;

/*
 * ChartType
 */
  ChartType?: string | null;

/*
 * Description
 */
  Description?: IDescriptionInfo | null;

/*
 * Id
 */
  Id: number;

/*
 * IsDefault1
 */
  IsDefault1?: boolean | null;

/*
 * IsDefault2
 */
  IsDefault2?: boolean | null;

/*
 * MdcContrChartcategoryEntities
 */
  MdcContrChartcategoryEntities?: IMdcContrChartCategoryEntity[] | null;

/*
 * MdcContrChartseriesEntities
 */
  MdcContrChartseriesEntities?: IMdcContrChartSeriesEntity[] | null;

/*
 * MdcContrConfigHeaderEntity
 */
  MdcContrConfigHeaderEntity?: IMdcContrConfigHeaderEntity | null;

/*
 * MdcContrConfigHeaderFk
 */
  MdcContrConfigHeaderFk?: number | null;
}
