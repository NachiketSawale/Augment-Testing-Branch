/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IEmployeeDefaultEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingEmployeeDataService, TimekeepingEmployeeDefaultDataService, TimekeepingEmployeeDefaultValidationService } from '../services';
import { ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import { CONTROLLING_UNIT_LOOKUP_PROVIDER_TOKEN, IControllingUnitLookupEntity } from '@libs/controlling/interfaces';


export const TimekeepingEmployeeDefaultModelEntityInfoModel: EntityInfo = EntityInfo.create<IEmployeeDefaultEntity> ({
	grid: {
		title: {key: 'timekeeping.employee.employeeDefaultListTitle'},
	},
	form: {
		title: { key: 'timekeeping.employee.employeeDefaultDetailTitle' },
		containerUuid: '5c0b3429333b401a90057101a209c85c',
	},
	dataService: ctx => ctx.injector.get(TimekeepingEmployeeDefaultDataService),
	validationService: ctx => ctx.injector.get(TimekeepingEmployeeDefaultValidationService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.Employee', typeName: 'EmployeeDefaultDto'},
	permissionUuid: 'e5a38b354fe84b39b6d541ec661acb7e',

	layoutConfiguration: async ctx => {
		const controllingUnitLookupProvider = await ctx.lazyInjector.inject(CONTROLLING_UNIT_LOOKUP_PROVIDER_TOKEN);

		return <ILayoutConfiguration<IEmployeeDefaultEntity>>{
			groups: [
				{
					gid: 'default-group',
					attributes: ['From', 'ControllingUnitFk', 'Comment']
				}
			],
			labels: {
				...prefixAllTranslationKeys('timekeeping.employee.', {
					From: {key: 'entityFromDateTime'},
					ControllingUnitFk: {key: 'entityControllingunit'}
				})
			},
			overloads: {
				ControllingUnitFk: await controllingUnitLookupProvider.generateControllingUnitLookup(ctx, {
					checkIsAccountingElement: true,
					controllingUnitGetter: e => e.ControllingUnitFk,
					lookupOptions: {
						showClearButton: true,
						showDescription: true,
						descriptionMember: 'DescriptionInfo.Translated',
						serverSideFilter: {
							key: 'scheduling.main.controllingunit.project.context.filter',
							execute: (context: ILookupContext<IControllingUnitLookupEntity, IEmployeeDefaultEntity>) => {
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