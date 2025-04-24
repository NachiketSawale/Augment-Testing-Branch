/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IUserChartSeriesEntity } from '../model/entities/user-chart-series-entity.interface';
import { BasicsDependentDataChartSeriesDataService } from './basics-dependent-data-chart-series-data.service';
import { BasicsDependentDataChartSeriesLayoutService } from './basics-dependent-data-chart-series-layout.service';
import { BasicsDependentDataChartSeriesBehaviorService } from './basics-dependent-data-chart-series-behavior.service';

export const BASICS_DEPENDENT_DATA_CHART_SERIES_ENTITY_INFO: EntityInfo = EntityInfo.create<IUserChartSeriesEntity>({
	grid: {
		containerUuid: '6f7ae102f33c4b62b46ebd0fb64bc879',
		title: {key: 'basics.dependentdata.dependentDataChartSeriesListTitle'},
		behavior: ctx => ctx.injector.get(BasicsDependentDataChartSeriesBehaviorService)
	},
	form: {
		containerUuid: 'd549130037ec4296920673b626f8eecd',
		title: 'basics.dependentdata.dependentDataChartSeriesDetailTitle',
	},
	dataService: ctx => ctx.injector.get(BasicsDependentDataChartSeriesDataService),
	layoutConfiguration: context => {
		return context.injector.get(BasicsDependentDataChartSeriesLayoutService).generateLayout();
	},
	dtoSchemeId: {moduleSubModule: 'Basics.DependentData', typeName: 'UserChartSeriesDto'},
	permissionUuid: '38dd62eae5544544905d10d0b9bef0c3',
});