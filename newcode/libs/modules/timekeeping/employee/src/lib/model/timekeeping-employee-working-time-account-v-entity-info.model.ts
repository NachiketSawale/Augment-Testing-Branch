/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IWorkingTimeAccountVEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingEmployeeWorkingTimeAccountVDataService } from '../services';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { BasicsShareControllingUnitLookupService, BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedTimeSymbolGroupLookupService } from '@libs/basics/shared';
import { TIME_SYMBOL_LOOKUP_PROVIDER_TOKEN, WORK_TIME_MODEL_LOOKUP_PROVIDER_TOKEN } from '@libs/timekeeping/interfaces';


export const TimekeepingEmployeeWorkingTimeAccountVEntityInfo: EntityInfo = EntityInfo.create<IWorkingTimeAccountVEntity> ({
	grid: {
		title: {key: 'timekeeping.employee.employeeWorkingTimeAccountListTitle'},
	},
	form: {
		title: { key: 'timekeeping.employee.employeeWorkingTimeAccountDetailTitle' },
		containerUuid: '285614dd3e3847189844bafa8f029f7f',
	},
	dataService: ctx => ctx.injector.get(TimekeepingEmployeeWorkingTimeAccountVDataService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.Employee', typeName: 'WorkingTimeAccountVDto'},
	permissionUuid: 'e66a0a6fad844616b5c4c8be9de1c170',

	layoutConfiguration: async ctx => {
		const timeSymbolLookupProvider = await ctx.lazyInjector.inject(TIME_SYMBOL_LOOKUP_PROVIDER_TOKEN);
		const workingTimeModelLookupProvider = await ctx.lazyInjector.inject(WORK_TIME_MODEL_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<IWorkingTimeAccountVEntity>>{
			groups: [
				{
					gid: 'default-group',
					attributes: ['DueDate', 'Duration', 'FromDateTime', 'ToDateTime', 'TimeSymbolFk', 'TimeSymbolGroupFk', 'ProjectActionFk', 'ReportstatusFk', 'ControllingunitFk', 'SheetFk', 'WorkingTimeModelFk']
				}
			],
			labels: {
				...prefixAllTranslationKeys('timekeeping.employee.', {
					FromDateTime: {key: 'entityFromDateTime'},
					ToDateTime: {key: 'entityToDateTime'},
					DueDate: {key: 'entityDueDate'},
					Duration: {key: 'entityDuration'},
					TimeSymbolFk: {key: 'entityTimesymbolFk'},
					TimeSymbolGroupFk: {key: 'entityTimeSymbolGroup'},
					ProjectActionFk: {key: 'entityProjectAction'},
					ReportstatusFk: {key: 'entityReportStatus'},
					ControllingunitFk: {key: 'entityControllingunit'},
					SheetFk: {key: 'entitySheet'},
					WorkingTimeModelFk: {key: 'EntityEmployeeWorkingtimeModelFk'}
				})
			},
			overloads: {
				FromDateTime: {readonly: true},
				ToDateTime: {readonly: true},
				DueDate: {readonly: true},
				Duration: {readonly: true},
				TimeSymbolFk: timeSymbolLookupProvider.generateTimeSymbolLookup({
					preloadTranslation: 'timekeeping.worktimemodel.entity',
					readonly: true
				}),
				TimeSymbolGroupFk: {
					readonly: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedTimeSymbolGroupLookupService,
					})
				},
				ProjectActionFk: {
					readonly: true,
					//TODO lookup
				},
				ReportstatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideTimekeepingReportStatusReadonlyLookupOverload(),
				ControllingunitFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsShareControllingUnitLookupService
					}),
					readonly: true,
				},
				SheetFk: BasicsSharedCustomizeLookupOverloadProvider.providePerformanceSheetReadonlyLookupOverload(),
				WorkingTimeModelFk: workingTimeModelLookupProvider.generateWorkTimeModelLookup()
			}
		};
	}
});