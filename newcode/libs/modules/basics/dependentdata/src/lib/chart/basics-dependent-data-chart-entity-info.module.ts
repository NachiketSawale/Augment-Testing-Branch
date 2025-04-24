/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IUserChartEntity } from '../model/entities/user-chart-entity.interface';
import { BasicsDependentDataChartDataService } from './basics-dependent-data-chart-data.service';
import { BasicsDependentDataChartLayoutService } from './basics-dependent-data-chart-layout.service';
import { BasicsDependentDataChartBehaviorService } from './basics-dependent-data-chart-behavior.service';

export const BASICS_DEPENDENT_DATA_CHART_ENTITY_INFO: EntityInfo = EntityInfo.create<IUserChartEntity>({
	grid: {
		title: {key: 'basics.dependentdata.dependentDataChartListTitle'},
		behavior: ctx => ctx.injector.get(BasicsDependentDataChartBehaviorService),
	},
	form: {
		containerUuid: '2c46c63d1eef4f68aaa749ebdd08e18c',
		title: 'basics.dependentdata.dependentDataChartDetailTitle',
	},
	dataService: ctx => ctx.injector.get(BasicsDependentDataChartDataService),
	layoutConfiguration: context => {
		return context.injector.get(BasicsDependentDataChartLayoutService).generateLayout();
	},
	dtoSchemeId: {moduleSubModule: 'Basics.DependentData', typeName: 'UserChartDto'},
	permissionUuid: '38dd62eae5544544905d10d0b9bef0c3',
});