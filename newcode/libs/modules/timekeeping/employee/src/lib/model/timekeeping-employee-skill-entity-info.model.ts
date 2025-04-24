/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IEmployeeSkillEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingEmployeeSkillDataService, TimekeepingEmployeeSkillValidationService } from '../services';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { ResourceSkillLookupService } from '@libs/resource/shared';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';


export const TimekeepingEmployeeSkillEntityInfo: EntityInfo = EntityInfo.create<IEmployeeSkillEntity> ({
	grid: {
		title: {key: 'timekeeping.employee.employeeSkillListTitle'},
	},
	form: {
		title: { key: 'timekeeping.employee.employeeSkillDetailTitle' },
		containerUuid: '3a0dc9c87b63405895bbe38caff26e0b',
	},
	dataService: ctx => ctx.injector.get(TimekeepingEmployeeSkillDataService),
	validationService: ctx => ctx.injector.get(TimekeepingEmployeeSkillValidationService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.Employee', typeName: 'EmployeeSkillDto'},
	permissionUuid: 'a0ce2e3271734b7db3e13b2b6c2ad44a',

	layoutConfiguration: () => {
		return <ILayoutConfiguration<IEmployeeSkillEntity>>{
			groups: [
				{
					gid: 'default-group',
					attributes: ['SkillFk', 'ValidTo', 'CommentText', 'RefreshDate', 'Duration', 'LeadDays', 'EmployeeSkillStatusFk']
				}
			],
			labels: {
				...prefixAllTranslationKeys('timekeeping.employee.', {
					ValidTo: {key: 'EntityValidTo'},
					SkillFk: {key: 'employeeSkillListTitle'},
					RefreshDate: {key: 'entityRefreshDate'},
					Duration: {key: 'entityDuration'},
					LeadDays: {key: 'entityLeaddays'},
					EmployeeSkillStatusFk: {key: 'employeeSkillStatusFk'}
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					CommentText: {key: 'entityCommentText'},
				})
			},
			overloads: {
				SkillFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ResourceSkillLookupService
					})
				},
				EmployeeSkillStatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideTimekeepingEmployeeSkillStatusReadonlyLookupOverload()
			}
		};
	}
});