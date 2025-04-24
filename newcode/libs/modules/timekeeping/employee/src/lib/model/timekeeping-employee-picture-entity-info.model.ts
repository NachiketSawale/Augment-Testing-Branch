/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityContainerInjectionTokens, EntityInfo } from '@libs/ui/business-base';
import { IEmployeePictureEntity, IEmployeeEntity } from '@libs/timekeeping/interfaces';
import { ILayoutConfiguration } from '@libs/ui/common';
import { TimekeepingEmployeePictureDataService } from '../services';
import { PlatformConfigurationService, prefixAllTranslationKeys, ServiceLocator } from '@libs/platform/common';
import { BasicsSharedPhotoEntityViewerComponent, IPhotoEntityViewerContext, PHOTO_ENTITY_VIEWER_OPTION_TOKEN } from '@libs/basics/shared';
import { TimekeepingEmployeePictureValidationService } from '../services/timekeeping-employee-picture-validation.service';

export const configService = ServiceLocator.injector.get(PlatformConfigurationService);

export const TimekeepingEmployeePictureEntityInfoModel: EntityInfo = EntityInfo.create<IEmployeePictureEntity>({
	grid: {
		title: {key: 'timekeeping.employee.pictureListTitle'}
	},
	form: {
		title: {key: 'timekeeping.employee.pictureViewTitle'},
		containerUuid: '14d107fb61184d6abb207033aef44e47',
		containerType: BasicsSharedPhotoEntityViewerComponent,
		providers: [{
			provide: new EntityContainerInjectionTokens<IEmployeeEntity>().dataServiceToken,
			useExisting: TimekeepingEmployeePictureDataService
		}, {
			provide: PHOTO_ENTITY_VIEWER_OPTION_TOKEN,
			useValue: {
				isSyncMode: false,
				isSingle: true,
				hideChangeItem: true,
				blobFieldName: 'BlobsFk',
				dtoName: 'DependingDto',
				deleteUrl: configService.webApiBaseUrl + 'timekeeping/employee/picture/deletepicture',
				importUrl: configService.webApiBaseUrl + 'timekeeping/employee/picture/createpicture',
				getUrl: configService.webApiBaseUrl + 'timekeeping/employee/picture/exportpicture',
				canCreate: (context: IPhotoEntityViewerContext) => {
					const employeeService = ServiceLocator.injector.get(TimekeepingEmployeePictureDataService);
					const selected = employeeService.getSelectedEntity();
					return selected && employeeService.getEntityReadOnlyFields(selected).length === 0 && context.canCreate.call(context.component);
				},
				canDelete: (context: IPhotoEntityViewerContext) => {
					const employeeService = ServiceLocator.injector.get(TimekeepingEmployeePictureDataService);
					const selected = employeeService.getSelectedEntity();
					return selected && employeeService.getEntityReadOnlyFields(selected).length === 0 && context.canDelete.call(context.component);
				},
				/* TODO processors: () => {
					const employeeService = ServiceLocator.injector.get(TimekeepingEmployeeDataService);
					return employeeService.getProcessors();
				}*/
			}
		}]
	},
	dataService: ctx => ctx.injector.get(TimekeepingEmployeePictureDataService),
	validationService: ctx => ctx.injector.get(TimekeepingEmployeePictureValidationService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.Employee', typeName: 'EmployeePictureDto'},
	permissionUuid: 'cb717989d7494402a312e14f00974d51',

	layoutConfiguration: async ctx => {
		return <ILayoutConfiguration<IEmployeePictureEntity>>{
			groups: [
				{
					gid: 'default',
					attributes: ['Comment', 'PictureDate', 'IsDefault']
				}
			],
			labels: {
				...prefixAllTranslationKeys('timekeeping.employee.', {
					PictureDate: {key: 'entityPictureDate'}
				})
			}
		};
	}
});
