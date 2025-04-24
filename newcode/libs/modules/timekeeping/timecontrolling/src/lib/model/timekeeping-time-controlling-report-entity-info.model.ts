/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { TimekeepingTimeControllingReportDataService } from '../services/timekeeping-time-controlling-report-data.service';
import { TIMEKEEPING_RECORDING_REPORT_LAYOUT } from '@libs/timekeeping/recording';
import { IReportEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingTimecontrollingReportValidationService } from '../services/timekeeping-timecontrolling-report-validation.service';



export const TIMEKEEPING_TIME_CONTROLLING_REPORT_ENTITY_INFO: EntityInfo = EntityInfo.create<IReportEntity> ({
	grid: {
		title: {key: 'timekeeping.timecontrolling' + '.reportListTitle'},
	},
	form: {
		title: { key: 'timekeeping.timecontrolling' + '.reportDetailTitle' },
		containerUuid: '9e6540d3c380465cb8e8c7afa0a2a98a',
	},
	dataService: ctx => ctx.injector.get(TimekeepingTimeControllingReportDataService),
	validationService: ctx => ctx.injector.get(TimekeepingTimecontrollingReportValidationService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.Recording', typeName: 'ReportDto'},
	permissionUuid: 'f78bcdebfebc494392a7759e48e6b0ed',
	layoutConfiguration: TIMEKEEPING_RECORDING_REPORT_LAYOUT
});
