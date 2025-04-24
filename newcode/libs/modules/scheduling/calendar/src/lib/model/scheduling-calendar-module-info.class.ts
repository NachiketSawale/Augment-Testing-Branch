/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { SchedulingCalendarDataService } from '../services/scheduling-calendar-data.service';
import { SCHEDULING_CALENDAR_BEHAVIOR_TOKEN } from '../behaviors/scheduling-calendar-behavior.service';
import { SCHEDULING_CALENDAR_EXCEPTION_DAY_BEHAVIOR_TOKEN } from '../behaviors/scheduling-calendar-exception-day-behavior.service';
import { SchedulingCalendarExceptionDayDataService } from '../services/scheduling-calendar-exception-day-data.service';
import { SCHEDULING_CALENDAR_WEEK_DAY_BEHAVIOR_TOKEN } from '../behaviors/scheduling-calendar-week-day-behavior.service';
import { SchedulingCalendarWeekDayDataService } from '../services/scheduling-calendar-week-day-data.service';
import { SchedulingCalendarWorkHourDataService } from '../services/scheduling-calendar-work-hour-data.service';
import { SchedulingCalendarLookup } from '../services/lookup/scheduling-calendar-lookup.service';
import { createLookup, FieldType } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { SchedulingCalendarWorkDayDataService } from '../services/scheduling-calendar-workday-data.service';
import { SCHEDULING_CALENDAR_WORK_DAY_BEHAVIOR_TOKEN } from '../behaviors/scheduling-calendar-workday-behavior.service';
import { ISchedulingCalendarWorkDayEntity,ISchedulingCalendarExceptionDayEntity,ISchedulingCalendarWeekDayEntity,ISchedulingCalendarWorkHourEntity,ISchedulingCalendarEntity} from '@libs/scheduling/interfaces';
import { SCHEDULING_CALENDAR_WORK_HOUR_BEHAVIOR_TOKEN } from '../behaviors/scheduling-calendar-work-hour-behavior.service';

export class SchedulingCalendarModuleInfo extends BusinessModuleInfoBase {

	public static readonly instance = new SchedulingCalendarModuleInfo();

	/**
	 * Make module info class singleton
	 * @private
	 */
	private constructor() {
		super();
	}

	public override get internalModuleName(): string {
		return 'scheduling.calendar';
	}

	public override get entities(): EntityInfo[] {
		return [
			this.calendarEntityInfo,
			this.calendarExceptionDayEntityInfo,
			this.calendarWorkDayEntityInfo,
			this.calendarWeekDayEntityInfo,
			this.calendarWorkHourEntityInfo

		];
	}

	private readonly calendarEntityInfo: EntityInfo = EntityInfo.create({
		grid: {
			title: {key: this.internalModuleName + '.calendarGridHeader'},
			behavior: SCHEDULING_CALENDAR_BEHAVIOR_TOKEN
		},
		form: '506fc12756f8439e8fecb7ee4b360538',
		dataService: ctx => ctx.injector.get(SchedulingCalendarDataService),
		dtoSchemeId: {moduleSubModule: this.internalPascalCasedModuleName, typeName: 'CalendarDto'},
		permissionUuid: 'afecdb4a08404395855258b70652d04b',
		layoutConfiguration: {
			groups: [{gid: 'default-group', attributes: ['Code', 'CommentText','WorkHourDefinesWorkDay','WorkHoursPerDay','IsDefault','WorkHoursPerWeek',
					'WorkHoursPerMonth','WorkHoursPerYear','IsLive']}
			],
			overloads: {},
			labels: {
						...prefixAllTranslationKeys('scheduling.calendar.', {
							WorkHourDefinesWorkDay:{ key:'entityWorkHourDefinesWorkDay'},
							WorkHoursPerDay:{key:'entityWorkHoursPerDay'},
							WorkHoursPerWeek: {key:'entityWorkHoursPerWeek'},
							WorkHoursPerMonth:{key:'entityWorkHoursPerMonth'},
							WorkHoursPerYear: {key:'entityWorkHoursPerYear'},
							IsLive: {key:'entityIsLive'},
						}),
						...prefixAllTranslationKeys('cloud.common.', {
							Code: { key: 'entityCode' },
							CommentText: { key: 'entityCommentText'}
						})
					}
			}
	} as IEntityInfo<ISchedulingCalendarEntity>);

	private readonly calendarExceptionDayEntityInfo: EntityInfo = EntityInfo.create({
		grid: {
			title: {key: this.internalModuleName + '.exceptionListHeader'},
			behavior: SCHEDULING_CALENDAR_EXCEPTION_DAY_BEHAVIOR_TOKEN
		},
		form: '3978757e36bc49cba7e8a177272f2bfc',
		dataService: ctx => ctx.injector.get(SchedulingCalendarExceptionDayDataService),
		dtoSchemeId: {moduleSubModule: this.internalPascalCasedModuleName, typeName: 'ExceptionDayDto'},
		permissionUuid: '3159c0a0c6d34287bf80fa1398f879ec',
		layoutConfiguration: {
				groups: [{gid: 'default-group', attributes: ['Code','CommentText', 'ExceptDate','IsWorkday','BackgroundColor','FontColor','IsShownInChart','WorkStart','WorkEnd']}
				],
				overloads: {
				},
				labels: {
				...prefixAllTranslationKeys('scheduling.calendar.', {
					ExceptDate: { key: 'entityExceptionDate'},
					IsWorkday:{key:'entityIsWorkingDay'},
					BackgroundColor:{key:'entityBackgroundColor'},
					FontColor:{key:'entityFontColor'},
					WorkStart:{ key: 'entityWorkStart'},
					WorkEnd:{ key: 'entityWorkEnd'},
					IsShownInChart : {key:'entityIsShownInChart'}
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Code: { key: 'entityCode' },
					CommentText: { key: 'entityCommentText'}
				})
			}
		}
	} as IEntityInfo<ISchedulingCalendarExceptionDayEntity>);

	private readonly calendarWorkDayEntityInfo: EntityInfo = EntityInfo.create({
		grid: {
			title: {key:this.internalModuleName +'.workdayListHeader'},
			behavior: SCHEDULING_CALENDAR_WORK_DAY_BEHAVIOR_TOKEN
		},
		form: {
			title:{key:this.internalModuleName + '.workdayHeaderDetails'},
			containerUuid:'706816771be54eadb78b5c4e68253046'
		},
		dataService: ctx => ctx.injector.get(SchedulingCalendarWorkDayDataService),
		dtoSchemeId: {moduleSubModule: this.internalPascalCasedModuleName, typeName: 'WorkdayDto'},
		permissionUuid: '0e68e531cf85454992b4303f4ce62333',
		layoutConfiguration: {
			groups: [{gid: 'default-group', attributes: ['DescriptionInfo','CommentText','ExceptDate']}
			],
			overloads: {
			}
		},
		labels: {
				...prefixAllTranslationKeys('scheduling.calendar.', {
					WorkStart:{ key: 'entityWorkStart'},
					WorkEnd:{ key: 'entityWorkEnd'},
					ExceptDate:{ key: 'entityIsWorkingDay'}
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					CommentText: { key: 'entityCommentText'},
				})
		}

	} as IEntityInfo<ISchedulingCalendarWorkDayEntity>);

	private readonly calendarWeekDayEntityInfo: EntityInfo = EntityInfo.create({
		grid: {
			title: {key:this.internalModuleName +'.weekdayListHeader'},
			behavior: SCHEDULING_CALENDAR_WEEK_DAY_BEHAVIOR_TOKEN
		},
		form: '4196114c284b49efac5b4431bf9836b4',
		dataService: ctx => ctx.injector.get(SchedulingCalendarWeekDayDataService),
		dtoSchemeId: {moduleSubModule: this.internalPascalCasedModuleName, typeName: 'WeekdayDto'},
		permissionUuid: '4196114c284b49efac5b4431bf9836b2',
		layoutConfiguration: {
			groups: [{gid: 'default-group', attributes: ['AcronymInfo','WeekdayIndex','DescriptionInfo','Sorting','IsWeekend','BackgroundColor','FontColor']}
			],
			overloads: {
			}
		},
		labels: {
			...prefixAllTranslationKeys('scheduling.calendar.', {
				AcronymInfo: { key: 'entityAcronym'},
				WeekdayIndex:{key:'entityAcronym'},
				IsWeekend:{key:'entityIsWeekend'},
				BackgroundColor:{key:'entityBackgroundColor'},
				FontColor:{key:'entityFontColor'}
			})
		}

	} as IEntityInfo<ISchedulingCalendarWeekDayEntity>);

	private readonly calendarWorkHourEntityInfo: EntityInfo = EntityInfo.create({
		grid: {
			title: {key:this.internalModuleName +'.entityWorkHours'},
			behavior: SCHEDULING_CALENDAR_WORK_HOUR_BEHAVIOR_TOKEN
		},
		form: {
			title:{key:this.internalModuleName + '.entityWorkHoursDetails'},
			containerUuid:'50D82415E24C47ACA182C0F634EE9520'
		},
		dataService: ctx => ctx.injector.get(SchedulingCalendarWorkHourDataService),
		dtoSchemeId: {moduleSubModule: this.internalPascalCasedModuleName, typeName: 'WorkHourDto'},
		permissionUuid: '50d82415e24c47aca182c0f634ee9515',
		layoutConfiguration: {
			groups: [{gid: 'default-group', attributes: ['WeekdayFk','IsWorkingDay']}
			],
			overloads: {
				WeekdayFk:{
					type:FieldType.Lookup,
					lookupOptions:createLookup({
						dataServiceToken:SchedulingCalendarLookup,
						displayMember:'AcronymInfo.Description',
						valueMember:'Id'}
					)},
				IsWorkingDay:{visible:true,readonly:true}
			},
			labels :{
				...prefixAllTranslationKeys('scheduling.calendar.', {
					WeekdayFk: { key: 'entityWeekday' },
					 WorkStart: { key: 'entityWorkStart' },
					 WorkEnd: { key: 'entityWorkEnd' },
					IsWorkingDay:{key:'entityIsWorkingDay'}
				})
			}
		}
	} as IEntityInfo<ISchedulingCalendarWorkHourEntity>);
}