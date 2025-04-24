/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType } from '@libs/ui/common';
import { TimekeepingEmployeeLookupService } from '@libs/timekeeping/shared';
import { ISheetEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingRecordingSheetDataService } from '../services/timekeeping-recording-sheet-data.service';
import { TimekeepingRecordingSheetValidationService } from '../services/timekeeping-recording-sheet-validation.service';


export const TIMEKEEPING_RECORDING_SHEET_ENTITY_INFO: EntityInfo = EntityInfo.create<ISheetEntity> ({
	grid: {
		title: {key: 'timekeeping.recording' + '.recordingSheetListTitle'},
	},
	form: {
		title: { key: 'timekeeping.recording' + '.recordingSheetDetailTitle' },
		containerUuid: 'bc3f46599d584250baa1b35db1c361ad',
	},
	dataService: ctx => ctx.injector.get(TimekeepingRecordingSheetDataService),
	validationService: ctx => ctx.injector.get(TimekeepingRecordingSheetValidationService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.Recording', typeName: 'SheetDto'},
	permissionUuid: 'a99560462228495790fa8a2cb66f3fe3',
	layoutConfiguration: {
		groups: [
			{
				gid: 'default-group',
				attributes: ['EmployeeFk','CommentText']
			}
		],
		overloads: {
			EmployeeFk:{
				type:FieldType.Lookup,
				lookupOptions:createLookup({
					dataServiceToken:TimekeepingEmployeeLookupService}
				)}
		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				CommentText: { key: 'entityCommentText'}
			})
		}
	}
});