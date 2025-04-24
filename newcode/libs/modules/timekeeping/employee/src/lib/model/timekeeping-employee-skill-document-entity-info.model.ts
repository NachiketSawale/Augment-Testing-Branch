/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IEmployeeSkillDocumentEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingEmployeeSkillDocumentService, TimekeepingEmployeeSkillDocumentValidationService } from '../services';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedTimekeepingEmployeeSkillDocumentTypeLookupService } from '@libs/basics/shared';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { TimekeepingEmployeeSkillDocumentBehaviorService } from '../behaviors/timekeeping-employee-skill-document-behavior.service';


export const TimekeepingEmployeeSkillDocumentEntityInfoModel: EntityInfo = EntityInfo.create<IEmployeeSkillDocumentEntity> ({
	grid: {
		title: {key: 'timekeeping.employee.skillDocumentListTitle'},
		behavior: ctx => ctx.injector.get(TimekeepingEmployeeSkillDocumentBehaviorService)
	},
	form: {
		title: { key: 'timekeeping.employee.skillDocumentDetailTitle' },
		containerUuid: 'd8704e0684b047ea949e6785f6a6ee92'
	},
	dataService: ctx => ctx.injector.get(TimekeepingEmployeeSkillDocumentService),
	validationService: ctx => ctx.injector.get(TimekeepingEmployeeSkillDocumentValidationService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.Employee', typeName: 'EmployeeSkillDocumentDto'},
	permissionUuid: '1aefc92216ac4bd6b614aae9b54e0dbc',

	layoutConfiguration: () => {
		return <ILayoutConfiguration<IEmployeeSkillDocumentEntity>>{
			groups: [
				{
					gid: 'default',
					attributes: ['Description', 'EmployeeSkillDocTypeFk', 'DocumentTypeFk', 'Date', 'Barcode', 'OriginFileName']
				}
			],
			overloads: {
				OriginFileName: {readonly: true},
				EmployeeSkillDocTypeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedTimekeepingEmployeeSkillDocumentTypeLookupService
					})
				},
				DocumentTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideDocumentTypeLookupOverload(true),
			},
			labels: {
				...prefixAllTranslationKeys('timekeeping.employee.', {
					Barcode: {key: 'entityBarcode'},
					EmployeeSkillDocTypeFk: {key: 'entityEmployeeSkillDocTypeFk'},
					DocumentTypeFk: {key: 'entityEmployeeDocumentTypeFk'},
					Date: {key: 'entityDate'},
					OriginFileName: {key: 'entityOriginFileName'}
				})
			}
		};
	}
});