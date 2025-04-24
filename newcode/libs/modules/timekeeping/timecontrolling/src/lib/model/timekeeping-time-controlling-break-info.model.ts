/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { TIMEKEEPING_RECORDING_BREAK_LAYOUT } from '@libs/timekeeping/recording';
import {ITimekeepingBreakEntity} from '@libs/timekeeping/interfaces';
import { TimekeepingTimeControllingBreakDataService } from '../services/timekeeping-time-controlling-break-data.service';

export const TIMEKEEPING_TIME_CONTROLLING_BREAK_ENTITY_INFO: EntityInfo = EntityInfo.create<ITimekeepingBreakEntity> ({
	grid: {
		title: {key: 'timekeeping.recording' + '.recordingBreakListTitle'},
	},
	form: {
		title: { key: 'timekeeping.recording' + '.recordingBreakDetailTitle' },
		containerUuid: '9b148bd082fd4470831c6686a24db1e3',
	},
	dataService: ctx => ctx.injector.get(TimekeepingTimeControllingBreakDataService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.Recording', typeName: 'ReportDto'},
	permissionUuid: '5d34ff4e0bf347e3976e6ef2079bf91d',
	layoutConfiguration: TIMEKEEPING_RECORDING_BREAK_LAYOUT
});
