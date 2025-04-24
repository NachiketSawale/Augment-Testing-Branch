/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { addUserDefinedDateTranslation, addUserDefinedNumberTranslation, addUserDefinedTextTranslation, prefixAllTranslationKeys } from '@libs/platform/common';
import { ICrewAssignmentEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingCrewAssignmentDataService, TimekeepingCrewAssignmentValidationService } from '../services';
import { ILayoutConfiguration } from '@libs/ui/common';
import { CREW_LEADER_LOOKUP_PROVIDER_TOKEN } from '@libs/timekeeping/interfaces';



export const TimekeepingEmployeeCrewAssignmentModelEntityInfoModel: EntityInfo = EntityInfo.create<ICrewAssignmentEntity> ({
	grid: {
		title: {key: 'timekeeping.employee.crewAssignmentListTitle'},
	},
	form: {
		title: { key: 'timekeeping.employee.crewAssignmentDetailTitle' },
		containerUuid: '0326e2061c0f45a790536a4741ec137c',
	},
	dataService: ctx => ctx.injector.get(TimekeepingCrewAssignmentDataService),
	validationService: ctx => ctx.injector.get(TimekeepingCrewAssignmentValidationService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.Employee', typeName: 'CrewAssignmentDto'},
	permissionUuid: 'b89f95becdc44a84ba8cf3f32f2f06cf',

	layoutConfiguration: async ctx => {
		const crewLeaderLookupProvider = await ctx.lazyInjector.inject(CREW_LEADER_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<ICrewAssignmentEntity>> {
			groups: [
				{
					gid: 'default-group',
					attributes: ['FromDateTime', 'ToDateTime', 'EmployeeCrewFk', 'Comment']
				},
				{
					gid: 'userDefTexts',
					attributes: ['UserDefinedText01', 'UserDefinedText02', 'UserDefinedText03', 'UserDefinedText04', 'UserDefinedText05']
				}, {
					gid: 'userDefNumbers',
					attributes: ['UserDefinedNumber01', 'UserDefinedNumber02', 'UserDefinedNumber03', 'UserDefinedNumber04', 'UserDefinedNumber05']
				}, {
					gid: 'userDefDates',
					attributes: ['UserDefinedDate01', 'UserDefinedDate02', 'UserDefinedDate03', 'UserDefinedDate04', 'UserDefinedDate05']
				}
			],
			labels: {
				...prefixAllTranslationKeys('timekeeping.employee.', {
					FromDateTime: {key: 'entityFromDateTime'},
					ToDateTime: {key: 'entityToDateTime'},
					EmployeeCrewFk: {key: 'entityCrewLeader'}
				}),
				...addUserDefinedTextTranslation({ UserDefinedText: {key: 'entityUserDefinedText',params: { 'p_0': 1 }} }, 5, 'UserDefinedText', '', 'userDefTextGroup'),
				...addUserDefinedNumberTranslation({ UserDefinedNumber: {key: 'entityUserDefinedNumber',params: { 'p_0': 1 }} }, 5, 'UserDefinedNumber', '', 'userDefNumberGroup'),
				...addUserDefinedDateTranslation({ UserDefinedDate: {key: 'entityUserDefDate',params: { 'p_0': 1 }} }, 5, 'UserDefinedDate', '', 'userDefDateGroup'),
			},
			overloads: {
				EmployeeCrewFk: crewLeaderLookupProvider.generateCrewLeaderLookup({
					preloadTranslation: 'timekeeping.employee.entityEmployee'
				})
			}
		};
	}
});