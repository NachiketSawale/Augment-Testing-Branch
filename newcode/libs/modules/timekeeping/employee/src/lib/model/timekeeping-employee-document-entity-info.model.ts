import { EntityInfo } from '@libs/ui/business-base';
import { IEmployeeDocumentEntity } from '@libs/timekeeping/interfaces';
import { ILayoutConfiguration } from '@libs/ui/common';
import { TimekeepingEmployeeDocumentDataService, TimekeepingEmployeeDocumentValidationService } from '../services';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { TimekeepingEmployeeDocumentBehaviorService } from '../behaviors/timekeeping-employee-document-behavior.service';

export const TimekeepingEmployeeDocumentEntityInfoModel: EntityInfo = EntityInfo.create<IEmployeeDocumentEntity> ({
	grid: {
		title: {key: 'timekeeping.employee.employeesDocument'},
		behavior: ctx => ctx.injector.get(TimekeepingEmployeeDocumentBehaviorService)
	},
	form: {
		title: {key: 'timekeeping.employee.employeesDocumentDetailTitle'},
		containerUuid: '33b305dec16b11edafa10242ac120002'
	},
	dataService: ctx => ctx.injector.get(TimekeepingEmployeeDocumentDataService),
	validationService: ctx => ctx.injector.get(TimekeepingEmployeeDocumentValidationService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.Employee', typeName: 'EmployeeDocumentDto'},
	permissionUuid: 'e36248434a2c47219b813546e5bcd8bd',
	layoutConfiguration: () => {
		return <ILayoutConfiguration<IEmployeeDocumentEntity>>{
			groups: [
				{
					gid: 'default',
					attributes: ['DocumentTypeFk', 'Description', 'EmployeeDocumentTypeFk', 'Date', 'Barcode', 'IsHiddenInPublicApi', 'Url','OriginFileName']
				}
			],
			labels: {
				...prefixAllTranslationKeys('timekeeping.employee.', {
					Barcode: {key: 'entityBarcode'},
					EmployeeDocumentTypeFk: {key: 'entityEmployeeDocumentTypeFk'},
					Date: {key: 'entityDate'},
					IsHiddenInPublicApi: {key: 'entityIsHiddenInPublicPpi'},
					Url: {key: 'entityUrl'},
					OriginFileName: {key: 'entityOriginFileName'}
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					DocumentTypeFk: {key: 'entityDocumentType'}
				})
			},
			overloads: {
				OriginFileName: {readonly: true},
				DocumentTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideDocumentTypeLookupOverload(true),
				EmployeeDocumentTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideTimekeepingEmployeeDocumentTypeLookupOverload(true)
			}
		};
	}
});