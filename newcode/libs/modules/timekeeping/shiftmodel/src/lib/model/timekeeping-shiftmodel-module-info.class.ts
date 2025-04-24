/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { TimekeepingShiftModelDataService } from '../services/timekeeping-shift-model-data.service';
import { TimekeepingShiftModelExceptionDayDataService } from '../services/timekeeping-shift-model-exception-day-data.service';
import { TimekeepingShiftModel2GroupDataService } from '../services/timekeeping-shift-model2-group-data.service';
import { TimekeepingShiftModelBreakDataService } from '../services/timekeeping-shift-model-break-data.service';
import { TimekeepingShiftModelWorkingTimeDataService } from '../services/timekeeping-shift-model-working-time-data.service';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { SchedulingCalendarWeekdayLookup } from '@libs/scheduling/shared';
import { TimekeepingTimeSymbolLookupService } from '@libs/timekeeping/shared';
import { SchedulingCalendarExceptionDayLookupService } from '@libs/scheduling/shared';
import { SchedulingCalendarLookup } from '@libs/scheduling/shared';
import { BasicsSharedTimekeepingShiftGroupLookupService } from '@libs/basics/shared';
import {prefixAllTranslationKeys } from '@libs/platform/common';
import { IShiftEntity } from './entities/shift-entity.interface';
import { IExceptionDayEntity } from './entities/exception-day-entity.interface';
import { IShiftBreakEntity } from './entities/shift-break-entity.interface';
import { IShiftWorkingTimeEntity } from './entities/shift-working-time-entity.interface';
import { IShift2GroupEntity } from './entities/shift-2group-entity.interface';
import { TimekeepingShiftModelWorkingTimeValidationService } from '../services/validations/timekeeping-shiftmodel-working-time-validation.service';
import { TimekeepingShiftModelBreakValidationService } from '../services/validations/timekeeping-shift-model-break-validation.service';
import { TIMEKEEPING_GROUP_LOOKUP_PROVIDER_TOKEN } from '@libs/timekeeping/interfaces';

/**
 * The module info object for the `timekeeping.shiftmodel` content module.
 */
export class TimekeepingShiftmodelModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: TimekeepingShiftmodelModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): TimekeepingShiftmodelModuleInfo {
		if (!this._instance) {
			this._instance = new TimekeepingShiftmodelModuleInfo();
		}

		return this._instance;
	}

	/**
	 * Initializes the module information of timekeeping shiftmodel module
	 */
	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module
	 * @returns {string}
	 */
	public override get internalModuleName(): string {
		return 'timekeeping.shiftmodel';
	}

	public override get translationContainer() : string {
		return 'c19bf3d2ae9f46aabbefe3d2b1e10758';
	}

	private get moduleSubModule(): string {
		return 'Timekeeping.ShiftModel';
	}

	/**
	 * Returns the entities used by the module.
	 * @returns The list of entities.
	 */
	public override get entities(): EntityInfo[] {
		return [
			this.shiftModelEntityInfo,
			this.shiftModelExceptionDayEntityInfo,
			this.shiftModelBreakEntityInfo,
			this.shiftModelWorkingTimeEntityInfo,
			this.shiftModel2GroupEntityInfo
		];
	}

	/**
	 * Loads the translation file used for timekeeping shiftmodel
	 */
	public override get preloadedTranslations(): string[] {
		return [
			'timekeeping.shiftmodel','scheduling.calendar','cloud.common','timekeeping.employee','timekeeping.worktimemodel'
		];
	}

	private readonly shiftModelEntityInfo: EntityInfo = EntityInfo.create( {
			grid: {
				title: {key: this.internalModuleName + '.shiftListTitle'}
			},
			form: {
				title: { key: this.internalModuleName + '.shiftDetailTitle' },
				containerUuid:'3f8b36e4b22441e7a994dd85e610567f'
			},
		dataService: ctx => ctx.injector.get(TimekeepingShiftModelDataService),
			dtoSchemeId: {moduleSubModule: this.moduleSubModule, typeName: 'ShiftDto'},
			permissionUuid: 'c271fb74bb5c4e7dbfadc1222f1bb8ef',
			layoutConfiguration: {
				groups: [{gid: 'default-group', attributes: [
					'DescriptionInfo', 'CalendarFk', 'IsDefault', 'Sorting', 'DefaultWorkdayFk', 'ShiftGroupFk']}
				],
				overloads: {
					CalendarFk:
						{
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataServiceToken: SchedulingCalendarLookup
							})
						},
					DefaultWorkdayFk:
						{
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataServiceToken: SchedulingCalendarWeekdayLookup
							})
						},
					ShiftGroupFk:
						{
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataServiceToken: BasicsSharedTimekeepingShiftGroupLookupService
							})
						}
						},
				labels:
					{
						...prefixAllTranslationKeys('cloud.common.', {
							CalendarFk: {key: 'entityCalCalendarFk'}
						}),
						...prefixAllTranslationKeys(this.internalModuleName, {
							DefaultWorkdayFk: {key: '.entityDefaultWorkday'},
							ShiftGroupFk: {key: '.entityShiftGroup'}
						})
					}
			}
		}as IEntityInfo<IShiftEntity>);

	private readonly shiftModelExceptionDayEntityInfo: EntityInfo = EntityInfo.create( {
			grid: {
				title: {key: this.internalModuleName + '.shiftExceptionDayListTitle'},
			},
			form: {
				title: { key: this.internalModuleName + '.shiftExceptionDayDetailTitle' },
				containerUuid:'f95528f510124a91a6195954d746ee60'
			},
		dataService: ctx => ctx.injector.get(TimekeepingShiftModelExceptionDayDataService),
			dtoSchemeId: {moduleSubModule: this.moduleSubModule, typeName: 'ExceptionDayDto'},
			permissionUuid: '63d97d8327c249cfa91e3eb4b426162c',
			layoutConfiguration: {
				groups: [{gid: 'default-group', attributes: [
						'DescriptionInfo', 'CommentText', 'ExceptDate', 'TimeSymbolFk', 'Duration', 'IsWorkday', 'TimeSymWorkOnHolidayFk']}
				],
				overloads: {
					TimeSymbolFk:
						{
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataServiceToken: TimekeepingTimeSymbolLookupService
							})
						},
					TimeSymWorkOnHolidayFk:
						{
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataServiceToken: TimekeepingTimeSymbolLookupService
							})
						}
				},
				labels:
					{
						...prefixAllTranslationKeys(this.internalModuleName, {
							ExceptDate: {key: '.entityExceptDate'},
							TimeSymbolFk: {key: '.entityTimeSymbolFk'},
							IsWorkday: {key: '.entityIsWorkday'},
							TimeSymWorkOnHolidayFk: {key: '.entityTimeSymWorkOnHoliday'},
						}),
						...prefixAllTranslationKeys('timekeeping.employee', {
							Duration: {key: '.entityDuration'}
						}),
						...prefixAllTranslationKeys('cloud.common', {
							CommentText: {key: '.entityCommentText'}
						})
					}
			}
		}as IEntityInfo<IExceptionDayEntity>);

	private readonly shiftModelBreakEntityInfo: EntityInfo = EntityInfo.create( {
			grid: {
				title: {key: this.internalModuleName + '.recordingBreakListTitle'},
			},
			form: {
				title: { key: this.internalModuleName + '.recordingBreakDetailTitle' },
				containerUuid:'0de2fa1dac2c409980fd98dd96063391'
			},
		dataService: ctx => ctx.injector.get(TimekeepingShiftModelBreakDataService),
		validationService: ctx => ctx.injector.get(TimekeepingShiftModelBreakValidationService),
			dtoSchemeId: {moduleSubModule: this.moduleSubModule, typeName: 'ShiftBreakDto'},
			permissionUuid: 'e0004627cb3846fc9071394d96e52702',
			layoutConfiguration: {
				groups: [{gid: 'default-group', attributes: [
						'BreakStart', 'BreakEnd', 'Duration', 'ISStartAfterMidnight', 'ISEndAfterMidnight'  ]}
				],
				labels: {
					...prefixAllTranslationKeys(this.internalModuleName, {
						ISStartAfterMidnight: {key: '.entityStartAfterMidnight'},
						ISEndAfterMidnight: {key: '.entityEndAfterMidnight'},
						BreakStart: {key: '.entityBreakStart'},
						BreakEnd: {key: '.entityBreakEnd'}
					}),
					...prefixAllTranslationKeys('timekeeping.employee', {
						Duration: {key: '.entityDuration'}
					})
				}
			}
		}as IEntityInfo<IShiftBreakEntity>);

	private readonly shiftModelWorkingTimeEntityInfo: EntityInfo = EntityInfo.create( {
			grid: {
				title: {key: this.internalModuleName + '.shiftWorkingTimeListTitle'},
			},
			form: {
				title: { key: this.internalModuleName + '.shiftWorkingTimeDetailTitle' },
				containerUuid:'dd118689baf94608808fad8c942b565f'
			},
			dataService: ctx => ctx.injector.get(TimekeepingShiftModelWorkingTimeDataService),
			validationService: ctx => ctx.injector.get(TimekeepingShiftModelWorkingTimeValidationService),
			dtoSchemeId: {moduleSubModule: this.moduleSubModule, typeName: 'ShiftWorkingTimeDto'},
			permissionUuid: '370d136ef46d4c13a7b3ce9bf8b1e5e4',
			layoutConfiguration: {
				groups: [{gid: 'default-group', attributes: [
						'FromTime','ToTime','Acronym', 'DescriptionInfo', 'TimeSymbolFk', 'WeekdayFk', 'ExceptionDayFk', 'CommentText', 'BreakFrom', 'BreakTo','Duration']}
				],
				overloads: {
					TimeSymbolFk:
						{
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataServiceToken: TimekeepingTimeSymbolLookupService
							})
						},
					WeekdayFk:
						{
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataServiceToken: SchedulingCalendarWeekdayLookup
							})
						},
					ExceptionDayFk:
						{
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataServiceToken: SchedulingCalendarExceptionDayLookupService
							})
						}
				},
				labels: {
					...prefixAllTranslationKeys(this.internalModuleName, {
						TimeSymbolFk: {key: '.entityTimeSymbolFk'},
						WeekdayFk: {key: '.entityWeekday'},
						ExceptionDayFk: {key: '.entityExceptionDay'},
						BreakFrom: {key: '.entityBreakStart'},
						BreakTo: {key: '.entityBreakEnd'},
					}),
					...prefixAllTranslationKeys('scheduling.calendar', {
						Acronym: {key: '.entityAcronym'}
					}),
					...prefixAllTranslationKeys('timekeeping.worktimemodel.', {
						FromTime: {key: 'entityFromTime'},
						ToTime: {key: 'entityToTime'},
					}),
					...prefixAllTranslationKeys('cloud.common', {
						CommentText: {key: '.entityCommentText'}
					})
				}
			}
		}as IEntityInfo<IShiftWorkingTimeEntity>);

	private readonly shiftModel2GroupEntityInfo: EntityInfo = EntityInfo.create( {
			grid: {
				title: {key: this.internalModuleName + '.shift2GroupListTitle'},
			},
			form: {
				title: { key: this.internalModuleName + '.shift2GroupDetailTitle' },
				containerUuid:'2da1e64a72a64ffca12dd12c1968e88b'
			},
			dataService: ctx => ctx.injector.get(TimekeepingShiftModel2GroupDataService),
			dtoSchemeId: {moduleSubModule: this.moduleSubModule, typeName: 'Shift2GroupDto'},
			permissionUuid: '7809c35d6f0840fe83d3637f62d41138',
			layoutConfiguration : async ctx => {
				const timekeepingGroupLookupProvider = await ctx.lazyInjector.inject(TIMEKEEPING_GROUP_LOOKUP_PROVIDER_TOKEN);
				return <ILayoutConfiguration<IShift2GroupEntity>>{
					groups: [
						{gid: 'default',attributes: ['TimekeepingGroupFk','CommentText']},
					],
					overloads: {
						TimekeepingGroupFk: timekeepingGroupLookupProvider.generateTimekeepingGroupLookup(),
					},
					labels: {
						...prefixAllTranslationKeys(this.internalModuleName, {
							TimekeepingGroupFk: {key: '.entityTimekeepingGroup'}
						}),
						...prefixAllTranslationKeys('cloud.common', {
							CommentText: {key: '.entityCommentText'}
						})
					}
				};
			}
		}as IEntityInfo<IShift2GroupEntity>);
}
