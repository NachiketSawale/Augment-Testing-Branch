/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ITimekeepingEmpVerificationEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingRecordingReportVerificationDataService } from '../services/timekeeping-recording-report-verification-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';


export const TIMEKEEPING_EMP_REPORT_VERIFICATION_ENTITY_INFO: EntityInfo = EntityInfo.create<ITimekeepingEmpVerificationEntity> ({
	grid: {
		title: {key: 'timekeeping.recording.recordingReportVerificationListTitle'},
		containerUuid: '2deddcc178a84cfebdfa8d7a094032bf',
	},
	form: {
		title: { key: 'timekeeping.recording.recordingReportVerificationDetailTitle' },
		containerUuid: '67045a0fa32d41fe92d0083d5997c49c',
	},
	dataService: ctx => ctx.injector.get(TimekeepingRecordingReportVerificationDataService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.Recording', typeName: 'EmpReportVerificationDto'},
	permissionUuid: '2deddcc178a84cfebdfa8d7a094032bf',
	layoutConfiguration: {
		groups: [
			{
				gid: 'default-group',
				attributes: ['TimeRecorded','ReportVerificationTypeFk','ReportFk','CommentText','Longitude','Latitude','InsertedByOriginal','InsertedAtOriginal']
			}
		],
		overloads: {
			TimeRecorded:{readonly:true},
			ReportVerificationTypeFk:{readonly:true},
			CommentText:{readonly:true},
			Longitude:{readonly:true},
			Latitude:{readonly:true},
			InsertedByOriginal:{readonly:true},
			InsertedAtOriginal:{readonly:true}
		},
		labels: {
			...prefixAllTranslationKeys('timekeeping.recording.', {
				TimeRecorded: {key:'entityTimeRecorded'},
				ReportVerificationTypeFk: {key:'entityReportVerificationTypeFk'},
				ReportFk:{key:'entityReportFk'},
				Longitude:{key:'entityLongitude'},
				Latitude:{key:'entityLatitude'},
				InsertedByOriginal:{key:'entityInsertedAtOriginal'},
				InsertedAtOriginal:{key:'entityInsertedByOriginal'}
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				CommentText: { key: 'entityCommentText'}
			})
		}
	}
});
