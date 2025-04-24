	/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

	import { prefixAllTranslationKeys } from '@libs/platform/common';
   import { IActionEmployeeEntity } from '@libs/project/interfaces';
	import { TimekeepingEmployeeLookupService } from '@libs/timekeeping/shared';
	import { EntityInfo } from '@libs/ui/business-base';
	import { createLookup, FieldType } from '@libs/ui/common';
	import { ProjectMainActionEmployeeDataService } from '../services/project-main-action-employee-data.service';

	export const PROJECT_MAIN_ACTION_EMPLOYEE_ENTITY_INFO: EntityInfo = EntityInfo.create<IActionEmployeeEntity> ({
		grid: {
			title: {key:'project.main' + 'actionEmployeeListTitle'}
		},
		form: {
			title: { key: 'project.main' + '.actionEmployeeDetailsTitle' },
			containerUuid: '8e59e6b041084802a12a64d7e52a2b43',
		},
		dataService: ctx => ctx.injector.get(ProjectMainActionEmployeeDataService),
		dtoSchemeId: {moduleSubModule: 'Project.Main', typeName: 'ActionEmployeeDto'},
		permissionUuid: 'a10753eb750d4f208863daef08e31f0d',
		layoutConfiguration: {
			groups: [
				{gid: 'baseGroup', attributes: ['EmployeeFk','Comment'] },
			],
			overloads: {
				EmployeeFk:{
					type:FieldType.Lookup,
					lookupOptions:createLookup({
						dataServiceToken:TimekeepingEmployeeLookupService}
					)}
			},
			labels: {
				...prefixAllTranslationKeys('project.main.', {
					Comment: { key: 'entityCommentText' },
				}),
				...prefixAllTranslationKeys('timekeeping.common.', {
					EmployeeFk: { key: 'employee' },
				}),

			},
		}

	});
