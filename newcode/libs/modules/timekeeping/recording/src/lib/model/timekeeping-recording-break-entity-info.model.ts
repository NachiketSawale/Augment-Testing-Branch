/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ITimekeepingBreakEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingRecordingBreakDataService } from '../services/timekeeping-recording-break-data.service';
import { TIMEKEEPING_RECORDING_BREAK_LAYOUT } from './timekeeping-recording-break-layout.model';
import { TimekeepingRecordingBreakValidationService } from '../services/timekeeping-recording-break-validation.service';

export const TIMEKEEPING_RECORDING_BREAK_ENTITY_INFO: EntityInfo = EntityInfo.create<ITimekeepingBreakEntity> ({
	grid: {
		title: {key: 'timekeeping.recording' + '.recordingBreakListTitle'},
	},
	form: {
		title: { key: 'timekeeping.recording' + '.recordingBreakDetailTitle' },
		containerUuid: '39574ea27504449187506297fbd24e10',
	},
	dataService: ctx => ctx.injector.get(TimekeepingRecordingBreakDataService),
	validationService: ctx => ctx.injector.get(TimekeepingRecordingBreakValidationService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.Recording', typeName: 'TimekeepingBreakDto'},
	permissionUuid: '5d34ff4e0bf347e3976e6ef2079bf91d',
	layoutConfiguration: TIMEKEEPING_RECORDING_BREAK_LAYOUT
});