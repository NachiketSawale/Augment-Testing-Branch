/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { addUserDefinedTextTranslation, prefixAllTranslationKeys } from '@libs/platform/common';
import { IScheduleEntity } from '@libs/scheduling/interfaces';
import { SchedulingSubscheduleDataService } from './services/scheduling-subschedule-data.service';

export const SchedulingSubScheduleEntityInfo: EntityInfo = EntityInfo.create<IScheduleEntity> ({
	grid: {
		title: {key: 'scheduling.schedule' + '.subSchedulelistTitle'}
	},
	form: {
		title: { key: 'scheduling.schedule' + '.subScheduledetailTitle' },
		containerUuid: 'c7281a461e144aeda6478c6b1789a6ee',
	},
	dataService: ctx => ctx.injector.get(SchedulingSubscheduleDataService),
	dtoSchemeId: {moduleSubModule: 'Scheduling.Schedule', typeName: 'ScheduleDto'},
	permissionUuid: '7447B8DF191C45118F56DD84D25D1B41',
	layoutConfiguration: {
		groups: [
			{
				gid: 'default-group',
				attributes: ['CalendarFk', 'ChartIntervalEndDate', 'ChartIntervalStartDate', 'Code', 'CodeFormatFk', 'CommentText', 'CompanyFk', 'InitWithTargetStart', 'IsActive', 'IsBold',
					'IsFinishedWith100Percent', 'IsLive', 'IsLocationMandatory', 'IsMarked', 'IsReadOnly', 'PerformanceSheetFk', 'PermissionObjectInfo', 'ProgressReportingMethod',
					'ProjectFk','Remark','RubricCategoryFk',/*'ScheduleChartIntervalFk','ScheduleMasterFk','ScheduleStatusFk','ScheduleTypeFk',*/'ScheduleVersion','TargetEnd','TargetStart','UseCalendarForLagtime']
			},
			{
				gid: 'userDefTexts',
				attributes: ['UserDefinedText01','UserDefinedText02','UserDefinedText03','UserDefinedText04','UserDefinedText05','UserDefinedText06','UserDefinedText07','UserDefinedText08','UserDefinedText09','UserDefinedText10']
			}
		],
		overloads: {},
		labels: {
			...prefixAllTranslationKeys('scheduling.schedule.', {
				CodeFormatFk: {key:'codeformat'},
				TargetStart: {key:'targetstart'},
				UseCalendarForLagtime: {key:'useCalendarForLagtime'},
				TargetEnd: {key:'targetend'},
				ScheduleVersion: {key:'entityScheduleVersion'},
				ScheduleTypeFk: {key:'entityPsdScheduleTypeFk'},
				ScheduleStatusFk: {key:'entitySchedulestatusfk'},
				ChartIntervalStartDate: {key:'chartIntervalStartDate'},
				ChartIntervalEndDate: {key:'chartIntervalEndDate'},
				CommentText: {key:'commenttext'},
				IsLocationMandatory:{key:'isLocationMandatory'},
				IsReadOnly:{key:'isReadOnly'},
				IsFinishedWith100Percent:{key:'entityFinishedWith100'},
				InitWithTargetStart:{key:'initWithTargetStart'},
				ScheduleChartIntervalFk:{key:'entityScheduleChartInterval'},
				ScheduleMasterFk:{key:'scheduleMasterFk'},
				ProgressReportingMethod:{key:'progressReportingMethod'}
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				Code: { key: 'entityCode' },
				Description:{key:'entityDescription'},
				userDefTexts: {key: 'UserdefTexts'},
				userDefNumbers: {key: 'UserdefNumbers'},
				userDefDates: {key: 'UserdefDates'},
				CalendarFk:{key:'entityCalCalendarFk'},
				ProjectFk:{key:'entityProject'},
				CompanyFk:{key:'CompanyFk'},
				PerformanceSheetFk:{key:'entityPsdPerformanceSheetFk'},

			}),
			...addUserDefinedTextTranslation({ UserDefinedText: {key: 'entityUserDefinedText',params: { 'p_0': 1 }} }, 10, 'UserDefinedText', '', 'userDefTextGroup'),
		}
	}
});