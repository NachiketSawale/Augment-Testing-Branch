/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IMdcContrColumnPropDefEntity } from '../../model/entities/mdc-contr-column-prop-def-entity.interface';
import { IMdcContrChartCategoryEntity } from '../../model/entities/mdc-contr-chart-category-entity.interface';
import { IChartConfigItem } from '@libs/basics/shared'

// TODO:  Should create series/category interface, then remove following two external dependencies
export interface  IChartConfig {
	dateItem? : IChartConfigItem | null;
	series? : IMdcContrColumnPropDefEntity[] | null
	categories? : IMdcContrChartCategoryEntity[] | null
}