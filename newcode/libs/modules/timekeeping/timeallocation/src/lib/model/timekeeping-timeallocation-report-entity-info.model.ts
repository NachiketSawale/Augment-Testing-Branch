/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IReportEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingTimeallocationReportDataService } from '../services/timekeeping-timeallocation-report-data.service';
import { TIMEKEEPING_RECORDING_REPORT_LAYOUT, TimekeepingRecordingReportValidationService } from '@libs/timekeeping/recording';


export const TIMEKEEPING_TIMEALLOCATION_REPORT_ENTITY_INFO: EntityInfo = EntityInfo.create<IReportEntity> ({
	grid: {
		title: {key: 'timekeeping.recording.recordingReportListTitle'},
	},
	form: {
		title: { key: 'timekeeping.recording.recordingReportDetailTitle' },
		containerUuid: '9e6540d3c380465cb8e8c7afa0a2a98a',
	},
	dataService: ctx => ctx.injector.get(TimekeepingTimeallocationReportDataService),
	validationService: ctx => ctx.injector.get(TimekeepingRecordingReportValidationService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.Recording', typeName: 'ReportDto'},
	permissionUuid: 'f78bcdebfebc494392a7759e48e6b0ed',
	layoutConfiguration: TIMEKEEPING_RECORDING_REPORT_LAYOUT
});
