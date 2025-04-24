/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IMdcContrChartEntity } from './mdc-contr-chart-entity.interface';
import { IMdcContrChartCategoryEntity } from './mdc-contr-chart-category-entity.interface';
import { IMdcContrChartSeriesEntity } from './mdc-contr-chart-series-entity.interface';
import { IMdcContrColumnPropDefEntity } from "./mdc-contr-column-prop-def-entity.interface";

export interface IChartConfigComplateEntityGenerated {

/*
 * MdcContrCharToSave
 */
  MdcContrCharToSave?: IMdcContrChartEntity[] | null;

/*
 * MdcContrChartCategoryDtos
 */
  MdcContrChartCategoryDtos?: IMdcContrChartCategoryEntity[] | null;

/*
 * MdcContrChartDto
 */
  MdcContrChartDto: IMdcContrChartEntity;

/*
 * MdcContrChartSeriesDtos
 */
  MdcContrChartSeriesDtos?: IMdcContrChartSeriesEntity[]  | null;

/*
	 * MdcContrChartSeriesDtos
	 */
  MdcContrColumnPropDefEntities?: IMdcContrColumnPropDefEntity[] | null;
}
