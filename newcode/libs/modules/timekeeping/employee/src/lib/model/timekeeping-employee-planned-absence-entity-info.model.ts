/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import { IPlannedAbsenceEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingEmployeePlannedAbsenceDataService, TimekeepingEmployeePlannedAbsenceValidationService, TimekeepingEmployeeDataService } from '../services';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { TIME_SYMBOL_LOOKUP_PROVIDER_TOKEN } from '@libs/timekeeping/interfaces';
import { CONTROLLING_UNIT_LOOKUP_PROVIDER_TOKEN, IControllingUnitLookupEntity } from '@libs/controlling/interfaces';

export const TimekeepingEmployeePlannedAbsenceEntityInfo: EntityInfo = EntityInfo.create<IPlannedAbsenceEntity> ({
	grid: {
		title: {key: 'timekeeping.employee.plannedAbsenceListTitle'},
	},
	form: {
		title: { key: 'timekeeping.employee.plannedAbsenceDetailTitle' },
		containerUuid: '4933b71664ea4c4db200937bd6e39cdb',
	},
	dataService: ctx => ctx.injector.get(TimekeepingEmployeePlannedAbsenceDataService),
	validationService: ctx => ctx.injector.get(TimekeepingEmployeePlannedAbsenceValidationService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.Employee', typeName: 'PlannedAbsenceDto'},
	permissionUuid: 'fdf3f45827f6410f8c89536f03982064',

	layoutConfiguration: async ctx => {
		const timeSymbolLookupProvider = await ctx.lazyInjector.inject(TIME_SYMBOL_LOOKUP_PROVIDER_TOKEN);
		const controllingUnitLookupProvider = await ctx.lazyInjector.inject(CONTROLLING_UNIT_LOOKUP_PROVIDER_TOKEN);

		return <ILayoutConfiguration<IPlannedAbsenceEntity>>{
			groups: [
				{
					gid: 'default-group',
					attributes: ['PlannedAbsenceStatusFk', 'FromDateTime', 'ToDateTime', 'Absenceday', 'TimeSymbolFk', 'ControllingUnitFk', 'Comment','FromTime','ToTime']
				}
			],
			labels: {
				...prefixAllTranslationKeys('timekeeping.employee.', {
					FromDateTime: {key: 'entityFromDateTime'},
					ToDateTime: {key: 'entityToDateTime'},
					TimesymbolFk: {key: 'entityTimesymbolFk'},
					PlannedAbsenceStatusFk: {key: 'PlannedAbsenceStatusFk'},
					Absenceday: {key: 'entityAbsenceday'},
					TimeSymbolFk: {key: 'entityTimesymbolFk'},
					ControllingUnitFk: {key: 'entityControllingunit'},
					FromTime: {key: 'entityFromTime'},
					ToTime: {key: 'entityToTime'}
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Comment: {key: 'entityComment'},
				})
			},
			overloads: {
				TimeSymbolFk: timeSymbolLookupProvider.generateTimeSymbolLookup({
					preloadTranslation: 'timekeeping.worktimemodel.entity',
				}),
				PlannedAbsenceStatusFk: BasicsSharedCustomizeLookupOverloadProvider.providePlannedAbsenceStatusReadonlyLookupOverload(),
				ControllingUnitFk: await controllingUnitLookupProvider.generateControllingUnitLookup(ctx, {
					checkIsAccountingElement: true,
					controllingUnitGetter: e => e.ControllingUnitFk,
					lookupOptions: {
						showClearButton: true,
						showDescription: true,
						descriptionMember: 'DescriptionInfo.Translated',
						serverSideFilter: {
							key: 'scheduling.main.controllingunit.project.context.filter',
							execute: (context: ILookupContext<IControllingUnitLookupEntity, IPlannedAbsenceEntity>) => {
								return {
									ByStructure: true,
									ExtraFilter: false,
									CompanyFk: context.injector.get(TimekeepingEmployeeDataService).getSelectedEntity()?.CompanyFk
								};
							},
						}
					}
				})
			}
		};
	}
});