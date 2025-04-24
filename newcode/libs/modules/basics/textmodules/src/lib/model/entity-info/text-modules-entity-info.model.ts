import {ITextModuleEntity} from '../entities/textmodule-entity.interface';
import {EntityInfo} from '@libs/ui/business-base';
import {TextModulesGridBehaviorService} from '../../behaviors/text-modules-grid-behavior.service';
import {BasicsTextModulesMainService} from '../../services/text-modules-main-data.service';
import {createLookup, FieldType, ILookupContext, LookupSimpleEntity} from '@libs/ui/common';
import * as _ from 'lodash';
import {ServiceLocator} from '@libs/platform/common';
import {BasicsCompanyLookupService, BasicsSharedClerkLookupService} from '@libs/basics/shared';
import { IBasicsClerkEntity, ICompanyEntity } from '@libs/basics/interfaces';
import {MODULE_INFO_TEXTMODULES} from './module-info-textmodules.model';
import {
	BasicsSharedTextModuleTypeSimpleLookupService,
	BasicsSharedTextFormatSimpleLookupService,
	BasicsSharedPortalUserGroupSimpleLookupService,
	BasicsSharedRubricSimpleLookupService,
	BasicsSharedTextModuleContextSimpleLookupService
} from '@libs/basics/shared';

export const TEXT_MODULES_ENTITY_INFO = EntityInfo.create<ITextModuleEntity>({
	grid: {
		title: {
			text: 'Items',
			key: MODULE_INFO_TEXTMODULES.textModulesModuleName + '.textAssemblyGridTitle'
		},
		behavior: ctx => ctx.injector.get(TextModulesGridBehaviorService)
	},
	form: {
		title: {
			text: 'Item Details',
			key: MODULE_INFO_TEXTMODULES.textModulesModuleName + '.textAssemblyDetailTitle'
		},
		containerUuid: '97adfe1cf71f460bb7669fa6b8391cd8'
	},
	dataService: ctx => ctx.injector.get(BasicsTextModulesMainService),
	dtoSchemeId: {
		moduleSubModule: MODULE_INFO_TEXTMODULES.textModulesPascalCasedModuleName,
		typeName: 'TextModuleDto',
	},
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				attributes: ['TextModuleContextFk', 'Code', 'descriptioninfo', 'IsLive', 'TextModuleTypeFk', 'islanguagedependent',
					'TextFormatFk', 'Client', 'RubricFk', 'ClerkFk', 'AccessRoleFk', 'PortalUserGroupFk']
			}
		],
		overloads: {
			'TextModuleContextFk': {
				label: {
					text: 'Text Module Context',
					key: MODULE_INFO_TEXTMODULES.companyModuleName + '.entityTextModuleContextFk'
				},
				visible: true,
				type: FieldType.Lookup,
				lookupOptions: createLookup<ITextModuleEntity, LookupSimpleEntity>({
					dataServiceToken: BasicsSharedTextModuleContextSimpleLookupService,
					clientSideFilter: {
						execute(item: LookupSimpleEntity, context: ILookupContext<LookupSimpleEntity, ITextModuleEntity>): boolean {
							const id = _.get(item, 'Id');
							const dataService = ServiceLocator.injector.get(BasicsTextModulesMainService);
							const currentTextModuleContextId = dataService.currentTextModuleContextId;
							return id === 0 || id === currentTextModuleContextId;
						}
					}
				})
			},
			'Code': {
				maxLength: 252
			},
			'TextModuleTypeFk': {
				label: {
					text: 'Text Module Type',
					key: MODULE_INFO_TEXTMODULES.basicsCustomizeModuleName + '.textmoduletype'
				},
				type: FieldType.Lookup,
				visible: true,
				lookupOptions: createLookup<ITextModuleEntity, LookupSimpleEntity>({
					dataServiceToken: BasicsSharedTextModuleTypeSimpleLookupService
				})
			},

			'TextFormatFk': {
				label: {
					text: 'Text Format',
					key: MODULE_INFO_TEXTMODULES.textModulesModuleName + '.textFormat'
				},
				visible: true,
				type: FieldType.Lookup,
				lookupOptions: createLookup<ITextModuleEntity, LookupSimpleEntity>({
					dataServiceToken: BasicsSharedTextFormatSimpleLookupService
				})
			},
			'Client': {
				label: {
					text: 'Client',
					key: MODULE_INFO_TEXTMODULES.textModulesModuleName + '.client'
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup<ITextModuleEntity, ICompanyEntity>({
					dataServiceToken: BasicsCompanyLookupService,
					descriptionMember: 'CompanyName',
				})
			},
			'RubricFk': {
				label: {
					text: 'Rubric',
					key: MODULE_INFO_TEXTMODULES.basicsCustomizeModuleName + '.rubric'
				},
				visible: true,
				type: FieldType.Lookup,
				lookupOptions: createLookup<ITextModuleEntity, LookupSimpleEntity>({
					dataServiceToken: BasicsSharedRubricSimpleLookupService
				})
			},
			'ClerkFk': {
				label: {
					text: 'Clerk',
					key: MODULE_INFO_TEXTMODULES.cloudCommonModuleName + '.entityClerk'
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup<ITextModuleEntity, IBasicsClerkEntity>({
					dataServiceToken: BasicsSharedClerkLookupService,
					showClearButton: true,
					descriptionMember: 'Description',
				})
			},
			'AccessRoleFk': { //TODO hzh, Wait for lookup in usermanagement
				label: {
					text: 'Access Role',
					key: MODULE_INFO_TEXTMODULES.textModulesModuleName + '.accessRole'
				},
				visible: true
			},
			// 'AccessRoleFk': {
			// 	detail: {
			// 		type: 'directive',
			// 		directive: 'basics-lookupdata-lookup-composite',
			// 		options: {
			// 			lookupDirective: 'usermanagement-right-role-dialog',
			// 			descriptionMember: 'Description',
			// 			lookupOptions: {
			// 				showClearButton: true
			// 			}
			// 		}
			// 	},
			// 	grid: {
			// 		editor: 'lookup',
			// 		directive: 'basics-lookupdata-lookup-composite',
			// 		editorOptions: {
			// 			lookupDirective: 'usermanagement-right-role-dialog',
			// 			lookupOptions: {
			// 				showClearButton: true,
			// 				displayMember: 'Name'
			// 			}
			// 		},
			// 		formatter: 'lookup',
			// 		formatterOptions: {
			// 			lookupType: 'AccessRole',
			// 			displayMember: 'Name'
			// 		}
			// 	}
			// },
			'PortalUserGroupFk': {
				label: {
					text: 'Portal Group',
					key: MODULE_INFO_TEXTMODULES.textModulesModuleName + '.portalUserGroup'
				},
				visible: true,
				type: FieldType.Lookup,
				lookupOptions: createLookup<ITextModuleEntity, LookupSimpleEntity>({
					dataServiceToken: BasicsSharedPortalUserGroupSimpleLookupService
				})
			}
		}
	},
	permissionUuid: 'd4c817e7940a4a6a86472934b94ed186'
});
