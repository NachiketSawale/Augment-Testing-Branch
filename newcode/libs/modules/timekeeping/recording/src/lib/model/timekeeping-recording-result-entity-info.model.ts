/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ITimekeepingResultEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingRecordingResultDataService } from '../services/timekeeping-recording-result-data.service';
import { TimekeepingRecordingResultValidationService } from '../services/timekeeping-recording-result-validation.service';


export const TIMEKEEPING_RECORDING_RESULT_ENTITY_INFO: EntityInfo = EntityInfo.create<ITimekeepingResultEntity> ({
	grid: {
		title: {key: 'timekeeping.recording' + '.recordingResultListTitle'},
	},
	form: {
		title: { key: 'timekeeping.recording' + '.recordingResultDetailTitle' },
		containerUuid: 'd4c21ec117cd4795aa6604ae56fea840',
	},
	dataService: ctx => ctx.injector.get(TimekeepingRecordingResultDataService),
	validationService: ctx => ctx.injector.get(TimekeepingRecordingResultValidationService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.Recording', typeName: 'TimekeepingResultDto'},
	permissionUuid: 'd8ee0744ffac416a871546728e6e82bb',
	layoutConfiguration: {
		groups: [
			{
				gid: 'default-group',
				attributes: [
					'CommentText','DueDate','Hours','Rate'
					]
			}
		],
		overloads: {
		},
		labels: {
			...prefixAllTranslationKeys('timekeeping.recording.', {
				DueDate:{key:'bookingDate'},
				Hours:{key:'hours'}
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				Rate: { key: 'entityRate'}
			})
		}
	}
});